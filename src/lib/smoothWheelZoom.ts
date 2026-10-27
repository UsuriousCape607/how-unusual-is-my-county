import L from "leaflet";

/**
 * Continuous mouse-wheel / trackpad zoom that behaves like pinch-zoom on touch screens.
 *
 * Leaflet's built-in wheel zoom turns scrolling into discrete animated steps, ignores input that arrives while a step
 * is animating, and redraws the whole canvas after every step (each redraw of ~3,000 counties is a 100–180 ms
 * freeze). Here every wheel event moves a goal zoom; each animation frame eases the view toward it with a cheap CSS
 * transform (the same path Leaflet uses for pinch), keeping the point under the cursor fixed; the canvas redraws once
 * when the gesture settles. Uses Leaflet's internal _move/_moveStart/_moveEnd, as its own pinch handler does.
 */
interface LeafletInternals {
  _stop(): void;
  _move(center: L.LatLng, zoom: number): void;
  _moveStart(zoomChanged: boolean, noMoveStart: boolean): void;
  _moveEnd(zoomChanged: boolean): void;
}

const SETTLE_MS = 140; // gesture ends this long after the last wheel event (once the view has caught up)
const EASE = 0.28; // fraction of the remaining distance covered per frame

export function attachSmoothWheelZoom(map: L.Map, onActiveChange?: (active: boolean) => void): () => void {
  const el = map.getContainer();
  const m = map as unknown as LeafletInternals;
  let active = false;
  let ending = false;
  let goal = 0;
  let raf = 0;
  let timer = 0;
  let cursor = L.point(0, 0);
  // Set when a gesture starts (the map may not have a view yet when this is attached).
  let anchor = L.latLng(0, 0); // the map location kept under the cursor
  let lastCenter = L.latLng(0, 0);
  let lastZoom = 0;

  const finish = () => {
    if (!active) return;
    active = false;
    ending = false;
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    m._moveEnd(true); // one redraw for the whole gesture
    onActiveChange?.(false);
  };

  const frame = () => {
    // Something else (a button, a camera move) changed the view: hand control back.
    if (!map.getCenter().equals(lastCenter) || map.getZoom() !== lastZoom) {
      finish();
      return;
    }
    const z0 = map.getZoom();
    let z = z0 + (goal - z0) * EASE;
    if (Math.abs(goal - z) < 0.002) z = goal;
    if (z !== z0) {
      const offset = cursor.subtract(map.getSize().divideBy(2));
      m._move(map.unproject(map.project(anchor, z).subtract(offset), z), z);
    }
    lastCenter = map.getCenter();
    lastZoom = map.getZoom();
    if (ending && z === goal) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    cursor = map.mouseEventToContainerPoint(e as unknown as MouseEvent);
    if (!active) {
      active = true;
      // Not map.stop(): that also snaps a fractional zoom to zoomSnap with an animation, which would fight this gesture.
      m._stop();
      goal = map.getZoom();
      lastCenter = map.getCenter();
      lastZoom = map.getZoom();
      m._moveStart(true, false);
      onActiveChange?.(true);
      raf = requestAnimationFrame(frame);
    }
    // Re-anchor on the point currently under the cursor, so moving the mouse mid-gesture zooms around the new spot.
    anchor = map.containerPointToLatLng(cursor);
    ending = false;
    // Normalise: lines/pages to pixels; trackpad pinch arrives as ctrl+wheel with small deltas, so weight it more.
    const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
    const perPx = e.ctrlKey ? 0.012 : 0.0035;
    goal = Math.min(map.getMaxZoom(), Math.max(map.getMinZoom(), goal - px * perPx));
    window.clearTimeout(timer);
    timer = window.setTimeout(() => (ending = true), SETTLE_MS);
  };

  el.addEventListener("wheel", onWheel, { passive: false });
  return () => {
    el.removeEventListener("wheel", onWheel);
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
  };
}
