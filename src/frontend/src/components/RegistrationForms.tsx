import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Rocket, Gift, Clock, Loader2, ExternalLink } from 'lucide-react';
import { useSubmitForm, useGetPresaleRemainingTime, useGetAirdropRemainingTime } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { validateFormData, normalizeFormPayload, getEmptyFormData, type FormData } from '@/utils/forms';
import { processTimerData } from '@/utils/timers';
import { openWhatsAppWithFallback } from '@/utils/whatsapp';
import { sanitizeErrorMessage } from '@/utils/errors';

export function RegistrationForms() {
  const [presaleForm, setPresaleForm] = useState<FormData>(getEmptyFormData());
  const [airdropForm, setAirdropForm] = useState<FormData>(getEmptyFormData());
  const [activeTab, setActiveTab] = useState<'presale' | 'airdrop'>('presale');
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState<string | null>(null);

  const { data: presaleTimeData } = useGetPresaleRemainingTime();
  const { data: airdropTimeData } = useGetAirdropRemainingTime();
  const submitMutation = useSubmitForm();

  const [presaleTimer, setPresaleTimer] = useState(processTimerData(undefined));
  const [airdropTimer, setAirdropTimer] = useState(processTimerData(undefined));

  useEffect(() => {
    const interval = setInterval(() => {
      setPresaleTimer(processTimerData(presaleTimeData));
      setAirdropTimer(processTimerData(airdropTimeData));
    }, 1000);

    return () => clearInterval(interval);
  }, [presaleTimeData, airdropTimeData]);

  const handlePresaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (presaleTimer.isLocked) {
      toast.error('Registration is currently locked');
      return;
    }

    const validation = validateFormData(presaleForm);
    if (!validation.isValid) {
      toast.error(validation.error || 'Please fill in all required fields');
      return;
    }

    const payload = normalizeFormPayload(presaleForm, true);

    try {
      await submitMutation.mutateAsync(payload);
      
      toast.success('Presale registration submitted successfully!', {
        description: 'Opening WhatsApp for confirmation...',
      });

      const result = openWhatsAppWithFallback({
        name: payload.name,
        country: payload.country,
        walletAddress: payload.walletAddress,
        rbsAmount: payload.rbsAmount,
        formType: 'Presale',
      });

      if (result.blocked) {
        setWhatsappFallbackUrl(result.url);
        toast.info('Popup blocked', {
          description: 'Click the button below to open WhatsApp manually',
        });
      }

      setPresaleForm(getEmptyFormData());
    } catch (error) {
      const userMessage = sanitizeErrorMessage(error);
      toast.error('Submission failed', {
        description: userMessage,
      });
    }
  };

  const handleAirdropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (airdropTimer.isLocked) {
      toast.error('Registration is currently locked');
      return;
    }

    const validation = validateFormData(airdropForm);
    if (!validation.isValid) {
      toast.error(validation.error || 'Please fill in all required fields');
      return;
    }

    const payload = normalizeFormPayload(airdropForm, false);

    try {
      await submitMutation.mutateAsync(payload);
      
      toast.success('Airdrop registration submitted successfully!', {
        description: 'Opening WhatsApp for confirmation...',
      });

      const result = openWhatsAppWithFallback({
        name: payload.name,
        country: payload.country,
        walletAddress: payload.walletAddress,
        rbsAmount: payload.rbsAmount,
        formType: 'Airdrop',
      });

      if (result.blocked) {
        setWhatsappFallbackUrl(result.url);
        toast.info('Popup blocked', {
          description: 'Click the button below to open WhatsApp manually',
        });
      }

      setAirdropForm(getEmptyFormData());
    } catch (error) {
      const userMessage = sanitizeErrorMessage(error);
      toast.error('Submission failed', {
        description: userMessage,
      });
    }
  };

  const isPresaleDisabled = presaleTimer.isLocked || submitMutation.isPending;
  const isAirdropDisabled = airdropTimer.isLocked || submitMutation.isPending;

  return (
    <div className="animate-fade-in-up">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'presale' | 'airdrop')}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="presale" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Presale
          </TabsTrigger>
          <TabsTrigger value="airdrop" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Airdrop
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presale" className="mt-0">
          <div className="card p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-foreground">
                Presale Registration
              </h3>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <span className="font-semibold font-mono">{presaleTimer.formattedTime}</span>
              </div>
            </div>

            {presaleTimer.isLocked && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-foreground font-medium">
                  Presale registration is currently locked. Please wait until the timer expires.
                </p>
              </div>
            )}

            {whatsappFallbackUrl && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-3">
                  Popup was blocked. Click below to open WhatsApp:
                </p>
                <Button
                  onClick={() => {
                    window.open(whatsappFallbackUrl, '_blank', 'noopener,noreferrer');
                    setWhatsappFallbackUrl(null);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open WhatsApp
                </Button>
              </div>
            )}

            <form onSubmit={handlePresaleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="presale-name" className="text-sm font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="presale-name"
                  value={presaleForm.name}
                  onChange={(e) => setPresaleForm({ ...presaleForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  disabled={isPresaleDisabled}
                  required
                  className="transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presale-country" className="text-sm font-semibold">
                  Country <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="presale-country"
                  value={presaleForm.country}
                  onChange={(e) => setPresaleForm({ ...presaleForm, country: e.target.value })}
                  placeholder="Enter your country"
                  disabled={isPresaleDisabled}
                  required
                  className="transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presale-wallet" className="text-sm font-semibold">
                  Wallet Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="presale-wallet"
                  value={presaleForm.walletAddress}
                  onChange={(e) => setPresaleForm({ ...presaleForm, walletAddress: e.target.value })}
                  placeholder="Enter your wallet address"
                  disabled={isPresaleDisabled}
                  required
                  className="transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presale-amount" className="text-sm font-semibold">
                  RBS Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="presale-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={presaleForm.rbsAmount}
                  onChange={(e) => setPresaleForm({ ...presaleForm, rbsAmount: e.target.value })}
                  placeholder="Enter amount"
                  disabled={isPresaleDisabled}
                  required
                  className="transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all"
                disabled={isPresaleDisabled}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : presaleTimer.isLocked ? (
                  'Registration Locked'
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="airdrop" className="mt-0">
          <div className="card p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-foreground">
                Airdrop Registration
              </h3>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <span className="font-semibold font-mono">{airdropTimer.formattedTime}</span>
              </div>
            </div>

            {airdropTimer.isLocked && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-foreground font-medium">
                  Airdrop registration is currently locked. Please wait until the timer expires.
                </p>
              </div>
            )}

            {whatsappFallbackUrl && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-3">
                  Popup was blocked. Click below to open WhatsApp:
                </p>
                <Button
                  onClick={() => {
                    window.open(whatsappFallbackUrl, '_blank', 'noopener,noreferrer');
                    setWhatsappFallbackUrl(null);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open WhatsApp
                </Button>
              </div>
            )}

            <form onSubmit={handleAirdropSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="airdrop-name" className="text-sm font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="airdrop-name"
                  value={airdropForm.name}
                  onChange={(e) => setAirdropForm({ ...airdropForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  disabled={isAirdropDisabled}
                  required
                  className="transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="airdrop-country" className="text-sm font-semibold">
                  Country <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="airdrop-country"
                  value={airdropForm.country}
                  onChange={(e) => setAirdropForm({ ...airdropForm, country: e.target.value })}
                  placeholder="Enter your country"
                  disabled={isAirdropDisabled}
                  required
                  className="transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="airdrop-wallet" className="text-sm font-semibold">
                  Wallet Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="airdrop-wallet"
                  value={airdropForm.walletAddress}
                  onChange={(e) => setAirdropForm({ ...airdropForm, walletAddress: e.target.value })}
                  placeholder="Enter your wallet address"
                  disabled={isAirdropDisabled}
                  required
                  className="transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="airdrop-amount" className="text-sm font-semibold">
                  RBS Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="airdrop-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={airdropForm.rbsAmount}
                  onChange={(e) => setAirdropForm({ ...airdropForm, rbsAmount: e.target.value })}
                  placeholder="Enter amount"
                  disabled={isAirdropDisabled}
                  required
                  className="transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all"
                disabled={isAirdropDisabled}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : airdropTimer.isLocked ? (
                  'Registration Locked'
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
