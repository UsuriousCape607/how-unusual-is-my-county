import { Component, type ReactNode } from "react";

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
    return (
      <main className="wrap">
        <div className="state-box error-page" role="alert">
          <h2>Something went wrong</h2>
          <p>
            The page couldn’t finish loading. This can happen right after the site is updated. Reloading usually fixes it; your
            county is kept in the address.
          </p>
          <button type="button" className="primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </main>
    );
  }
}
