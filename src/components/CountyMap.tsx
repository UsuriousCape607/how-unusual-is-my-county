import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { CountyMetric, Facility } from "../types";
import { statusLabel } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { COLOR, MAP, RAMP, comparisonOf, type Comparison } from "../lib/theme";
import { attachSmoothWheelZoom } from "../lib/smoothWheelZoom";

export type SelectionSource = "map" | "other";
type MapView = "county" | "similar" | "shaded";

interface Props {
  counties: FeatureCollection;
  countyBorders: FeatureCollection;
  states: FeatureCollection;
  byGeoid: Map<string, CountyMetric>;
  selected: string;
  peerGeoids: string[];
  facilities: Facility[];
  selectionSource: SelectionSource;
  onSelect: (geoid: string, source: SelectionSource) => void;
}

interface HoverInfo {
  title: string;
  lines: string[];
}

// Site markers are fixed-size; below this zoom they pile up and hide the county itself.
const MARKER_MIN_ZOOM = 6;
const LOWER_48 = L.latLngBounds([24.4, -125], [49.5, -66.9]);
const OFF_MAINLAND = new Set(["02", "15"]); // Alaska, Hawaii
const VIEWS: MapView[] = ["county", "similar", "shaded"];
const CMP_COLOR: Record<Comparison, string> = { fewer: COLOR.fewer, same: COLOR.same, more: COLOR.more };

function rampColor(n: number): string {
  let c = RAMP[0].color;
  for (const b of RAMP) if (n >= b.min) c = b.color;
  return c;
}

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export default function CountyMap(props: Props) {
  const { counties, countyBorders, states, byGeoid, selected, peerGeoids, facilities, selectionSource, onSelect } = props;
  const m = useM();
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const base = useRef<L.GeoJSON | null>(null);
  const highlight = useRef<L.LayerGroup | null>(null);
  const hoverLayer = useRef<L.LayerGroup | null>(null);
  const markers = useRef<L.LayerGroup | null>(null);
  const layers = useRef(new Map<string, L.Polygon>());
  // One shared canvas: a second canvas would sit on top and swallow county hover/clicks.
  const renderer = useRef<L.Canvas | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [view, setView] = useState<MapView>("county");
  const [markersVisible, setMarkersVisible] = useState(false);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const camera = useRef<{ sel: string | null; view: MapView }>({ sel: null, view });
  const moveToken = useRef(0);
  const shadedRef = useRef(false);
  // True while the camera is moving (wheel gesture or animated move); hover work is paused then.
  const moving = useRef(false);

  const featureById = useMemo(() => new Map(counties.features.map((f) => [f.properties?.geoid as string, f])), [counties]);
  const own = byGeoid.get(selected)?.pipeline_count ?? 0;
  const peerCmp = useMemo(
    () => new Map(peerGeoids.map((g) => [g, comparisonOf(byGeoid.get(g)?.pipeline_count ?? 0, own)])),
    [peerGeoids, byGeoid, own],
  );
  const cmpCounts = useMemo(() => {
    const c: Record<Comparison, number> = { fewer: 0, same: 0, more: 0 };
    peerCmp.forEach((v) => c[v]++);
    return c;
  }, [peerCmp]);

  // Kept in a ref so Leaflet event handlers (bound once) always describe the current selection.
  const describe = useRef<(geoid: string) => HoverInfo | null>(() => null);
  describe.current = (geoid: string) => {
    const c = byGeoid.get(geoid);
    if (!c) return null;
    const n = c.pipeline_count;
    const lines = [m.sitesInDev(n)];
    if (geoid === selected) lines.push(m.thisCounty);
    else if (peerCmp.has(geoid)) lines.push(m.hoverSimilar[peerCmp.get(geoid)!](byGeoid.get(selected)?.county_name ?? ""));
    else lines.push(m.clickToCompare);
    return { title: `${c.county_name}, ${c.state}`, lines };
  };

  /** Similar counties outside the lower 48 are listed instead of zooming the map out to include them. */
  const selectedOffMainland = OFF_MAINLAND.has(selected.slice(0, 2));
  const offMap = selectedOffMainland ? [] : peerGeoids.filter((g) => OFF_MAINLAND.has(g.slice(0, 2)));

  const target = (v: MapView): [L.LatLngBounds, number, number] | null => {
    const sel = layers.current.get(selected);
    if (!sel) return null;
    if (v === "county") return [sel.getBounds(), 8, 1];
    if (v === "similar") {
      const b = L.latLngBounds(sel.getBounds().getSouthWest(), sel.getBounds().getNorthEast());
      peerGeoids.forEach((g) => {
        const l = layers.current.get(g);
        if (l && (selectedOffMainland || !OFF_MAINLAND.has(g.slice(0, 2)))) b.extend(l.getBounds());
      });
      return [b, 7, 0];
    }
    return [selectedOffMainland ? L.latLngBounds(LOWER_48.getSouthWest(), LOWER_48.getNorthEast()).extend(sel.getBounds()) : LOWER_48, 5, 0];
  };

  /**
   * Short moves glide. Large reframes cross-fade instead of flying: Leaflet scales the old canvas during a flight,
   * so a big zoom-out shows blank map until it redraws. Fading the map out, jumping, and fading back in avoids that
   * (apple-design: fade large surfaces during a large reposition). Every move cancels the previous one.
   */
  const go = (v: MapView, animate: boolean) => {
    const map = mapRef.current;
    const t = target(v);
    if (!map || !t) return;
    const token = ++moveToken.current;
    const pane = map.getPane("mapPane")!;
    const run = () => {
      if (token !== moveToken.current) return;
      // Not map.stop(): it snaps a fractional zoom (left by smooth wheel zoom) with an animation that would swallow this move.
      (map as unknown as { _stop(): void })._stop();
      const fit = map.getBoundsZoom(t[0], false, L.point(48, 48));
      const zoom = Math.max(map.getMinZoom(), Math.min(fit, t[1]) - t[2]);
      const center = t[0].getCenter();
      const large = Math.abs(zoom - map.getZoom()) > 1.25 || !map.getBounds().contains(center);
      if (!animate) {
        pane.style.opacity = "1";
        map.setView(center, zoom, { animate: false });
      } else if (large || reducedMotion()) {
        pane.style.transition = "opacity 140ms ease-out";
        pane.style.opacity = "0";
        window.setTimeout(() => {
          if (token !== moveToken.current) return;
          map.setView(center, zoom, { animate: false });
          requestAnimationFrame(() => {
            pane.style.transition = "opacity 240ms ease-out";
            pane.style.opacity = "1";
          });
        }, 140);
      } else {
        pane.style.opacity = "1";
        map.flyTo(center, zoom, { duration: 0.45 });
      }
    };
    // Leaflet ignores new zoom requests while a wheel/pinch zoom animation runs, so wait for it to end.
    if ((map as unknown as { _animatingZoom?: boolean })._animatingZoom) map.once("zoomend", run);
    else run();
  };

  // Create the map once.
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, {
      preferCanvas: true, zoomControl: false, zoomSnap: 0.25, zoomDelta: 0.5, scrollWheelZoom: false, // see smoothWheelZoom
      minZoom: 2.5, maxZoom: 11, maxBounds: L.latLngBounds([5, -200], [76, -40]), maxBoundsViscosity: 0.85,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
    map.attributionControl.addAttribution(
      'Census Bureau 2025 · <a href="https://github.com/ek33450505/compute-atlas">Compute Atlas</a> (CC BY 4.0)',
    );
    const r = L.canvas({ padding: 0.5, tolerance: 3 });
    renderer.current = r;
    layers.current.clear();
    base.current = L.geoJSON(counties, {
      renderer: r,
      style: { stroke: false, fillColor: MAP.land, fillOpacity: 1 },
      onEachFeature: (f, lyr) => {
        const geoid: string = f.properties.geoid;
        layers.current.set(geoid, lyr as L.Polygon);
        lyr.on("click", () => onSelectRef.current(geoid, "map"));
        lyr.on("mouseover", () => {
          if (moving.current) return;
          setHover(describe.current(geoid));
          hoverLayer.current?.clearLayers();
          if (hoverLayer.current) {
            L.polygon((lyr as L.Polygon).getLatLngs() as L.LatLngExpression[][], {
              renderer: r, interactive: false, fill: false, color: MAP.hover, weight: 1.5, opacity: 0.9,
            }).addTo(hoverLayer.current);
          }
        });
        lyr.on("mouseout", () => {
          setHover(null);
          hoverLayer.current?.clearLayers();
        });
      },
    } as L.GeoJSONOptions).addTo(map);
    L.geoJSON(countyBorders, { renderer: r, interactive: false, style: { color: MAP.countyLine, weight: 0.7, opacity: 1 } } as L.GeoJSONOptions).addTo(map);
    L.geoJSON(states, { renderer: r, interactive: false, style: { color: MAP.stateLine, weight: 1.3, opacity: 1 } } as L.GeoJSONOptions).addTo(map);
    highlight.current = L.layerGroup().addTo(map);
    hoverLayer.current = L.layerGroup().addTo(map);
    const group = L.layerGroup();
    markers.current = group;
    map.on("zoomend", () => {
      const show = map.getZoom() >= MARKER_MIN_ZOOM;
      if (show && !map.hasLayer(group)) group.addTo(map);
      if (!show && map.hasLayer(group)) map.removeLayer(group);
      setMarkersVisible(show);
    });
    // Current camera as a plain attribute, so tests can check when the view moves.
    map.on("moveend", () => {
      const c = map.getCenter();
      container.current?.setAttribute("data-view", `${c.lat.toFixed(4)},${c.lng.toFixed(4)},${+map.getZoom().toFixed(2)}`);
    });
    const clearHover = () => {
      setHover(null);
      hoverLayer.current?.clearLayers();
    };
    const detachWheel = attachSmoothWheelZoom(map, (on) => {
      moving.current = on;
      if (on) clearHover();
    });
    map.on("movestart", () => (moving.current = true));
    map.on("moveend", () => (moving.current = false));
    map.fitBounds(LOWER_48);
    camera.current = { sel: null, view: camera.current.view };
    mapRef.current = map;
    return () => {
      detachWheel();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counties, countyBorders, states]);

  // Shading of the base layer changes only when entering or leaving the "All counties" view.
  useEffect(() => {
    const shaded = view === "shaded";
    if (!base.current || shadedRef.current === shaded) return;
    shadedRef.current = shaded;
    base.current.setStyle(((f: Feature) => ({
      stroke: false,
      fillOpacity: 1,
      fillColor: shaded ? rampColor(byGeoid.get(f.properties?.geoid)?.pipeline_count ?? 0) : MAP.land,
    })) as unknown as L.PathOptions);
  }, [view, byGeoid]);

  // Highlights (this county + similar counties, translucent so borders and markers show through) and camera.
  useEffect(() => {
    const group = highlight.current;
    const r = renderer.current;
    if (!group || !r) return;
    group.clearLayers();
    const shaded = view === "shaded";
    if (!shaded) {
      peerGeoids.forEach((g) => {
        const f = featureById.get(g);
        const c = CMP_COLOR[peerCmp.get(g) ?? "same"];
        if (f) L.geoJSON(f, { renderer: r, interactive: false, style: { color: c, weight: 1.3, fillColor: c, fillOpacity: 0.28 } } as L.GeoJSONOptions).addTo(group);
      });
    }
    const sf = featureById.get(selected);
    if (sf) {
      L.geoJSON(sf, {
        renderer: r, interactive: false,
        style: shaded ? { color: COLOR.ink, weight: 2.4, fill: false } : { color: COLOR.blue, weight: 2.4, fillColor: COLOR.blue, fillOpacity: 0.22 },
      } as L.GeoJSONOptions).addTo(group);
    }
    if (markers.current && mapRef.current?.hasLayer(markers.current)) {
      markers.current.eachLayer((m) => (m as L.CircleMarker).bringToFront());
    }
    const first = camera.current.sel === null;
    const selChanged = camera.current.sel !== selected;
    const viewChanged = camera.current.view !== view;
    camera.current = { sel: selected, view };
    if (first) go(view, false);
    else if (viewChanged) go(view, true);
    else if (selChanged && selectionSource !== "map" && view !== "shaded") go(view, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, peerGeoids, view, selectionSource, featureById, peerCmp]);

  // Site markers for the selected county: a solid dot for exact locations, a translucent halo for approximate
  // ones (the familiar "location accuracy" circle). Nearby approximate points share one halo.
  useEffect(() => {
    const group = markers.current;
    const r = renderer.current ?? undefined;
    if (!group) return;
    group.clearLayers();
    const show = (info: HoverInfo) => () => {
      if (!moving.current) setHover(info);
    };
    const hide = () => setHover(null);
    const approx = new Map<string, Facility[]>();
    for (const f of facilities) {
      if (f.metric !== "pipeline" || f.latitude === undefined || f.longitude === undefined) continue;
      if (f.location_precision === "exact") {
        L.circleMarker([f.latitude, f.longitude], { renderer: r, radius: 5.5, color: "#ffffff", weight: 2, fillColor: COLOR.blue, fillOpacity: 1 })
          .on("mouseover", show({ title: f.name ?? f.source_id, lines: [statusLabel(f.status) ?? "", m.exactLocation] }))
          .on("mouseout", hide)
          .addTo(group);
      } else {
        // Approximate points are city-level stand-ins: group those within ~0.1° (about 10 km).
        const key = `${f.latitude.toFixed(1)},${f.longitude.toFixed(1)}`;
        approx.set(key, [...(approx.get(key) ?? []), f]);
      }
    }
    for (const recs of approx.values()) {
      const names = recs.slice(0, 4).map((f) => f.name ?? f.source_id);
      const info: HoverInfo = recs.length === 1
        ? { title: names[0], lines: [statusLabel(recs[0].status) ?? "", m.approxLocation] }
        : { title: m.approxArea(recs.length), lines: [...names, ...(recs.length > 4 ? [m.andMore(recs.length - 4)] : []), m.approxLocations] };
      L.circleMarker([recs[0].latitude!, recs[0].longitude!], {
        renderer: r, radius: Math.min(22, 13 + 2.5 * Math.log2(recs.length)),
        color: COLOR.blue, weight: 1, opacity: 0.55, fillColor: COLOR.blue, fillOpacity: 0.14,
      })
        .on("mouseover", show(info))
        .on("mouseout", hide)
        .addTo(group);
    }
  }, [facilities, m]);

  const choose = (v: MapView) => (v === view ? go(v, true) : setView(v));
  const nExact = facilities.filter((f) => f.metric === "pipeline" && f.location_precision === "exact").length;
  const nApprox = facilities.filter((f) => f.metric === "pipeline" && f.location_precision === "approximate").length;

  return (
    <section className="card map-card" aria-labelledby="map-title">
      <div className="map-head">
        <h3 id="map-title">{m.mapTitle}</h3>
        <div className="segmented" role="group" aria-label={m.mapViewAria}>
          {VIEWS.map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => choose(v)}>
              {m.view[v]}
            </button>
          ))}
        </div>
      </div>
      <div className="map-frame">
        <div ref={container} className="map" role="region" aria-label={m.mapAria} />
        {/* Hover details live in a card pinned inside the frame, so they are never clipped by the map edge. */}
        <div className={`map-hover${hover ? " on" : ""}`} aria-hidden="true">
          {hover && (
            <>
              <strong>{hover.title}</strong>
              {hover.lines.filter(Boolean).map((l) => (
                <span key={l}>{l}</span>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="legend">
        {view !== "shaded" ? (
          <>
            <span><i className="sw" style={{ background: COLOR.blue }} /> {m.thisCounty}</span>
            <span className="legend-group">
              {m.legendSimilarWith}
              <span><i className="sw" style={{ background: COLOR.fewer }} /> {m.legend.fewer(cmpCounts.fewer)}</span>
              <span><i className="sw" style={{ background: COLOR.same }} /> {m.legend.same(cmpCounts.same)}</span>
              <span><i className="sw" style={{ background: COLOR.more }} /> {m.legend.more(cmpCounts.more)}</span>
            </span>
          </>
        ) : (
          <span className="legend-group">
            {m.legendSites}
            {RAMP.map((b) => (
              <span key={b.label}><i className="sw" style={{ background: b.color }} /> {b.label}</span>
            ))}
            <span><i className="sw outline" /> {m.legendThisCounty}</span>
          </span>
        )}
        {nExact > 0 && <span><i className="dot exact" /> {m.legendExact(nExact)}</span>}
        {nApprox > 0 && <span><i className="dot approx" /> {m.legendApprox(nApprox)}</span>}
        {nExact + nApprox > 0 && !markersVisible && <span className="muted">{m.zoomHint}</span>}
      </div>
      {view === "similar" && offMap.length > 0 && (
        <p className="muted small">
          {m.offMap(offMap.map((g) => `${byGeoid.get(g)?.county_name}, ${byGeoid.get(g)?.state}`).join("; "))}
        </p>
      )}
    </section>
  );
}
