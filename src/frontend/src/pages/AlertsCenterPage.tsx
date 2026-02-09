import { useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle, AlertTriangle, Info, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { toast } from 'sonner';
import { useGetAlerts, useAddAlert, useMarkAlertAsRead, useDeleteAlert, useClearAlerts } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useState } from 'react';

export default function AlertsCenterPage() {
  const { identity } = useInternetIdentity();
  const { data: alerts = [], isLoading, error, refetch, isFetching } = useGetAlerts();
  const addAlertMutation = useAddAlert();
  const markAsReadMutation = useMarkAlertAsRead();
  const deleteAlertMutation = useDeleteAlert();
  const clearAlertsMutation = useClearAlerts();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
  });

  const isAuthenticated = !!identity;

  const handleCreateAlert = async () => {
    if (!newAlert.title.trim() || !newAlert.message.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await addAlertMutation.mutateAsync({
        title: newAlert.title.trim(),
        message: newAlert.message.trim(),
      });
      setNewAlert({ title: '', message: '' });
      setShowCreateDialog(false);
      toast.success('Alert created successfully');
    } catch (error: any) {
      console.error('Create alert error:', error);
      toast.error(error?.message?.includes('Unauthorized') 
        ? 'Please log in to create alerts' 
        : 'Failed to create alert. Please try again.');
    }
  };

  const handleDeleteAlert = async (id: bigint) => {
    try {
      await deleteAlertMutation.mutateAsync(id);
      toast.success('Alert deleted');
    } catch (error: any) {
      console.error('Delete alert error:', error);
      toast.error('Failed to delete alert. Please try again.');
    }
  };

  const handleMarkAsRead = async (id: bigint) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      toast.success('Alert marked as read');
    } catch (error: any) {
      console.error('Mark as read error:', error);
      toast.error('Failed to update alert. Please try again.');
    }
  };

  const handleClearAll = async () => {
    if (alerts.length === 0) {
      toast.info('No alerts to clear');
      return;
    }

    try {
      await clearAlertsMutation.mutateAsync();
      toast.success('All alerts cleared');
    } catch (error: any) {
      console.error('Clear alerts error:', error);
      toast.error('Failed to clear alerts. Please try again.');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info('Refreshing alerts...');
  };

  const getStatusColor = (read: boolean) => {
    return read ? 'text-gray-600 border-gray-600/30' : 'text-green-600 border-green-600/30';
  };

  const getStatusIcon = (read: boolean) => {
    return read ? <Info className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />;
  };

  if (!isAuthenticated) {
    return (
      <div className="page-shell">
        <div className="page-content-center">
          <div className="max-w-md mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <Bell className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6 tracking-tight leading-tight metallic-text-hero">
              Login Required
            </h1>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed mb-8">
              Please log in with Internet Identity to access the Alerts Center and manage your custom alerts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="max-w-7xl mx-auto">
          <SmokySectionTransition>
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8 animate-pulse">
                <Bell className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 tracking-tight leading-tight metallic-text-hero">
                Alerts Center
              </h1>
              <p className="text-xl metallic-text-secondary font-inter leading-relaxed max-w-3xl mx-auto">
                Professional alert management for price movements, volume spikes, and market conditions
              </p>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={200}>
            <div className="glass-card-gold p-10 mb-12 glow-border animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Activity className="h-8 w-8 text-gold" />
                  <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Active Alerts</h2>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRefresh}
                    disabled={isFetching}
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    <RefreshCw className={`h-5 w-5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  {alerts.length > 0 && (
                    <Button
                      onClick={handleClearAll}
                      disabled={clearAlertsMutation.isPending}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  )}
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gold hover:bg-gold/90 text-black font-poppins font-bold metallic-button">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Alert
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 border-2 border-gold/30 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-poppins text-gold">Create New Alert</DialogTitle>
                        <DialogDescription className="metallic-text-secondary font-inter text-lg">
                          Set up a custom alert for market conditions
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        <div>
                          <Label htmlFor="title" className="text-gold font-poppins mb-2 block">Alert Title</Label>
                          <Input
                            id="title"
                            value={newAlert.title}
                            onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                            placeholder="e.g., BTC Price Alert"
                            className="bg-white/40 border-gold/30"
                          />
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-gold font-poppins mb-2 block">Alert Message</Label>
                          <Input
                            id="message"
                            value={newAlert.message}
                            onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                            placeholder="e.g., Bitcoin reached $70,000"
                            className="bg-white/40 border-gold/30"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateDialog(false)}
                          className="border-gray-300 metallic-text"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateAlert}
                          disabled={addAlertMutation.isPending}
                          className="bg-gold hover:bg-gold/90 text-black font-poppins font-bold metallic-button"
                        >
                          {addAlertMutation.isPending ? 'Creating...' : 'Create Alert'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-16">
                  <div className="oracle-pulse mb-6 mx-auto" />
                  <p className="text-xl metallic-text-secondary font-inter">Loading alerts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <p className="text-xl metallic-text-secondary font-inter mb-4">Failed to load alerts</p>
                  <Button onClick={handleRefresh} variant="outline" className="border-gold/30 text-gold">
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/40 rounded-lg p-6 border border-gold/20 text-center">
                    <p className="text-sm metallic-text-secondary mb-2">Total Alerts</p>
                    <p className="text-4xl font-poppins font-bold text-gold">{alerts.length}</p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-6 border border-gold/20 text-center">
                    <p className="text-sm metallic-text-secondary mb-2">Unread</p>
                    <p className="text-4xl font-poppins font-bold text-green-600">
                      {alerts.filter(a => !a.read).length}
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-6 border border-gold/20 text-center">
                    <p className="text-sm metallic-text-secondary mb-2">Read</p>
                    <p className="text-4xl font-poppins font-bold text-gray-600">
                      {alerts.filter(a => a.read).length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={400}>
            <div className="glass-card p-10 glow-border animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-4 mb-8">
                <Bell className="h-8 w-8 text-gold" />
                <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Alert List</h2>
              </div>

              {alerts.length === 0 && !isLoading ? (
                <div className="text-center py-16">
                  <Bell className="h-16 w-16 text-gold/30 mx-auto mb-4" />
                  <p className="text-xl metallic-text-secondary font-inter">No alerts configured yet</p>
                  <p className="metallic-text-secondary font-inter mt-2">Create your first alert to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={Number(alert.id)} className="bg-white/40 rounded-lg p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-poppins font-bold text-gold">{alert.title}</h3>
                            <Badge variant="outline" className={getStatusColor(alert.read)}>
                              {getStatusIcon(alert.read)}
                              <span className="ml-1">{alert.read ? 'Read' : 'Unread'}</span>
                            </Badge>
                          </div>
                          <div className="space-y-2 metallic-text-secondary font-inter">
                            <p>{alert.message}</p>
                            <p className="text-sm">
                              <span className="font-bold">Created:</span>{' '}
                              {new Date(Number(alert.timestamp) / 1000000).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!alert.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(alert.id)}
                              disabled={markAsReadMutation.isPending}
                              className="border-gold/30 text-gold hover:bg-gold/10"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAlert(alert.id)}
                            disabled={deleteAlertMutation.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SmokySectionTransition>
        </div>
      </div>
    </div>
  );
}
