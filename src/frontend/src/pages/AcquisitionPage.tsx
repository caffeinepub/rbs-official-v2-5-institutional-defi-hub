import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Send, Lock, ExternalLink, Sparkles } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { usePresaleCountdown, useAirdropCountdown } from '@/hooks/useCountdownTimer';
import { padTime } from '@/utils/timers';
import { buildWhatsAppURL } from '@/utils/whatsapp';
import { REDIRECT_CONFIG, getBinanceSquareLink } from '@/constants/redirectConfig';
import { toast } from 'sonner';

interface PendingSubmission {
  type: 'presale' | 'airdrop';
  payload: Record<string, string>;
  timestamp: number;
}

const PENDING_KEY = 'rbs_pending_submission';

export default function AcquisitionPage() {
  const presaleCountdown = usePresaleCountdown();
  const airdropCountdown = useAirdropCountdown();

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for pending submissions when countdown unlocks
  useEffect(() => {
    const pendingStr = sessionStorage.getItem(PENDING_KEY);
    if (!pendingStr) return;

    try {
      const pending: PendingSubmission = JSON.parse(pendingStr);
      
      // Check if the relevant countdown is now unlocked
      if (pending.type === 'presale' && presaleCountdown.isUnlocked) {
        const url = buildWhatsAppURL('Presale Registration', pending.payload);
        sessionStorage.removeItem(PENDING_KEY);
        toast.success('Presale unlocked! Redirecting to WhatsApp...');
        setTimeout(() => {
          window.location.assign(url);
        }, 1000);
      } else if (pending.type === 'airdrop' && airdropCountdown.isUnlocked) {
        const url = buildWhatsAppURL('Airdrop Registration', pending.payload);
        sessionStorage.removeItem(PENDING_KEY);
        toast.success('Airdrop unlocked! Redirecting to WhatsApp...');
        setTimeout(() => {
          window.location.assign(url);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing pending submission:', error);
      sessionStorage.removeItem(PENDING_KEY);
    }
  }, [presaleCountdown.isUnlocked, airdropCountdown.isUnlocked]);

  const handlePresaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!presaleForm.name || !presaleForm.country || !presaleForm.walletAddress || !presaleForm.rbsAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        Name: presaleForm.name,
        Country: presaleForm.country,
        'Wallet Address': presaleForm.walletAddress,
        'RBS Amount': presaleForm.rbsAmount,
      };

      if (presaleCountdown.isUnlocked) {
        // Presale is unlocked, redirect immediately
        const url = buildWhatsAppURL('Presale Registration', payload);
        toast.success('Redirecting to WhatsApp...');
        setTimeout(() => {
          window.location.assign(url);
        }, 500);
      } else {
        // Save pending submission
        const pending: PendingSubmission = {
          type: 'presale',
          payload,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
        toast.success('Registration saved! You will be redirected when presale unlocks.');
        
        // Clear form
        setPresaleForm({
          name: '',
          country: '',
          walletAddress: '',
          rbsAmount: '',
        });
      }
    } catch (error) {
      console.error('Presale submission error:', error);
      toast.error('Failed to process registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAirdropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!airdropForm.name || !airdropForm.country || !airdropForm.walletAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        Name: airdropForm.name,
        Country: airdropForm.country,
        'Wallet Address': airdropForm.walletAddress,
      };

      if (airdropCountdown.isUnlocked) {
        // Airdrop is unlocked, redirect immediately
        const url = buildWhatsAppURL('Airdrop Registration', payload);
        toast.success('Redirecting to WhatsApp...');
        setTimeout(() => {
          window.location.assign(url);
        }, 500);
      } else {
        // Save pending submission
        const pending: PendingSubmission = {
          type: 'airdrop',
          payload,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
        toast.success('Registration saved! You will be redirected when airdrop unlocks.');
        
        // Clear form
        setAirdropForm({
          name: '',
          country: '',
          walletAddress: '',
        });
      }
    } catch (error) {
      console.error('Airdrop submission error:', error);
      toast.error('Failed to process registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Acquisition Portal - RBS"
        description="Register for RBS presale and airdrop opportunities. Secure your position in the future of blockchain technology."
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-gold/5 to-white py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 metallic-text-hero mex-glow-text">
              Acquisition Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Secure your position in the RBS ecosystem. Register for presale or airdrop opportunities.
            </p>
          </div>

          <Tabs defaultValue="presale" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 mex-hover-lift">
              <TabsTrigger value="presale" className="text-lg transition-all duration-300">
                <Sparkles className="mr-2 h-5 w-5" />
                Presale Q1 2027
              </TabsTrigger>
              <TabsTrigger value="airdrop" className="text-lg transition-all duration-300">
                <Sparkles className="mr-2 h-5 w-5" />
                Airdrop Q1 2029
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presale" className="animate-fade-in">
              <Card className="glass-card border-gold/30 shadow-xl mex-hover-lift">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl font-bold text-gold">Presale Registration</CardTitle>
                    {presaleCountdown.isUnlocked ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold animate-pulse">
                        <Clock className="h-5 w-5" />
                        <span>UNLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Lock className="h-5 w-5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {presaleCountdown.isUnlocked
                      ? 'Presale is now open! Complete the form to register via WhatsApp.'
                      : 'Register now and be automatically redirected when presale unlocks.'}
                  </CardDescription>
                  
                  {!presaleCountdown.isUnlocked && (
                    <div className="bg-gold/10 rounded-lg p-6 border border-gold/30">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3 font-medium">Time Until Unlock</p>
                        <div className="flex justify-center gap-4 text-center">
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(presaleCountdown.days)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">DAYS</div>
                          </div>
                          <div className="text-4xl font-bold text-gold">:</div>
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(presaleCountdown.hours)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">HOURS</div>
                          </div>
                          <div className="text-4xl font-bold text-gold">:</div>
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(presaleCountdown.minutes)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">MINUTES</div>
                          </div>
                          <div className="text-4xl font-bold text-gold">:</div>
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(presaleCountdown.seconds)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">SECONDS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePresaleSubmit} className="space-y-6">
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="presale-name">Full Name *</Label>
                      <Input
                        id="presale-name"
                        value={presaleForm.name}
                        onChange={(e) => setPresaleForm({ ...presaleForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="presale-country">Country *</Label>
                      <Input
                        id="presale-country"
                        value={presaleForm.country}
                        onChange={(e) => setPresaleForm({ ...presaleForm, country: e.target.value })}
                        placeholder="Enter your country"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="presale-wallet">Wallet Address *</Label>
                      <Input
                        id="presale-wallet"
                        value={presaleForm.walletAddress}
                        onChange={(e) => setPresaleForm({ ...presaleForm, walletAddress: e.target.value })}
                        placeholder="Enter your wallet address"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="presale-amount">RBS Amount *</Label>
                      <Input
                        id="presale-amount"
                        type="number"
                        step="0.01"
                        value={presaleForm.rbsAmount}
                        onChange={(e) => setPresaleForm({ ...presaleForm, rbsAmount: e.target.value })}
                        placeholder="Enter desired RBS amount"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-6 text-lg mex-hover-lift transition-all duration-300"
                    >
                      {isSubmitting ? (
                        'Processing...'
                      ) : presaleCountdown.isUnlocked ? (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit & Open WhatsApp
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2 h-5 w-5" />
                          Register for Presale
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="airdrop" className="animate-fade-in">
              <Card className="glass-card border-gold/30 shadow-xl mex-hover-lift">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl font-bold text-gold">Airdrop Registration</CardTitle>
                    {airdropCountdown.isUnlocked ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold animate-pulse">
                        <Clock className="h-5 w-5" />
                        <span>UNLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Lock className="h-5 w-5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {airdropCountdown.isUnlocked
                      ? 'Airdrop is now open! Complete the form to register via WhatsApp.'
                      : 'Register now and be automatically redirected when airdrop unlocks.'}
                  </CardDescription>
                  
                  {!airdropCountdown.isUnlocked && (
                    <div className="bg-gold/10 rounded-lg p-6 border border-gold/30">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3 font-medium">Time Until Unlock</p>
                        <div className="flex justify-center gap-4 text-center">
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(airdropCountdown.days)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">DAYS</div>
                          </div>
                          <div className="text-4xl font-bold text-gold">:</div>
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(airdropCountdown.hours)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">HOURS</div>
                          </div>
                          <div className="text-4xl font-bold text-gold">:</div>
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(airdropCountdown.minutes)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">MINUTES</div>
                          </div>
                          <div className="text-4xl font-bold text-gold">:</div>
                          <div className="mex-hover-lift">
                            <div className="text-4xl font-bold text-gold tabular-nums">
                              {padTime(airdropCountdown.seconds)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">SECONDS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAirdropSubmit} className="space-y-6">
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="airdrop-name">Full Name *</Label>
                      <Input
                        id="airdrop-name"
                        value={airdropForm.name}
                        onChange={(e) => setAirdropForm({ ...airdropForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="airdrop-country">Country *</Label>
                      <Input
                        id="airdrop-country"
                        value={airdropForm.country}
                        onChange={(e) => setAirdropForm({ ...airdropForm, country: e.target.value })}
                        placeholder="Enter your country"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2 mex-hover-lift">
                      <Label htmlFor="airdrop-wallet">Wallet Address *</Label>
                      <Input
                        id="airdrop-wallet"
                        value={airdropForm.walletAddress}
                        onChange={(e) => setAirdropForm({ ...airdropForm, walletAddress: e.target.value })}
                        placeholder="Enter your wallet address"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-6 text-lg mex-hover-lift transition-all duration-300"
                    >
                      {isSubmitting ? (
                        'Processing...'
                      ) : airdropCountdown.isUnlocked ? (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit & Open WhatsApp
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2 h-5 w-5" />
                          Register for Airdrop
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center space-y-4 animate-fade-in">
            <p className="text-gray-600">
              Need help? Contact us on WhatsApp or join our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                className="mex-hover-lift transition-all duration-300"
                onClick={() => window.open(REDIRECT_CONFIG.whatsapp.directUrl, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                WhatsApp Support
              </Button>
              <Button
                variant="outline"
                className="mex-hover-lift transition-all duration-300"
                onClick={() => window.open(REDIRECT_CONFIG.telegram.channel, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Telegram Channel
              </Button>
              <Button
                variant="outline"
                className="mex-hover-lift transition-all duration-300"
                onClick={() => window.open(getBinanceSquareLink(), '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Binance Square
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
