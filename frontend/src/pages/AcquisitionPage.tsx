import React, { useState, useEffect } from 'react';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { redirectToWhatsApp } from '../utils/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';

interface FormData {
  name: string;
  email: string;
  wallet: string;
  amount: string;
}

export default function AcquisitionPage() {
  const [presaleForm, setPresaleForm] = useState<FormData>({
    name: '',
    email: '',
    wallet: '',
    amount: '',
  });
  const [airdropForm, setAirdropForm] = useState<FormData>({
    name: '',
    email: '',
    wallet: '',
    amount: '',
  });
  const [presaleErrors, setPresaleErrors] = useState<Partial<FormData>>({});
  const [airdropErrors, setAirdropErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presaleTimer = useCountdownTimer('presale');
  const airdropTimer = useCountdownTimer('airdrop');

  const presaleUnlocked = presaleTimer.unlocked;
  const airdropUnlocked = airdropTimer.unlocked;
  const presaleLoading = presaleTimer.isLoading;
  const airdropLoading = airdropTimer.isLoading;

  // Build display strings from components
  const presaleTime = `${presaleTimer.days}:${presaleTimer.hours}:${presaleTimer.minutes}:${presaleTimer.seconds}`;
  const airdropTime = `${airdropTimer.days}:${airdropTimer.hours}:${airdropTimer.minutes}:${airdropTimer.seconds}`;

  useEffect(() => {
    const savedPresale = sessionStorage.getItem('pendingPresaleSubmission');
    if (savedPresale) {
      try { setPresaleForm(JSON.parse(savedPresale)); } catch { /* ignore */ }
    }
    const savedAirdrop = sessionStorage.getItem('pendingAirdropSubmission');
    if (savedAirdrop) {
      try { setAirdropForm(JSON.parse(savedAirdrop)); } catch { /* ignore */ }
    }
  }, []);

  // Auto-submit pending forms when timers unlock
  useEffect(() => {
    if (presaleUnlocked) {
      const pending = sessionStorage.getItem('pendingPresaleSubmission');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          redirectToWhatsApp('Presale Registration', {
            'Registration Type': 'Presale',
            'Name': data.name,
            'Email': data.email,
            'Wallet Address': data.wallet,
            'RBS Amount': data.amount,
          });
          sessionStorage.removeItem('pendingPresaleSubmission');
        } catch { /* ignore */ }
      }
    }
  }, [presaleUnlocked]);

  useEffect(() => {
    if (airdropUnlocked) {
      const pending = sessionStorage.getItem('pendingAirdropSubmission');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          redirectToWhatsApp('Airdrop Registration', {
            'Registration Type': 'Airdrop',
            'Name': data.name,
            'Email': data.email,
            'Wallet Address': data.wallet,
            'RBS Amount': data.amount,
          });
          sessionStorage.removeItem('pendingAirdropSubmission');
        } catch { /* ignore */ }
      }
    }
  }, [airdropUnlocked]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (form: FormData, isPresale: boolean): boolean => {
    const errors: Partial<FormData> = {};

    if (!form.name.trim()) errors.name = 'Name is required';

    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(form.email)) errors.email = 'Invalid email format';

    if (!form.wallet.trim()) errors.wallet = 'Wallet address is required';
    else if (form.wallet.length < 10) errors.wallet = 'Invalid wallet address';

    if (!form.amount.trim()) errors.amount = 'Amount is required';
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) errors.amount = 'Invalid amount';

    if (isPresale) setPresaleErrors(errors);
    else setAirdropErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handlePresaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(presaleForm, true)) return;

    if (!presaleUnlocked) {
      sessionStorage.setItem('pendingPresaleSubmission', JSON.stringify(presaleForm));
      return;
    }

    setIsSubmitting(true);
    try {
      redirectToWhatsApp('Presale Registration', {
        'Registration Type': 'Presale',
        'Name': presaleForm.name,
        'Email': presaleForm.email,
        'Wallet Address': presaleForm.wallet,
        'RBS Amount': presaleForm.amount,
      });
      sessionStorage.removeItem('pendingPresaleSubmission');
      setPresaleForm({ name: '', email: '', wallet: '', amount: '' });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAirdropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(airdropForm, false)) return;

    if (!airdropUnlocked) {
      sessionStorage.setItem('pendingAirdropSubmission', JSON.stringify(airdropForm));
      return;
    }

    setIsSubmitting(true);
    try {
      redirectToWhatsApp('Airdrop Registration', {
        'Registration Type': 'Airdrop',
        'Name': airdropForm.name,
        'Email': airdropForm.email,
        'Wallet Address': airdropForm.wallet,
        'RBS Amount': airdropForm.amount,
      });
      sessionStorage.removeItem('pendingAirdropSubmission');
      setAirdropForm({ name: '', email: '', wallet: '', amount: '' });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Token Acquisition | RBS"
        description="Participate in RBS presale and airdrop programs"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Token Acquisition Portal
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Secure your RBS tokens through our presale or airdrop programs
              </p>
            </div>

            <Tabs defaultValue="presale" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="presale" className="text-base">
                  Presale Registration
                </TabsTrigger>
                <TabsTrigger value="airdrop" className="text-base">
                  Airdrop Registration
                </TabsTrigger>
              </TabsList>

              {/* ── PRESALE TAB ── */}
              <TabsContent value="presale">
                <SmokySectionTransition delay={100}>
                  <Card className="glass-card border-gold/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Presale Registration</span>
                        {presaleUnlocked ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-gold" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {presaleUnlocked
                          ? 'Presale is now open! Complete your registration.'
                          : 'Presale opens in Q1 2027. Pre-register now.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!presaleUnlocked && (
                        <div className="bg-gold/10 border border-gold/20 rounded-lg p-6 text-center">
                          <p className="text-sm text-muted-foreground mb-3">Time until presale opens</p>
                          {presaleLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold" />
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              {[
                                { label: 'Days', value: presaleTimer.days },
                                { label: 'Hours', value: presaleTimer.hours },
                                { label: 'Mins', value: presaleTimer.minutes },
                                { label: 'Secs', value: presaleTimer.seconds },
                              ].map(({ label, value }, i) => (
                                <React.Fragment key={label}>
                                  {i > 0 && <span className="text-2xl font-bold text-gold">:</span>}
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-gold tabular-nums font-mono">{value}</div>
                                    <div className="text-xs text-muted-foreground">{label}</div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {presaleUnlocked && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <AlertDescription className="text-green-500">
                            Presale is now open! Submit your registration to proceed.
                          </AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handlePresaleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="presale-name">Full Name *</Label>
                          <Input
                            id="presale-name"
                            value={presaleForm.name}
                            onChange={(e) => setPresaleForm({ ...presaleForm, name: e.target.value })}
                            disabled={!presaleUnlocked || isSubmitting}
                            className={presaleErrors.name ? 'border-destructive' : ''}
                            placeholder="Enter your full name"
                          />
                          {presaleErrors.name && (
                            <p className="text-sm text-destructive">{presaleErrors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="presale-email">Email Address *</Label>
                          <Input
                            id="presale-email"
                            type="email"
                            value={presaleForm.email}
                            onChange={(e) => setPresaleForm({ ...presaleForm, email: e.target.value })}
                            disabled={!presaleUnlocked || isSubmitting}
                            className={presaleErrors.email ? 'border-destructive' : ''}
                            placeholder="your.email@example.com"
                          />
                          {presaleErrors.email && (
                            <p className="text-sm text-destructive">{presaleErrors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="presale-wallet">Wallet Address *</Label>
                          <Input
                            id="presale-wallet"
                            value={presaleForm.wallet}
                            onChange={(e) => setPresaleForm({ ...presaleForm, wallet: e.target.value })}
                            disabled={!presaleUnlocked || isSubmitting}
                            className={presaleErrors.wallet ? 'border-destructive' : ''}
                            placeholder="0x..."
                          />
                          {presaleErrors.wallet && (
                            <p className="text-sm text-destructive">{presaleErrors.wallet}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="presale-amount">RBS Amount *</Label>
                          <Input
                            id="presale-amount"
                            type="number"
                            step="0.01"
                            value={presaleForm.amount}
                            onChange={(e) => setPresaleForm({ ...presaleForm, amount: e.target.value })}
                            disabled={!presaleUnlocked || isSubmitting}
                            className={presaleErrors.amount ? 'border-destructive' : ''}
                            placeholder="Enter amount"
                          />
                          {presaleErrors.amount && (
                            <p className="text-sm text-destructive">{presaleErrors.amount}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={!presaleUnlocked || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : presaleUnlocked ? (
                            'Submit Registration'
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              {presaleLoading ? 'Loading...' : `Locked — ${presaleTime}`}
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </SmokySectionTransition>
              </TabsContent>

              {/* ── AIRDROP TAB ── */}
              <TabsContent value="airdrop">
                <SmokySectionTransition delay={100}>
                  <Card className="glass-card border-gold/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Airdrop Registration</span>
                        {airdropUnlocked ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-gold" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {airdropUnlocked
                          ? 'Airdrop is now open! Complete your registration.'
                          : 'Airdrop opens in Q1 2029. Pre-register now.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!airdropUnlocked && (
                        <div className="bg-gold/10 border border-gold/20 rounded-lg p-6 text-center">
                          <p className="text-sm text-muted-foreground mb-3">Time until airdrop opens</p>
                          {airdropLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold" />
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              {[
                                { label: 'Days', value: airdropTimer.days },
                                { label: 'Hours', value: airdropTimer.hours },
                                { label: 'Mins', value: airdropTimer.minutes },
                                { label: 'Secs', value: airdropTimer.seconds },
                              ].map(({ label, value }, i) => (
                                <React.Fragment key={label}>
                                  {i > 0 && <span className="text-2xl font-bold text-gold">:</span>}
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-gold tabular-nums font-mono">{value}</div>
                                    <div className="text-xs text-muted-foreground">{label}</div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {airdropUnlocked && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <AlertDescription className="text-green-500">
                            Airdrop is now open! Submit your registration to proceed.
                          </AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleAirdropSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="airdrop-name">Full Name *</Label>
                          <Input
                            id="airdrop-name"
                            value={airdropForm.name}
                            onChange={(e) => setAirdropForm({ ...airdropForm, name: e.target.value })}
                            disabled={!airdropUnlocked || isSubmitting}
                            className={airdropErrors.name ? 'border-destructive' : ''}
                            placeholder="Enter your full name"
                          />
                          {airdropErrors.name && (
                            <p className="text-sm text-destructive">{airdropErrors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="airdrop-email">Email Address *</Label>
                          <Input
                            id="airdrop-email"
                            type="email"
                            value={airdropForm.email}
                            onChange={(e) => setAirdropForm({ ...airdropForm, email: e.target.value })}
                            disabled={!airdropUnlocked || isSubmitting}
                            className={airdropErrors.email ? 'border-destructive' : ''}
                            placeholder="your.email@example.com"
                          />
                          {airdropErrors.email && (
                            <p className="text-sm text-destructive">{airdropErrors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="airdrop-wallet">Wallet Address *</Label>
                          <Input
                            id="airdrop-wallet"
                            value={airdropForm.wallet}
                            onChange={(e) => setAirdropForm({ ...airdropForm, wallet: e.target.value })}
                            disabled={!airdropUnlocked || isSubmitting}
                            className={airdropErrors.wallet ? 'border-destructive' : ''}
                            placeholder="0x..."
                          />
                          {airdropErrors.wallet && (
                            <p className="text-sm text-destructive">{airdropErrors.wallet}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="airdrop-amount">RBS Amount *</Label>
                          <Input
                            id="airdrop-amount"
                            type="number"
                            step="0.01"
                            value={airdropForm.amount}
                            onChange={(e) => setAirdropForm({ ...airdropForm, amount: e.target.value })}
                            disabled={!airdropUnlocked || isSubmitting}
                            className={airdropErrors.amount ? 'border-destructive' : ''}
                            placeholder="Enter amount"
                          />
                          {airdropErrors.amount && (
                            <p className="text-sm text-destructive">{airdropErrors.amount}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={!airdropUnlocked || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : airdropUnlocked ? (
                            'Submit Registration'
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              {airdropLoading ? 'Loading...' : `Locked — ${airdropTime}`}
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </SmokySectionTransition>
              </TabsContent>
            </Tabs>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
