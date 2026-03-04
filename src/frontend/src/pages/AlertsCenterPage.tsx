import {
  AlertCircle,
  Bell,
  BellOff,
  CheckCheck,
  Loader2,
  Lock,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { Alert as AlertType } from "../backend";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Skeleton } from "../components/ui/skeleton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateAlert,
  useDeleteAlert,
  useGetAlerts,
  useMarkAlertAsRead,
  useToggleAlertTrigger,
} from "../hooks/useQueries";

function AlertCard({
  alert,
  onMarkRead,
  onDelete,
  onToggle,
  isMarkingRead,
  isDeleting,
  isToggling,
}: {
  alert: AlertType;
  onMarkRead: (id: bigint) => void;
  onDelete: (id: bigint) => void;
  onToggle: (id: bigint) => void;
  isMarkingRead: boolean;
  isDeleting: boolean;
  isToggling: boolean;
}) {
  const ts = new Date(Number(alert.timestamp) / 1_000_000);
  return (
    <div
      className={`glass-card rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01] ${alert.read ? "border-gold/10 opacity-70" : "border-gold/30 hover:border-gold/50"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${alert.read ? "bg-muted" : "bg-gold animate-pulse"}`}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-sm ${alert.read ? "text-muted-foreground" : "text-foreground"}`}
            >
              {alert.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {alert.message}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {ts.toLocaleString()}
              </span>
              {alert.autoCreated && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Auto
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${alert.triggerEnabled ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted/20 text-muted-foreground border-muted/20"}`}
              >
                {alert.triggerEnabled ? "● Trigger On" : "◌ Trigger Off"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!alert.read && (
            <button
              type="button"
              onClick={() => onMarkRead(alert.id)}
              disabled={isMarkingRead}
              title="Mark as read"
              className="p-2 rounded-lg text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all disabled:opacity-50"
            >
              {isMarkingRead ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggle(alert.id)}
            disabled={isToggling}
            title={alert.triggerEnabled ? "Disable trigger" : "Enable trigger"}
            className="p-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all disabled:opacity-50"
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : alert.triggerEnabled ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(alert.id)}
            disabled={isDeleting}
            title="Delete alert"
            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateAlertForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const createAlert = useCreateAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }
    setError("");
    try {
      await createAlert.mutateAsync({
        title: title.trim(),
        message: message.trim(),
      });
      setTitle("");
      setMessage("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create alert.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="alert-title"
          className="block text-sm font-medium text-gold mb-1"
        >
          Alert Title
        </label>
        <input
          id="alert-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. BTC Price Alert"
          className="w-full bg-background/50 border border-gold/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="alert-message"
          className="block text-sm font-medium text-gold mb-1"
        >
          Message
        </label>
        <textarea
          id="alert-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what this alert is for..."
          rows={3}
          className="w-full bg-background/50 border border-gold/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gold/30 text-muted-foreground font-bold py-3 rounded-xl hover:border-gold/60 hover:text-foreground transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createAlert.isPending}
          className="flex-1 bg-gradient-to-r from-gold to-gold-light text-background font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {createAlert.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Alert
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function AlertsCenterPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: alerts, isLoading } = useGetAlerts();
  const markAsRead = useMarkAlertAsRead();
  const deleteAlert = useDeleteAlert();
  const toggleTrigger = useToggleAlertTrigger();
  const [showCreate, setShowCreate] = useState(false);
  const [actionIds, setActionIds] = useState<{
    markRead: bigint | null;
    delete: bigint | null;
    toggle: bigint | null;
  }>({
    markRead: null,
    delete: null,
    toggle: null,
  });

  const handleMarkRead = async (id: bigint) => {
    setActionIds((a) => ({ ...a, markRead: id }));
    try {
      await markAsRead.mutateAsync(id);
    } finally {
      setActionIds((a) => ({ ...a, markRead: null }));
    }
  };

  const handleDelete = async (id: bigint) => {
    setActionIds((a) => ({ ...a, delete: id }));
    try {
      await deleteAlert.mutateAsync(id);
    } finally {
      setActionIds((a) => ({ ...a, delete: null }));
    }
  };

  const handleToggle = async (id: bigint) => {
    setActionIds((a) => ({ ...a, toggle: id }));
    try {
      await toggleTrigger.mutateAsync(id);
    } finally {
      setActionIds((a) => ({ ...a, toggle: null }));
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <PageHead
          title="Alerts Center | RBS Superior"
          description="Manage your RBS market alerts."
        />
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <Lock className="w-16 h-16 text-gold mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-gold mb-4">
              Authentication Required
            </h2>
            <p className="text-muted-foreground">
              Please log in to access your alerts center.
            </p>
          </div>
        </div>
      </>
    );
  }

  const unreadCount = (alerts ?? []).filter((a) => !a.read).length;

  return (
    <>
      <PageHead
        title="Alerts Center | RBS Superior"
        description="Manage your RBS market alerts."
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-gold/10 pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <SmokySectionTransition>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/10 text-gold text-sm font-medium mb-6">
                <Bell className="w-4 h-4" />
                Alerts Center
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Alerts Center
              </h1>
              <p className="text-xl text-muted-foreground">
                Create and manage your personalized market alerts.
              </p>
            </SmokySectionTransition>
          </div>
        </section>

        <section className="py-8 px-6 max-w-4xl mx-auto">
          {/* Create Alert Button / Form */}
          <SmokySectionTransition>
            {showCreate ? (
              <div className="glass-card rounded-2xl p-6 border border-gold/20 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gold">New Alert</h2>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <CreateAlertForm onClose={() => setShowCreate(false)} />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="w-full glass-card rounded-2xl p-4 border border-dashed border-gold/30 hover:border-gold/60 text-gold hover:text-gold-light transition-all duration-300 flex items-center justify-center gap-2 mb-6 hover:scale-[1.01]"
              >
                <Plus className="w-5 h-5" />
                Create New Alert
              </button>
            )}
          </SmokySectionTransition>

          {/* Alerts List */}
          <SmokySectionTransition>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
              </div>
            ) : (alerts ?? []).length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No alerts yet. Create your first alert above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(alerts ?? []).map((alert) => (
                  <AlertCard
                    key={String(alert.id)}
                    alert={alert}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    isMarkingRead={
                      actionIds.markRead === alert.id && markAsRead.isPending
                    }
                    isDeleting={
                      actionIds.delete === alert.id && deleteAlert.isPending
                    }
                    isToggling={
                      actionIds.toggle === alert.id && toggleTrigger.isPending
                    }
                  />
                ))}
              </div>
            )}
          </SmokySectionTransition>
        </section>
      </div>
    </>
  );
}
