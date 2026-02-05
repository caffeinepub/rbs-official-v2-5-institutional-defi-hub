import { useState } from 'react';
import { Bell, Plus, Trash2, Edit, CheckCircle, AlertTriangle, Info, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { toast } from 'sonner';

interface Alert {
  id: number;
  asset: string;
  condition: string;
  value: string;
  status: 'active' | 'triggered' | 'paused';
  createdAt: string;
}

export default function AlertsCenterPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, asset: 'BTC', condition: 'Price Above', value: '$70,000', status: 'active', createdAt: '2026-02-01' },
    { id: 2, asset: 'ETH', condition: 'Price Below', value: '$3,200', status: 'active', createdAt: '2026-02-02' },
    { id: 3, asset: 'SOL', condition: 'Volume Spike', value: '200%', status: 'triggered', createdAt: '2026-02-03' },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    asset: '',
    condition: '',
    value: '',
  });

  const handleCreateAlert = () => {
    if (!newAlert.asset || !newAlert.condition || !newAlert.value) {
      toast.error('Please fill all fields');
      return;
    }

    const alert: Alert = {
      id: Date.now(),
      asset: newAlert.asset,
      condition: newAlert.condition,
      value: newAlert.value,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ asset: '', condition: '', value: '' });
    setShowCreateDialog(false);
    toast.success('Alert created successfully');
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert deleted');
  };

  const handleToggleStatus = (id: number) => {
    setAlerts(alerts.map(a => 
      a.id === id 
        ? { ...a, status: a.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' | 'triggered' }
        : a
    ));
    toast.success('Alert status updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 border-green-600/30';
      case 'triggered':
        return 'text-gold border-gold/30';
      case 'paused':
        return 'text-gray-600 border-gray-600/30';
      default:
        return 'text-gray-600 border-gray-600/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'triggered':
        return <AlertTriangle className="h-4 w-4" />;
      case 'paused':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Activity className="h-8 w-8 text-gold" />
                  <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Active Alerts</h2>
                </div>
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
                        <Label htmlFor="asset" className="text-gold font-poppins mb-2 block">Asset</Label>
                        <Select value={newAlert.asset} onValueChange={(value) => setNewAlert({ ...newAlert, asset: value })}>
                          <SelectTrigger className="bg-white/40 border-gold/30">
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            <SelectItem value="SOL">Solana (SOL)</SelectItem>
                            <SelectItem value="BNB">Binance Coin (BNB)</SelectItem>
                            <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="condition" className="text-gold font-poppins mb-2 block">Condition</Label>
                        <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({ ...newAlert, condition: value })}>
                          <SelectTrigger className="bg-white/40 border-gold/30">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Price Above">Price Above</SelectItem>
                            <SelectItem value="Price Below">Price Below</SelectItem>
                            <SelectItem value="Volume Spike">Volume Spike</SelectItem>
                            <SelectItem value="RSI Overbought">RSI Overbought</SelectItem>
                            <SelectItem value="RSI Oversold">RSI Oversold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="value" className="text-gold font-poppins mb-2 block">Value</Label>
                        <Input
                          id="value"
                          value={newAlert.value}
                          onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                          placeholder="e.g., $70,000 or 200%"
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
                        className="bg-gold hover:bg-gold/90 text-black font-poppins font-bold metallic-button"
                      >
                        Create Alert
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/40 rounded-lg p-6 border border-gold/20 text-center">
                  <p className="text-sm metallic-text-secondary mb-2">Total Alerts</p>
                  <p className="text-4xl font-poppins font-bold text-gold">{alerts.length}</p>
                </div>
                <div className="bg-white/40 rounded-lg p-6 border border-gold/20 text-center">
                  <p className="text-sm metallic-text-secondary mb-2">Active</p>
                  <p className="text-4xl font-poppins font-bold text-green-600">{alerts.filter(a => a.status === 'active').length}</p>
                </div>
                <div className="bg-white/40 rounded-lg p-6 border border-gold/20 text-center">
                  <p className="text-sm metallic-text-secondary mb-2">Triggered</p>
                  <p className="text-4xl font-poppins font-bold text-gold">{alerts.filter(a => a.status === 'triggered').length}</p>
                </div>
              </div>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={400}>
            <div className="glass-card p-10 glow-border animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-4 mb-8">
                <TrendingUp className="h-8 w-8 text-gold" />
                <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Alert List</h2>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="h-16 w-16 text-gold/30 mx-auto mb-4" />
                  <p className="text-xl metallic-text-secondary font-inter">No alerts configured yet</p>
                  <p className="metallic-text-secondary font-inter mt-2">Create your first alert to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-white/40 rounded-lg p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <DollarSign className="h-6 w-6 text-gold" />
                            <h3 className="text-2xl font-poppins font-bold text-gold">{alert.asset}</h3>
                            <Badge variant="outline" className={getStatusColor(alert.status)}>
                              {getStatusIcon(alert.status)}
                              <span className="ml-1">{alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}</span>
                            </Badge>
                          </div>
                          <div className="space-y-2 metallic-text-secondary font-inter">
                            <p><span className="font-bold">Condition:</span> {alert.condition}</p>
                            <p><span className="font-bold">Value:</span> {alert.value}</p>
                            <p className="text-sm"><span className="font-bold">Created:</span> {alert.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(alert.id)}
                            className="border-gold/30 text-gold hover:bg-gold/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAlert(alert.id)}
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
