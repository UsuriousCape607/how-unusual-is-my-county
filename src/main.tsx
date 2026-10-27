import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Show focus rings for keyboard users only (a mouse click on the map should not draw a ring around it).
const root = document.documentElement;
window.addEventListener("keydown", (e) => { if (e.key === "Tab") root.classList.add("kbd"); });
window.addEventListener("pointerdown", () => root.classList.remove("kbd"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
