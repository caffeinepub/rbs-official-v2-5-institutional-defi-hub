import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { PageHead } from "../components/PageHead";

export default function TokenBurnTrackerPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHead
        title="Burn Info | RBS"
        description="RBS token burn information"
      />
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Flame className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Token Burn Info
          </h1>
          <p className="text-gray-400 mb-6">
            15,000 RBS (15% of total supply) is allocated for systematic burns
            to create deflationary value. Burn tracker details are available in
            Tokenomics.
          </p>
          <Button
            onClick={() => navigate({ to: "/tokenomics" })}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
          >
            View Tokenomics
          </Button>
        </div>
      </div>
    </>
  );
}
