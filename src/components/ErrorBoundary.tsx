import { Component, type ReactNode } from "react";
import { getM } from "../i18n/state";

interface State {
  error: Error | null;
}

/** If anything fails while rendering, show a calm recovery message instead of a blank page. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Render error:", error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const m = getM();
    return (
      <main className="wrap">
        <div className="state-box error-page" role="alert">
          <h2>{m.errorTitle}</h2>
          <p>{m.errorBody}</p>
          <button type="button" className="primary" onClick={() => window.location.reload()}>
            {m.reload}
          </button>
        </div>
      </main>
    );
  }
}
