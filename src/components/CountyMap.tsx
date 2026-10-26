import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { CountyMetric, Facility } from "../types";
import { plural, statusLabel } from "../lib/format";

export type SelectionSource = "map" | "other";
type MapView = "county" | "similar" | "shaded";

interface Props {
  counties: FeatureCollection;
  states: FeatureCollection;
  byGeoid: Map<string, CountyMetric>;
  selected: string;
  peerGeoids: string[];
  facilities: Facility[];
  selectionSource: SelectionSource;
  onSelect: (geoid: string, source: SelectionSource) => void;
}

export const NAVY = "#13294b";
export const PEER_FILL = "#8fcbcc";
export const PEER_STROKE = "#1f6f71";
// Record markers are fixed-size rings; below this zoom they pile up and hide the county itself.
const MARKER_MIN_ZOOM = 6;
const LOWER_48 = L.latLngBounds([24.4, -125], [49.5, -66.9]);
const OFF_MAINLAND = new Set(["02", "15"]); // Alaska, Hawaii
export const BINS: { min: number; label: string; color: string }[] = [
  { min: 0, label: "0", color: "#ffffff" },
  { min: 1, label: "1", color: "#d3ebeb" },
  { min: 2, label: "2–3", color: "#a0d2d3" },
  { min: 4, label: "4–9", color: "#5cafb1" },
  { min: 10, label: "10+", color: "#217d80" },
];
const VIEWS: { id: MapView; label: string }[] = [
  { id: "county", label: "This county" },
  { id: "similar", label: "Similar counties" },
  { id: "shaded", label: "All counties" },
];

function binColor(n: number): string {
  let c = BINS[0].color;
  for (const b of BINS) if (n >= b.min) c = b.color;
  return c;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** Move the camera smoothly (or instantly), never dropping the request. */
function moveCamera(map: L.Map, bounds: L.LatLngBounds, maxZoom: number, zoomOut: number, animate: boolean) {
  const go = () => {
    map.stop();
    const fit = map.getBoundsZoom(bounds, false, L.point(56, 56));
    const zoom = Math.max(map.getMinZoom(), Math.min(fit, maxZoom) - zoomOut);
    if (animate) map.flyTo(bounds.getCenter(), zoom, { duration: 0.8 });
    else map.setView(bounds.getCenter(), zoom, { animate: false });
  };
  // Leaflet ignores new zoom requests while a wheel/pinch zoom animation is running, so wait for it to end.
  if ((map as unknown as { _animatingZoom?: boolean })._animatingZoom) map.once("zoomend", go);
  else go();
}

export default function CountyMap({ counties, states, byGeoid, selected, peerGeoids, facilities, selectionSource, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const countyLayer = useRef<L.GeoJSON | null>(null);
  const layers = useRef(new Map<string, L.Polygon>());
  const markers = useRef<L.LayerGroup | null>(null);
  // One shared canvas: a second canvas (e.g. for markers) would sit on top and swallow county hover/clicks.
  const renderer = useRef<L.Canvas | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [view, setView] = useState<MapView>("county");
  const [markersVisible, setMarkersVisible] = useState(false);
  const styleState = useRef({ selected, peers: new Set(peerGeoids), shaded: false });
  const camera = useRef<{ sel: string | null; view: MapView }>({ sel: null, view });

  const styleFor = (geoid: string): L.PathOptions => {
    const { selected: sel, peers, shaded } = styleState.current;
    const isSel = geoid === sel;
    const isPeer = peers.has(geoid);
    let fillColor = shaded ? binColor(byGeoid.get(geoid)?.pipeline_count ?? 0) : "#ffffff";
    if (!shaded && isPeer) fillColor = PEER_FILL;
    if (!shaded && isSel) fillColor = NAVY;
    return {
      color: isSel ? NAVY : isPeer ? PEER_STROKE : "#c5ced8",
      weight: isSel ? 2.6 : isPeer ? 1.4 : 0.35,
      fillColor,
      fillOpacity: 1,
    };
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

  const go = (v: MapView, animate: boolean) => {
    const map = mapRef.current;
    const t = target(v);
    if (map && t) moveCamera(map, t[0], t[1], t[2], animate && !reducedMotion());
  };

  // Create the map once.
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { preferCanvas: true, zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 90, minZoom: 2, maxZoom: 11 });
    map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
    map.attributionControl.addAttribution(
      'Census Bureau 2025 · <a href="https://github.com/ek33450505/compute-atlas">Compute Atlas</a> (CC BY 4.0)',
    );
    renderer.current = L.canvas({ padding: 0.5, tolerance: 3 });
    layers.current.clear();
    countyLayer.current = L.geoJSON(counties, {
      renderer: renderer.current,
      style: (f) => styleFor(f?.properties?.geoid),
      onEachFeature: (f, lyr) => {
        const geoid: string = f.properties.geoid;
        layers.current.set(geoid, lyr as L.Polygon);
        lyr.on("click", () => onSelectRef.current(geoid, "map"));
        lyr.bindTooltip(
          () => {
            const c = byGeoid.get(geoid);
            if (!c) return geoid;
            const n = c.pipeline_count;
            return `<strong>${esc(c.county_name)}, ${c.state}</strong><br>${n} ${plural(n, "site", "sites")} in development`;
          },
          { sticky: true, direction: "top", opacity: 0.95 },
        );
      },
    } as L.GeoJSONOptions).addTo(map);
    L.geoJSON(states, { renderer: renderer.current, interactive: false, style: { fill: false, color: "#8592a3", weight: 0.9 } } as L.GeoJSONOptions).addTo(map);
    const group = L.layerGroup();
    markers.current = group;
    // Current camera as a plain attribute, so tests can check when the view moves.
    map.on("moveend", () => {
      const c = map.getCenter();
      container.current?.setAttribute("data-view", `${c.lat.toFixed(4)},${c.lng.toFixed(4)},${map.getZoom()}`);
    });
    map.on("zoomend", () => {
      const show = map.getZoom() >= MARKER_MIN_ZOOM;
      if (show && !map.hasLayer(group)) group.addTo(map);
      if (!show && map.hasLayer(group)) map.removeLayer(group);
      setMarkersVisible(show);
    });
    map.fitBounds(LOWER_48);
    camera.current = { sel: null, view: camera.current.view };
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counties, states]);

  // Restyle on any change; move the camera only when it helps (see METHODOLOGY / NOTES: no jumps on map clicks).
  useEffect(() => {
    styleState.current = { selected, peers: new Set(peerGeoids), shaded: view === "shaded" };
    const layer = countyLayer.current;
    if (!layer) return;
    layer.setStyle(((f: Feature) => styleFor(f.properties?.geoid)) as unknown as L.PathOptions);
    peerGeoids.forEach((g) => layers.current.get(g)?.bringToFront());
    layers.current.get(selected)?.bringToFront();
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
  }, [selected, peerGeoids, view, selectionSource]);

  // Site markers for the selected county (pipeline records only).
  useEffect(() => {
    const group = markers.current;
    if (!group) return;
    group.clearLayers();
    const approx = new Map<string, Facility[]>();
    for (const f of facilities) {
      if (f.metric !== "pipeline" || f.latitude === undefined || f.longitude === undefined) continue;
      if (f.location_precision === "exact") {
        const tip = `<strong>${esc(f.name ?? f.source_id)}</strong><br>${statusLabel(f.status) ?? ""}<br>Exact location`;
        L.circleMarker([f.latitude, f.longitude], { renderer: renderer.current ?? undefined, radius: 5, color: NAVY, weight: 1.5, fillColor: "#ffffff", fillOpacity: 1 })
          .bindTooltip(tip)
          .addTo(group);
      } else {
        // Approximate points are city-level stand-ins, so group those within ~0.1° (about 10 km) into one ring placed on
        // the first record's own coordinate, rather than drawing an unreadable pile of overlapping rings.
        const key = `${f.latitude.toFixed(1)},${f.longitude.toFixed(1)}`;
        approx.set(key, [...(approx.get(key) ?? []), f]);
      }
    }
    for (const recs of approx.values()) {
      const ll: L.LatLngExpression = [recs[0].latitude!, recs[0].longitude!];
      const names = recs.slice(0, 5).map((f) => esc(f.name ?? f.source_id)).join("<br>");
      const more = recs.length > 5 ? `<br>and ${recs.length - 5} more` : "";
      const tip = recs.length === 1
        ? `<strong>${names}</strong><br>${statusLabel(recs[0].status) ?? ""}<br>Approximate location: a representative point, not the actual site`
        : `<strong>${recs.length} records in this approximate area</strong><br>${names}${more}<br><em>Representative points, not the actual sites</em>`;
      const radius = Math.min(18, 10 + 2 * Math.log2(recs.length));
      L.circleMarker(ll, { renderer: renderer.current ?? undefined, radius, color: NAVY, weight: 3.5, fill: false, interactive: false }).addTo(group);
      L.circleMarker(ll, { renderer: renderer.current ?? undefined, radius, color: "#ffffff", weight: 2, dashArray: "4 3", fillColor: "#ffffff", fillOpacity: 0.12 })
        .bindTooltip(tip)
        .addTo(group);
    }
  }, [facilities]);

  const choose = (v: MapView) => (v === view ? go(v, true) : setView(v));
  const nExact = facilities.filter((f) => f.metric === "pipeline" && f.location_precision === "exact").length;
  const nApprox = facilities.filter((f) => f.metric === "pipeline" && f.location_precision === "approximate").length;

  return (
    <section className="card map-card" aria-labelledby="map-title">
      <div className="map-head">
        <h3 id="map-title">Map</h3>
        <div className="segmented" role="group" aria-label="Map view">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => choose(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={container} className="map" role="region" aria-label="County map. Select a county to compare it." />
      <div className="legend">
        {view !== "shaded" ? (
          <>
            <span><i className="sw" style={{ background: NAVY }} /> This county</span>
            <span><i className="sw" style={{ background: PEER_FILL, borderColor: PEER_STROKE }} /> 40 similar counties</span>
          </>
        ) : (
          <span className="bins">
            Shaded by sites in development:
            {BINS.map((b) => (
              <span key={b.label}><i className="sw" style={{ background: b.color }} /> {b.label}</span>
            ))}
            <span><i className="sw outline" style={{ borderColor: NAVY }} /> this county</span>
            <span><i className="sw outline" style={{ borderColor: PEER_STROKE }} /> similar</span>
          </span>
        )}
        {nExact > 0 && <span><i className="dot exact" /> Exact location ({nExact})</span>}
        {nApprox > 0 && <span><i className="dot approx" /> Approximate location ({nApprox})</span>}
        {nExact + nApprox > 0 && !markersVisible && <span className="muted">Zoom in to see where the sites are.</span>}
      </div>
      {view === "similar" && offMap.length > 0 && (
        <p className="muted small">
          Also similar, outside the map view: {offMap.map((g) => `${byGeoid.get(g)?.county_name}, ${byGeoid.get(g)?.state}`).join("; ")}.
        </p>
      )}
      <p className="muted small">
        Click any county to compare it. Dashed rings are approximate locations, not actual sites.
      </p>
    </section>
  );
}
