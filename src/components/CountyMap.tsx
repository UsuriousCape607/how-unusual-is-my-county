import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { CountyMetric, Facility } from "../types";
import { plural, statusLabel } from "../lib/format";

interface Props {
  counties: FeatureCollection;
  states: FeatureCollection;
  byGeoid: Map<string, CountyMetric>;
  selected: string;
  peerGeoids: string[];
  facilities: Facility[];
  onSelect: (geoid: string) => void;
}

const NAVY = "#13294b";
const PEER_FILL = "#8fcbcc";
const PEER_STROKE = "#1f6f71";
// Record markers are fixed-size rings; below this zoom they pile up and hide the county itself.
const MARKER_MIN_ZOOM = 6;
const LOWER_48: L.LatLngBoundsExpression = [[24.4, -125], [49.5, -66.9]];
export const BINS: { min: number; label: string; color: string }[] = [
  { min: 0, label: "0", color: "#ffffff" },
  { min: 1, label: "1", color: "#d3ebeb" },
  { min: 2, label: "2–3", color: "#a0d2d3" },
  { min: 4, label: "4–9", color: "#5cafb1" },
  { min: 10, label: "10+", color: "#217d80" },
];

function binColor(n: number): string {
  let c = BINS[0].color;
  for (const b of BINS) if (n >= b.min) c = b.color;
  return c;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

export default function CountyMap({ counties, states, byGeoid, selected, peerGeoids, facilities, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const countyLayer = useRef<L.GeoJSON | null>(null);
  const layers = useRef(new Map<string, L.Polygon>());
  const markers = useRef<L.LayerGroup | null>(null);
  // One shared canvas: a second canvas (e.g. for markers) would sit on top and swallow county hover/clicks.
  const renderer = useRef<L.Canvas | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [choropleth, setChoropleth] = useState(false);
  const [markersVisible, setMarkersVisible] = useState(false);
  const view = useRef({ selected, peers: new Set(peerGeoids), choropleth });
  const lastFitted = useRef<string | null>(null);

  const styleFor = (geoid: string): L.PathOptions => {
    const { selected: sel, peers, choropleth: ch } = view.current;
    const isSel = geoid === sel;
    const isPeer = peers.has(geoid);
    let fillColor = ch ? binColor(byGeoid.get(geoid)?.pipeline_count ?? 0) : "#ffffff";
    if (!ch && isPeer) fillColor = PEER_FILL;
    if (!ch && isSel) fillColor = NAVY;
    return {
      color: isSel ? NAVY : isPeer ? PEER_STROKE : "#c5ced8",
      weight: isSel ? 2.6 : isPeer ? 1.4 : 0.35,
      fillColor,
      fillOpacity: 1,
    };
  };

  // Create the map once.
  useEffect(() => {
    if (!container.current) return;
    // zoomAnimation is off because Leaflet silently drops zoom requests made during an animated zoom.
    const map = L.map(container.current, { preferCanvas: true, zoomAnimation: false, zoomSnap: 0.25, minZoom: 2, maxZoom: 11 });
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
        lyr.on("click", () => onSelectRef.current(geoid));
        lyr.bindTooltip(
          () => {
            const c = byGeoid.get(geoid);
            if (!c) return geoid;
            const n = c.pipeline_count;
            return `<strong>${esc(c.county_name)}, ${c.state}</strong><br>${n} pipeline ${plural(n, "record", "records")}`;
          },
          { sticky: true, direction: "top", opacity: 0.95 },
        );
      },
    } as L.GeoJSONOptions).addTo(map);
    L.geoJSON(states, { renderer: renderer.current, interactive: false, style: { fill: false, color: "#8592a3", weight: 0.9 } } as L.GeoJSONOptions).addTo(map);
    const group = L.layerGroup();
    markers.current = group;
    map.on("zoomend", () => {
      const show = map.getZoom() >= MARKER_MIN_ZOOM;
      if (show && !map.hasLayer(group)) group.addTo(map);
      if (!show && map.hasLayer(group)) map.removeLayer(group);
      setMarkersVisible(show);
    });
    map.fitBounds(LOWER_48);
    lastFitted.current = null;
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counties, states]);

  const fitSelection = (withPeers: boolean) => {
    const map = mapRef.current;
    const sel = layers.current.get(view.current.selected);
    if (!map || !sel) return;
    const b = L.latLngBounds(sel.getBounds().getSouthWest(), sel.getBounds().getNorthEast());
    if (withPeers) view.current.peers.forEach((g) => { const l = layers.current.get(g); if (l) b.extend(l.getBounds()); });
    map.fitBounds(b, { padding: [24, 24], maxZoom: withPeers ? 7 : 9 });
  };

  // Restyle and refit when the selection, peers or shading mode change.
  useEffect(() => {
    view.current = { selected, peers: new Set(peerGeoids), choropleth };
    const layer = countyLayer.current;
    if (!layer) return;
    layer.setStyle(((f: Feature) => styleFor(f.properties?.geoid)) as unknown as L.PathOptions);
    peerGeoids.forEach((g) => layers.current.get(g)?.bringToFront());
    layers.current.get(selected)?.bringToFront();
    if (markers.current && mapRef.current?.hasLayer(markers.current)) {
      markers.current.eachLayer((m) => (m as L.CircleMarker).bringToFront());
    }
    if (lastFitted.current !== selected) {
      lastFitted.current = selected;
      fitSelection(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, peerGeoids, choropleth]);

  // Facility markers for the selected county (pipeline records only).
  useEffect(() => {
    const group = markers.current;
    if (!group) return;
    group.clearLayers();
    for (const f of facilities) {
      if (f.metric !== "pipeline" || f.latitude === undefined || f.longitude === undefined) continue;
      const ll: L.LatLngExpression = [f.latitude, f.longitude];
      const tip = `<strong>${esc(f.name ?? f.source_id)}</strong><br>${statusLabel(f.status) ?? ""}<br>${
        f.location_precision === "exact" ? "Exact coordinates" : "Approximate location: a representative point, not a precise site"
      }`;
      if (f.location_precision === "exact") {
        L.circleMarker(ll, { renderer: renderer.current ?? undefined, radius: 5, color: NAVY, weight: 1.5, fillColor: "#ffffff", fillOpacity: 1 }).bindTooltip(tip).addTo(group);
      } else {
        L.circleMarker(ll, { renderer: renderer.current ?? undefined, radius: 11, color: NAVY, weight: 3.5, fill: false, interactive: false }).addTo(group);
        L.circleMarker(ll, { renderer: renderer.current ?? undefined, radius: 11, color: "#ffffff", weight: 2, dashArray: "4 3", fillColor: "#ffffff", fillOpacity: 0.12 })
          .bindTooltip(tip)
          .addTo(group);
      }
    }
  }, [facilities]);

  const nExact = facilities.filter((f) => f.metric === "pipeline" && f.location_precision === "exact").length;
  const nApprox = facilities.filter((f) => f.metric === "pipeline" && f.location_precision === "approximate").length;

  return (
    <section className="card map-card" aria-labelledby="map-title">
      <div className="map-head">
        <h3 id="map-title">Where the peers are</h3>
        <div className="map-controls">
          <button type="button" onClick={() => fitSelection(false)}>Zoom to county</button>
          <button type="button" onClick={() => fitSelection(true)}>Show peers</button>
          <button type="button" onClick={() => mapRef.current?.fitBounds(LOWER_48)}>Lower 48</button>
        </div>
      </div>
      <div ref={container} className="map" role="region" aria-label="National county map. Select a county to compare it." />
      <div className="legend">
        {!choropleth && (
          <>
            <span><i className="sw" style={{ background: NAVY }} /> Selected county</span>
            <span><i className="sw" style={{ background: PEER_FILL, borderColor: PEER_STROKE }} /> 40 peer counties</span>
          </>
        )}
        {choropleth && (
          <span className="bins">
            Pipeline records:
            {BINS.map((b) => (
              <span key={b.label}><i className="sw" style={{ background: b.color }} /> {b.label}</span>
            ))}
            <span><i className="sw outline" style={{ borderColor: NAVY }} /> selected</span>
            <span><i className="sw outline" style={{ borderColor: PEER_STROKE }} /> peers</span>
          </span>
        )}
        {nExact > 0 && <span><i className="dot exact" /> Exact site ({nExact})</span>}
        {nApprox > 0 && <span><i className="dot approx" /> Approximate location ({nApprox})</span>}
        {nExact + nApprox > 0 && !markersVisible && (
          <span className="muted">Use “Zoom to county” to see record locations.</span>
        )}
        <label className="toggle">
          <input type="checkbox" checked={choropleth} onChange={(e) => setChoropleth(e.target.checked)} /> Shade all counties by
          pipeline records
        </label>
      </div>
      <p className="muted small">
        Approximate locations are representative points (dashed rings), not surveyed sites. Peers are matched on population and
        density, so they can be anywhere in the country.
      </p>
    </section>
  );
}
