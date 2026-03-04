import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetApiKeyStatuses, useSetApiKey } from "@/hooks/useAdminConfig";
import { AlertCircle, CheckCircle, Key, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PROVIDER_LABELS: Record<string, string> = {
  coingecko: "CoinGecko API",
  cryptocompare: "CryptoCompare API",
  alternative: "Alternative.me API",
  binance: "Binance API",
};

export function AdminApiKeysPanel() {
  const { data: statuses, isLoading } = useGetApiKeyStatuses();
  const setApiKeyMutation = useSetApiKey();
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState("");

  const handleSave = async (provider: string) => {
    if (!keyValue.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    try {
      await setApiKeyMutation.mutateAsync({ provider, key: keyValue });
      toast.success(
        `${PROVIDER_LABELS[provider] || provider} key updated successfully`,
      );
      setEditingProvider(null);
      setKeyValue("");
    } catch (error) {
      console.error("Failed to set API key:", error);
      toast.error("Failed to update API key");
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 text-gold mx-auto mb-4 animate-spin" />
          <p className="metallic-text">Loading API configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card-gold glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold">
          <Key className="h-5 w-5" />
          API Key Configuration
        </CardTitle>
        <CardDescription>
          Manage external API keys for real-time data providers. Keys are stored
          securely and never exposed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some features work with public endpoints. API keys improve rate
            limits and data quality.
          </AlertDescription>
        </Alert>

        {statuses && statuses.length > 0 ? (
          <div className="space-y-4">
            {statuses.map((status) => (
              <div
                key={status.provider}
                className="border border-border/50 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gold">
                      {PROVIDER_LABELS[status.provider] || status.provider}
                    </span>
                    <Badge
                      variant={status.configured ? "default" : "outline"}
                      className={
                        status.configured
                          ? "bg-green-500/10 text-green-600 border-green-500/30"
                          : ""
                      }
                    >
                      {status.configured ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Configured
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Configured
                        </>
                      )}
                    </Badge>
                  </div>
                  {editingProvider !== status.provider && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProvider(status.provider);
                        setKeyValue("");
                      }}
                      className="mex-hover-lift"
                    >
                      {status.configured ? "Update" : "Add"} Key
                    </Button>
                  )}
                </div>

                {editingProvider === status.provider && (
                  <div className="space-y-3 pt-2 border-t border-border/30">
                    <div>
                      <Label htmlFor={`key-${status.provider}`}>API Key</Label>
                      <Input
                        id={`key-${status.provider}`}
                        type="password"
                        value={keyValue}
                        onChange={(e) => setKeyValue(e.target.value)}
                        placeholder="Enter API key"
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(status.provider)}
                        disabled={setApiKeyMutation.isPending}
                        className="bg-gold hover:bg-gold/90 text-black"
                      >
                        {setApiKeyMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Key"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProvider(null);
                          setKeyValue("");
                        }}
                        disabled={setApiKeyMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No API providers configured
          </p>
        )}
      </CardContent>
    </Card>
  );
}
