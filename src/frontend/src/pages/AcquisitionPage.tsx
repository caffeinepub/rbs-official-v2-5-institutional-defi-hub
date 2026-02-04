import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Loader2, Calendar, TrendingUp } from 'lucide-react';
import { useSubmitForm } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function AcquisitionPage() {
  const [presaleTime, setPresaleTime] = useState(0);
  const [airdropTime, setAirdropTime] = useState(0);

  const [presaleForm, setPresaleForm] = useState({
    name: '',
    country: '',
    walletAddress: '',
    rbsAmount: '',
  });

  const [airdropForm, setAirdropForm] = useState({
    name: '',
    country: '',
    walletAddress: '',
    rbsAmount: '',
  });

  const submitFormMutation = useSubmitForm();

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const presaleDate = new Date('2027-01-01T00:00:00');
      const airdropDate = new Date('2029-01-01T00:00:00');

      const presaleSeconds = Math.max(0, Math.floor((presaleDate.getTime() - now.getTime()) / 1000));
      const airdropSeconds = Math.max(0, Math.floor((airdropDate.getTime() - now.getTime()) / 1000));

      setPresaleTime(presaleSeconds);
      setAirdropTime(airdropSeconds);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds === 0) return 'Unlocked';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return { days, hours, mins, secs };
  };

  const calculateProgress = (seconds: number, targetDate: Date) => {
    const now = new Date();
    const start = new Date('2026-01-01T00:00:00');
    const total = targetDate.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const handlePresaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!presaleForm.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!presaleForm.country.trim()) {
      toast.error('Please enter your country');
      return;
    }
    if (!presaleForm.walletAddress.trim()) {
      toast.error('Please enter your wallet address');
      return;
    }
    if (!presaleForm.rbsAmount || parseFloat(presaleForm.rbsAmount) <= 0) {
      toast.error('Please enter a valid RBS amount');
      return;
    }

    try {
      await submitFormMutation.mutateAsync({
        name: presaleForm.name.trim(),
        country: presaleForm.country.trim(),
        walletAddress: presaleForm.walletAddress.trim(),
        rbsAmount: parseFloat(presaleForm.rbsAmount),
        isPresale: true,
      });

      toast.success('Presale registration submitted successfully!', {
        description: 'Redirecting to WhatsApp for confirmation...',
      });

      const message = `RBS Presale Registration\n\nName: ${presaleForm.name}\nCountry: ${presaleForm.country}\nWallet: ${presaleForm.walletAddress}\nRBS Amount: ${presaleForm.rbsAmount}`;
      const whatsappUrl = `https://wa.me/923294238997?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      setPresaleForm({ name: '', country: '', walletAddress: '', rbsAmount: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const handleAirdropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!airdropForm.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!airdropForm.country.trim()) {
      toast.error('Please enter your country');
      return;
    }
    if (!airdropForm.walletAddress.trim()) {
      toast.error('Please enter your wallet address');
      return;
    }
    if (!airdropForm.rbsAmount || parseFloat(airdropForm.rbsAmount) <= 0) {
      toast.error('Please enter a valid RBS amount');
      return;
    }

    try {
      await submitFormMutation.mutateAsync({
        name: airdropForm.name.trim(),
        country: airdropForm.country.trim(),
        walletAddress: airdropForm.walletAddress.trim(),
        rbsAmount: parseFloat(airdropForm.rbsAmount),
        isPresale: false,
      });

      toast.success('Airdrop registration submitted successfully!', {
        description: 'Redirecting to WhatsApp for confirmation...',
      });

      const message = `RBS Airdrop Registration\n\nName: ${airdropForm.name}\nCountry: ${airdropForm.country}\nWallet: ${airdropForm.walletAddress}\nRBS Amount: ${airdropForm.rbsAmount}`;
      const whatsappUrl = `https://wa.me/923294238997?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      setAirdropForm({ name: '', country: '', walletAddress: '', rbsAmount: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const isPresaleLocked = presaleTime > 0;
  const isAirdropLocked = airdropTime > 0;

  const presaleTimeData = formatTime(presaleTime);
  const airdropTimeData = formatTime(airdropTime);
  const presaleProgress = calculateProgress(presaleTime, new Date('2027-01-01T00:00:00'));
  const airdropProgress = calculateProgress(airdropTime, new Date('2029-01-01T00:00:00'));

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center gap-4 mb-6">
              <TrendingUp className="h-12 w-12 text-gold animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight metallic-text-hero">
                Acquisition Portal
              </h1>
            </div>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed max-w-2xl mx-auto">
              Secure your position in the RBS ecosystem through our presale and airdrop programs
            </p>
          </div>

          <Tabs defaultValue="presale" className="w-full animate-fade-in-up animation-delay-200">
            <TabsList className="grid w-full grid-cols-2 bg-white/60 border-2 border-gold/30 p-1 mb-12">
              <TabsTrigger
                value="presale"
                className="data-[state=active]:bg-gold data-[state=active]:text-black font-poppins font-bold text-lg transition-all duration-700 flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Presale
              </TabsTrigger>
              <TabsTrigger
                value="airdrop"
                className="data-[state=active]:bg-gold data-[state=active]:text-black font-poppins font-bold text-lg transition-all duration-700 flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Airdrop
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presale" className="mt-0">
              <div className="glass-card-gold p-10 md:p-12 glow-border transition-all duration-700 hover:shadow-2xl hover:shadow-gold/30">
                {isPresaleLocked ? (
                  <div className="mb-10 animate-fade-in-up">
                    <div className="p-6 bg-white/40 border-2 border-gold/40 rounded-xl mb-6">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Clock className="h-8 w-8 text-gold animate-pulse" />
                        <span className="text-2xl font-poppins font-bold text-gold tracking-tight">
                          Presale Countdown
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof presaleTimeData === 'object' ? presaleTimeData.days : '0'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Days</div>
                        </div>
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof presaleTimeData === 'object' ? presaleTimeData.hours.toString().padStart(2, '0') : '00'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Hours</div>
                        </div>
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof presaleTimeData === 'object' ? presaleTimeData.mins.toString().padStart(2, '0') : '00'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Minutes</div>
                        </div>
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof presaleTimeData === 'object' ? presaleTimeData.secs.toString().padStart(2, '0') : '00'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Seconds</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-inter metallic-text-secondary">
                          <span>Progress to Launch</span>
                          <span className="font-poppins text-gold">{presaleProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={presaleProgress} className="h-3" />
                      </div>
                    </div>

                    <div className="text-center p-4 bg-white/40 border border-gold/20 rounded-lg">
                      <p className="text-lg font-inter metallic-text-secondary">
                        Presale registration will open on <span className="font-bold text-gold">January 1, 2027</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 bg-green-50 border-2 border-green-300 rounded-xl flex items-center justify-center gap-4 animate-fade-in-up">
                    <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
                    <span className="text-2xl font-poppins font-bold text-green-600 tracking-tight">
                      Presale Registration Now Open
                    </span>
                  </div>
                )}

                <form onSubmit={handlePresaleSubmit} className="space-y-8">
                  <div className="animate-fade-in-up animation-delay-200">
                    <Label htmlFor="presale-name" className="metallic-text font-inter text-lg mb-3 block">
                      Full Name *
                    </Label>
                    <Input
                      id="presale-name"
                      type="text"
                      value={presaleForm.name}
                      onChange={(e) => setPresaleForm({ ...presaleForm, name: e.target.value })}
                      disabled={isPresaleLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold transition-all duration-700 h-14 text-lg"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up animation-delay-300">
                    <Label htmlFor="presale-country" className="metallic-text font-inter text-lg mb-3 block">
                      Country *
                    </Label>
                    <Input
                      id="presale-country"
                      type="text"
                      value={presaleForm.country}
                      onChange={(e) => setPresaleForm({ ...presaleForm, country: e.target.value })}
                      disabled={isPresaleLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold transition-all duration-700 h-14 text-lg"
                      placeholder="Enter your country"
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up animation-delay-400">
                    <Label htmlFor="presale-wallet" className="metallic-text font-inter text-lg mb-3 block">
                      Wallet Address *
                    </Label>
                    <Input
                      id="presale-wallet"
                      type="text"
                      value={presaleForm.walletAddress}
                      onChange={(e) =>
                        setPresaleForm({ ...presaleForm, walletAddress: e.target.value })
                      }
                      disabled={isPresaleLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold font-poppins transition-all duration-700 h-14 text-lg"
                      placeholder="0x..."
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up animation-delay-600">
                    <Label htmlFor="presale-amount" className="metallic-text font-inter text-lg mb-3 block">
                      RBS Amount *
                    </Label>
                    <Input
                      id="presale-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={presaleForm.rbsAmount}
                      onChange={(e) =>
                        setPresaleForm({ ...presaleForm, rbsAmount: e.target.value })
                      }
                      disabled={isPresaleLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold font-poppins transition-all duration-700 h-14 text-lg"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPresaleLocked || submitFormMutation.isPending}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-poppins font-bold text-xl py-8 metallic-button transition-all duration-700 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                  >
                    {submitFormMutation.isPending ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Presale Registration'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="airdrop" className="mt-0">
              <div className="glass-card-gold p-10 md:p-12 glow-border transition-all duration-700 hover:shadow-2xl hover:shadow-gold/30">
                {isAirdropLocked ? (
                  <div className="mb-10 animate-fade-in-up">
                    <div className="p-6 bg-white/40 border-2 border-gold/40 rounded-xl mb-6">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Clock className="h-8 w-8 text-gold animate-pulse" />
                        <span className="text-2xl font-poppins font-bold text-gold tracking-tight">
                          Airdrop Countdown
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof airdropTimeData === 'object' ? airdropTimeData.days : '0'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Days</div>
                        </div>
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof airdropTimeData === 'object' ? airdropTimeData.hours.toString().padStart(2, '0') : '00'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Hours</div>
                        </div>
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof airdropTimeData === 'object' ? airdropTimeData.mins.toString().padStart(2, '0') : '00'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Minutes</div>
                        </div>
                        <div className="text-center p-4 bg-white/40 rounded-lg border border-gold/20">
                          <div className="text-4xl font-poppins font-bold text-gold mb-2">
                            {typeof airdropTimeData === 'object' ? airdropTimeData.secs.toString().padStart(2, '0') : '00'}
                          </div>
                          <div className="text-sm font-inter metallic-text-secondary">Seconds</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-inter metallic-text-secondary">
                          <span>Progress to Launch</span>
                          <span className="font-poppins text-gold">{airdropProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={airdropProgress} className="h-3" />
                      </div>
                    </div>

                    <div className="text-center p-4 bg-white/40 border border-gold/20 rounded-lg">
                      <p className="text-lg font-inter metallic-text-secondary">
                        Airdrop registration will open on <span className="font-bold text-gold">January 1, 2029</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 bg-green-50 border-2 border-green-300 rounded-xl flex items-center justify-center gap-4 animate-fade-in-up">
                    <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
                    <span className="text-2xl font-poppins font-bold text-green-600 tracking-tight">
                      Airdrop Registration Now Open
                    </span>
                  </div>
                )}

                <form onSubmit={handleAirdropSubmit} className="space-y-8">
                  <div className="animate-fade-in-up animation-delay-200">
                    <Label htmlFor="airdrop-name" className="metallic-text font-inter text-lg mb-3 block">
                      Full Name *
                    </Label>
                    <Input
                      id="airdrop-name"
                      type="text"
                      value={airdropForm.name}
                      onChange={(e) => setAirdropForm({ ...airdropForm, name: e.target.value })}
                      disabled={isAirdropLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold transition-all duration-700 h-14 text-lg"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up animation-delay-300">
                    <Label htmlFor="airdrop-country" className="metallic-text font-inter text-lg mb-3 block">
                      Country *
                    </Label>
                    <Input
                      id="airdrop-country"
                      type="text"
                      value={airdropForm.country}
                      onChange={(e) => setAirdropForm({ ...airdropForm, country: e.target.value })}
                      disabled={isAirdropLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold transition-all duration-700 h-14 text-lg"
                      placeholder="Enter your country"
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up animation-delay-400">
                    <Label htmlFor="airdrop-wallet" className="metallic-text font-inter text-lg mb-3 block">
                      Wallet Address *
                    </Label>
                    <Input
                      id="airdrop-wallet"
                      type="text"
                      value={airdropForm.walletAddress}
                      onChange={(e) =>
                        setAirdropForm({ ...airdropForm, walletAddress: e.target.value })
                      }
                      disabled={isAirdropLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold font-poppins transition-all duration-700 h-14 text-lg"
                      placeholder="0x..."
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up animation-delay-600">
                    <Label htmlFor="airdrop-amount" className="metallic-text font-inter text-lg mb-3 block">
                      RBS Amount *
                    </Label>
                    <Input
                      id="airdrop-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={airdropForm.rbsAmount}
                      onChange={(e) =>
                        setAirdropForm({ ...airdropForm, rbsAmount: e.target.value })
                      }
                      disabled={isAirdropLocked || submitFormMutation.isPending}
                      className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold font-poppins transition-all duration-700 h-14 text-lg"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isAirdropLocked || submitFormMutation.isPending}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-poppins font-bold text-xl py-8 metallic-button transition-all duration-700 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                  >
                    {submitFormMutation.isPending ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Airdrop Registration'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
