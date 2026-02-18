import { Bell, AlertCircle } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function AlertsCenterPage() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <>
        <PageHead title="Alerts Center" description="Manage your RBS alerts and notifications" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 mex-scale-in">
            <CardHeader>
              <CardTitle className="text-gold">Authentication Required</CardTitle>
              <CardDescription>Please log in to access the Alerts Center</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Alerts Center" description="Manage your RBS alerts and notifications" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 mex-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Bell className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight leading-tight">
                Alerts Center
              </h1>
              <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto leading-relaxed">
                Manage your notifications and alerts
              </p>
            </div>

            <Card className="glass-card-gold p-12 text-center mex-fade-up">
              <AlertCircle className="h-16 w-16 text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-poppins font-bold text-gold mb-4">
                Coming Soon
              </h2>
              <p className="text-lg metallic-text-secondary font-inter max-w-xl mx-auto">
                The Alerts Center will be available once the backend implements alert management functionality.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
