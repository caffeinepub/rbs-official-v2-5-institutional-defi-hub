import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-gold/10 border-4 border-gold/30 mb-8">
                <span className="text-7xl font-poppins font-bold text-gold">
                  404
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-6 animate-fade-in-up animation-delay-200">
              Page Not Found
            </h1>

            <p className="text-xl metallic-text-secondary font-inter mb-12 animate-fade-in-up animation-delay-300">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Button
                onClick={() => navigate({ to: "/" })}
                className="bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter font-poppins font-bold shadow-gold-md hover:shadow-gold-lg transition-all"
                size="lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>

              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-2 border-gold-matte text-dark-matter hover:bg-gold-matte/10 font-poppins font-semibold"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>

            <div className="mt-16 glass-card p-8 animate-fade-in-up animation-delay-600">
              <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">
                Explore RBS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/tokenomics" })}
                  className="text-dark-matter hover:text-gold-matte transition-colors font-inter font-semibold"
                >
                  Tokenomics
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/roadmap" })}
                  className="text-dark-matter hover:text-gold-matte transition-colors font-inter font-semibold"
                >
                  Roadmap
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/whitepaper" })}
                  className="text-dark-matter hover:text-gold-matte transition-colors font-inter font-semibold"
                >
                  Whitepaper
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/contact" })}
                  className="text-dark-matter hover:text-gold-matte transition-colors font-inter font-semibold"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
