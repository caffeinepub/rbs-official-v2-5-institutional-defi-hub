import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { useActor } from "../hooks/useActor";

// Roadmap dates: Presale unlocks March 31, 2027 | Airdrop unlocks March 31, 2029
const PRESALE_UNLOCK_DATE = new Date("2027-03-31T23:59:59Z");
const AIRDROP_UNLOCK_DATE = new Date("2029-03-31T23:59:59Z");

const WHATSAPP_NUMBER = "923294238997";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, targetDate.getTime() - Date.now()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, targetDate.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isUnlocked = timeLeft === 0;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { isUnlocked, days, hours, minutes, seconds };
}

function CountdownDisplay({
  days,
  hours,
  minutes,
  seconds,
  label,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
}) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-4 py-2 mb-6">
        <Lock className="h-4 w-4 text-sky-500" />
        <span className="text-sky-500 text-sm font-medium">
          {label} — Locked
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        This form will unlock when the roadmap milestone is reached
      </p>
      <div className="flex items-center justify-center gap-3">
        {[
          { value: days, label: "Days" },
          { value: hours, label: "Hours" },
          { value: minutes, label: "Min" },
          { value: seconds, label: "Sec" },
        ].map(({ value, label: unitLabel }) => (
          <div key={unitLabel} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-sky-200 rounded-xl shadow-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 tabular-nums font-black">
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-gray-500 mt-1">{unitLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PresaleForm() {
  const { isUnlocked, days, hours, minutes, seconds } =
    useCountdown(PRESALE_UNLOCK_DATE);
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    wallet: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.wallet.trim()) e.wallet = "Wallet address is required";
    if (
      !form.amount ||
      Number.isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0
    )
      e.amount = "Valid RBS amount required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (actor) {
        await actor.submitPresaleForm(
          form.name,
          form.country,
          form.wallet,
          Number(form.amount),
        );
      }
    } catch {
      // Backend submission failed — still proceed with WhatsApp
    }
    const text = encodeURIComponent(
      `*RBS Presale Registration*\n\nName: ${form.name}\nCountry: ${form.country}\nWallet: ${form.wallet}\nRBS Amount: ${form.amount}\n\n_Sent via RBS Acquisition Portal_`,
    );
    toast.success("Redirecting to WhatsApp...");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSubmitting(false);
  };

  if (!isUnlocked) {
    return (
      <CountdownDisplay
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        label="Presale Registration"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 w-fit">
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <span className="text-emerald-600 text-sm font-medium">
          Presale Registration Open!
        </span>
      </div>

      <div>
        <label
          htmlFor="presale-name"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Full Name *
        </label>
        <Input
          id="presale-name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Your full name"
          disabled={submitting}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="presale-email"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Email Address
        </label>
        <Input
          id="presale-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="your@email.com (optional)"
          disabled={submitting}
        />
      </div>
      <div>
        <label
          htmlFor="presale-country"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Country *
        </label>
        <Input
          id="presale-country"
          value={form.country}
          onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
          placeholder="Your country"
          disabled={submitting}
        />
        {errors.country && (
          <p className="text-xs text-destructive mt-1">{errors.country}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="presale-wallet"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Wallet Address *
        </label>
        <Input
          id="presale-wallet"
          value={form.wallet}
          onChange={(e) => setForm((p) => ({ ...p, wallet: e.target.value }))}
          placeholder="Your wallet address"
          disabled={submitting}
        />
        {errors.wallet && (
          <p className="text-xs text-destructive mt-1">{errors.wallet}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="presale-amount"
          className="block text-sm font-medium text-foreground mb-1"
        >
          RBS Amount *
        </label>
        <Input
          id="presale-amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          placeholder="Amount of RBS tokens"
          disabled={submitting}
        />
        {errors.amount && (
          <p className="text-xs text-destructive mt-1">{errors.amount}</p>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {submitting ? "Processing..." : "Register for Presale via WhatsApp"}
      </Button>
    </div>
  );
}

function AirdropForm() {
  const { isUnlocked, days, hours, minutes, seconds } =
    useCountdown(AIRDROP_UNLOCK_DATE);
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    wallet: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.wallet.trim()) e.wallet = "Wallet address is required";
    if (
      !form.amount ||
      Number.isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0
    )
      e.amount = "Valid RBS amount required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (actor) {
        await actor.submitAirdropForm(
          form.name,
          form.country,
          form.wallet,
          Number(form.amount),
        );
      }
    } catch {
      // Backend submission failed — still proceed with WhatsApp
    }
    const text = encodeURIComponent(
      `*RBS Airdrop Registration*\n\nName: ${form.name}\nCountry: ${form.country}\nWallet: ${form.wallet}\nRBS Amount: ${form.amount}\n\n_Sent via RBS Acquisition Portal_`,
    );
    toast.success("Redirecting to WhatsApp...");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSubmitting(false);
  };

  if (!isUnlocked) {
    return (
      <CountdownDisplay
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        label="Airdrop Registration"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 w-fit">
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <span className="text-emerald-600 text-sm font-medium">
          Airdrop Registration Open!
        </span>
      </div>

      <div>
        <label
          htmlFor="airdrop-name"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Full Name *
        </label>
        <Input
          id="airdrop-name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Your full name"
          disabled={submitting}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="airdrop-email"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Email Address
        </label>
        <Input
          id="airdrop-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="your@email.com (optional)"
          disabled={submitting}
        />
      </div>
      <div>
        <label
          htmlFor="airdrop-country"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Country *
        </label>
        <Input
          id="airdrop-country"
          value={form.country}
          onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
          placeholder="Your country"
          disabled={submitting}
        />
        {errors.country && (
          <p className="text-xs text-destructive mt-1">{errors.country}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="airdrop-wallet"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Wallet Address *
        </label>
        <Input
          id="airdrop-wallet"
          value={form.wallet}
          onChange={(e) => setForm((p) => ({ ...p, wallet: e.target.value }))}
          placeholder="Your wallet address"
          disabled={submitting}
        />
        {errors.wallet && (
          <p className="text-xs text-destructive mt-1">{errors.wallet}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="airdrop-amount"
          className="block text-sm font-medium text-foreground mb-1"
        >
          RBS Amount *
        </label>
        <Input
          id="airdrop-amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          placeholder="Amount of RBS tokens"
          disabled={submitting}
        />
        {errors.amount && (
          <p className="text-xs text-destructive mt-1">{errors.amount}</p>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {submitting ? "Processing..." : "Register for Airdrop via WhatsApp"}
      </Button>
    </div>
  );
}

export default function AcquisitionPage() {
  return (
    <>
      <PageHead
        title="Acquisition | RBS Superior"
        description="Register for the RBS Superior presale and airdrop programs."
      />
      <div className="min-h-screen bg-background pt-20 pb-24">
        <SmokySectionTransition>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-4">
                <Clock className="h-4 w-4" />
                Token Acquisition
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                Acquire RBS Tokens
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Register for the presale or airdrop program. Forms unlock
                according to the project roadmap timeline.
              </p>
            </div>

            {/* Roadmap Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    Presale Phase
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unlocks: March 31, 2027
                </p>
                <p className="text-xs text-muted-foreground">
                  Phase 2 of the RBS roadmap
                </p>
              </div>
              <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    Airdrop Phase
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unlocks: March 31, 2029
                </p>
                <p className="text-xs text-muted-foreground">
                  Phase 4 of the RBS roadmap
                </p>
              </div>
            </div>

            {/* Forms */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <Tabs defaultValue="presale">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="presale" className="flex-1">
                    Presale Registration
                  </TabsTrigger>
                  <TabsTrigger value="airdrop" className="flex-1">
                    Airdrop Registration
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="presale">
                  <PresaleForm />
                </TabsContent>
                <TabsContent value="airdrop">
                  <AirdropForm />
                </TabsContent>
              </Tabs>
            </div>

            {/* Note */}
            <div className="mt-6 flex items-start gap-3 bg-muted/50 border border-border rounded-xl p-4">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Registration forms are locked until the corresponding roadmap
                milestone is reached. This ensures fair and transparent token
                distribution aligned with project development.
              </p>
            </div>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
