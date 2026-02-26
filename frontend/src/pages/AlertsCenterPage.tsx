import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAlerts, useCreateAlert, useMarkAlertAsRead, useDeleteAlert, useToggleAlertTrigger } from '../hooks/useQueries';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { Bell, BellOff, Plus, Trash2, Check, Lock, RefreshCw } from 'lucide-react';

function timeAgo(ts: bigint): string {
  const ms = Number(ts);
  // ts is in nanoseconds from backend
  const diff = Math.floor((Date.now() - ms / 1_000_000) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AlertsCenterPage() {
  const { identity } = useInternetIdentity();
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: alerts, isLoading, isRefetching } = useGetAlerts();
  const createAlert = useCreateAlert();
  const markRead = useMarkAlertAsRead();
  const deleteAlert = useDeleteAlert();
  const toggleTrigger = useToggleAlertTrigger();

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageHead title="Alerts Center | RBS" description="Manage your persistent crypto alerts." />
        <div className="glass-card p-8 text-center max-w-md">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access your Alerts Center.</p>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    if (!newTitle.trim() || !newMessage.trim()) return;
    await createAlert.mutateAsync({ title: newTitle.trim(), message: newMessage.trim() });
    setNewTitle('');
    setNewMessage('');
    setShowForm(false);
  };

  const unreadCount = (alerts ?? []).filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Alerts Center | RBS" description="Manage your persistent crypto alerts." />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Alerts Center</h1>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-sm font-bold px-2.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-1">Persistent alerts stored on-chain — survive page refreshes</p>
            </div>
            <div className="flex items-center gap-3">
              {isRefetching && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                New Alert
              </button>
            </div>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="glass-card p-6 mb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Create New Alert</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Alert title"
                  className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Alert message"
                  rows={3}
                  className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCreate}
                    disabled={createAlert.isPending || !newTitle.trim() || !newMessage.trim()}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {createAlert.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alerts List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-5 bg-muted rounded mb-3 w-1/2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (alerts ?? []).length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts yet. Create your first alert above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(alerts ?? []).map((alert) => (
                <div
                  key={String(alert.id)}
                  className={`glass-card p-5 transition-all ${alert.read ? 'opacity-70' : 'border-primary/30'}`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!alert.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                        <h3 className={`font-bold text-foreground ${alert.read ? 'opacity-70' : ''}`}>{alert.title}</h3>
                        {alert.autoCreated && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Auto</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(alert.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Toggle Trigger */}
                      <button
                        onClick={() => toggleTrigger.mutate(alert.id)}
                        disabled={toggleTrigger.isPending}
                        title={alert.triggerEnabled ? 'Disable trigger' : 'Enable trigger'}
                        className={`p-2 rounded-lg transition-colors ${alert.triggerEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                      >
                        {alert.triggerEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </button>
                      {/* Mark as Read */}
                      {!alert.read && (
                        <button
                          onClick={() => markRead.mutate(alert.id)}
                          disabled={markRead.isPending}
                          title="Mark as read"
                          className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-green-500 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => deleteAlert.mutate(alert.id)}
                        disabled={deleteAlert.isPending}
                        title="Delete alert"
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </SmokySectionTransition>
    </div>
  );
}
