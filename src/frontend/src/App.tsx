import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { AuthInitializer } from "./components/AuthInitializer";
import { Footer } from "./components/Footer";
import Header from "./components/Header";
import { ScrollToTop } from "./components/ScrollToTop";
import AISentimentPage from "./pages/AISentimentPage";
import AboutPage from "./pages/AboutPage";
import AcquisitionPage from "./pages/AcquisitionPage";
import AdultFormPage from "./pages/AdultFormPage";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import AirdropPresaleHubPage from "./pages/AirdropPresaleHubPage";
import AlertsCenterPage from "./pages/AlertsCenterPage";
import CommunityGovernancePage from "./pages/CommunityGovernancePage";
import CommunityHighlightsPage from "./pages/CommunityHighlightsPage";
import CommunityLeaderboardPage from "./pages/CommunityLeaderboardPage";
import CommunityVotingPage from "./pages/CommunityVotingPage";
import ContactPage from "./pages/ContactPage";
import DeveloperBlogPage from "./pages/DeveloperBlogPage";
import EcosystemGrowthPage from "./pages/EcosystemGrowthPage";
import FAQPage from "./pages/FAQPage";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import LivePricePage from "./pages/LivePricePage";
import MarketDashboardPage from "./pages/MarketDashboardPage";
import MarketIntelPage from "./pages/MarketIntelPage";
import MarketPulsePage from "./pages/MarketPulsePage";
import NotFoundPage from "./pages/NotFoundPage";
import PartnersPage from "./pages/PartnersPage";
import RoadmapPage from "./pages/RoadmapPage";
import SecurityTransparencyPage from "./pages/SecurityTransparencyPage";
import StakingSimulatorPage from "./pages/StakingSimulatorPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import TokenomicsPage from "./pages/TokenomicsPage";
import WhitepaperPage from "./pages/WhitepaperPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <ScrollToTop />
      <AuthInitializer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const whitepaperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/whitepaper",
  component: WhitepaperPage,
});
const tokenomicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tokenomics",
  component: TokenomicsPage,
});
const roadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/roadmap",
  component: RoadmapPage,
});
const partnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partners",
  component: PartnersPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FAQPage,
});
const acquisitionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/acquisition",
  component: AcquisitionPage,
});
const marketIntelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market-intel",
  component: MarketIntelPage,
});
const marketDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: MarketDashboardPage,
});
const communityVotingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/voting",
  component: CommunityVotingPage,
});
const communityGovernanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/governance",
  component: CommunityGovernancePage,
});
const communityHighlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityHighlightsPage,
});
const developerBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: DeveloperBlogPage,
});
const ecosystemGrowthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ecosystem",
  component: EcosystemGrowthPage,
});
const securityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/security",
  component: SecurityTransparencyPage,
});
const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/testimonials",
  component: TestimonialsPage,
});
const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insights",
  component: InsightsPage,
});
const livePriceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-price",
  component: LivePricePage,
});
const aiSentimentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sentiment",
  component: AISentimentPage,
});
const advancedAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AdvancedAnalyticsPage,
});
const alertsCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: AlertsCenterPage,
});
const marketPulseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market-pulse",
  component: MarketPulsePage,
});
const airdropPresaleHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/airdrop-presale",
  component: AirdropPresaleHubPage,
});
const stakingSimulatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staking",
  component: StakingSimulatorPage,
});
const communityLeaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: CommunityLeaderboardPage,
});
const adultFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/adult-form",
  component: AdultFormPage,
});
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  whitepaperRoute,
  tokenomicsRoute,
  roadmapRoute,
  partnersRoute,
  contactRoute,
  faqRoute,
  acquisitionRoute,
  marketIntelRoute,
  marketDashboardRoute,
  communityVotingRoute,
  communityGovernanceRoute,
  communityHighlightsRoute,
  developerBlogRoute,
  ecosystemGrowthRoute,
  securityRoute,
  testimonialsRoute,
  insightsRoute,
  livePriceRoute,
  aiSentimentRoute,
  advancedAnalyticsRoute,
  alertsCenterRoute,
  marketPulseRoute,
  airdropPresaleHubRoute,
  stakingSimulatorRoute,
  communityLeaderboardRoute,
  adultFormRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
