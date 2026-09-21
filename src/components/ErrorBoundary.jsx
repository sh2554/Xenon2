import React from "react";
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleSignOut = async () => {
    try {
      const signOut = useAppStore.getState().signOut;
      if (signOut) await signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] text-[var(--text)]">
          <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl text-center">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2">Workspace Encountered an Error</h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed mb-6">
              An unexpected render issue occurred. Your account data is safe. You can reload the page or sign out to reset the workspace.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-lg bg-[var(--panel-muted)] border border-[var(--border)] text-left">
                <p className="font-mono text-[11px] text-[var(--danger,#ef4444)] break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 xenon-btn py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleSignOut}
                className="xenon-btn-ghost py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 border border-[var(--border)]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
