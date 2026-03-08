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
import AboutPage from "./pages/AboutPage";
import AcquisitionPage from "./pages/AcquisitionPage";
import AdultFormPage from "./pages/AdultFormPage";
import AirdropPresaleHubPage from "./pages/AirdropPresaleHubPage";
import AlertsCenterPage from "./pages/AlertsCenterPage";
import CommunityGovernancePage from "./pages/CommunityGovernancePage";
import CommunityHighlightsPage from "./pages/CommunityHighlightsPage";
import CommunityLeaderboardPage from "./pages/CommunityLeaderboardPage";
import CommunityVotingPage from "./pages/CommunityVotingPage";
import ContactPage from "./pages/ContactPage";
import CryptoHeatmapPage from "./pages/CryptoHeatmapPage";
import DeveloperBlogPage from "./pages/DeveloperBlogPage";
import EcosystemGrowthPage from "./pages/EcosystemGrowthPage";
import FearGreedPage from "./pages/FearGreedPage";
import FundingRatesPage from "./pages/FundingRatesPage";
import HomePage from "./pages/HomePage";
import MarketDashboardPage from "./pages/MarketDashboardPage";
import MarketIntelPage from "./pages/MarketIntelPage";
import NotFoundPage from "./pages/NotFoundPage";
import PartnersPage from "./pages/PartnersPage";
import PortfolioTrackerPage from "./pages/PortfolioTrackerPage";
import RbsPricePage from "./pages/RbsPricePage";
import RoadmapPage from "./pages/RoadmapPage";
import SecurityTransparencyPage from "./pages/SecurityTransparencyPage";
import StakingSimulatorPage from "./pages/StakingSimulatorPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import TokenomicsPage from "./pages/TokenomicsPage";
import TradingToolsPage from "./pages/TradingToolsPage";
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
      {/* h-8 spacer for ticker bar (in addition to page-level pt-20/pt-24 offsets) */}
      <div className="h-8 flex-shrink-0" aria-hidden="true" />
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
const alertsCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: AlertsCenterPage,
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
const tradingToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trading-tools",
  component: TradingToolsPage,
});
const fearGreedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fear-greed",
  component: FearGreedPage,
});
const cryptoHeatmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crypto-heatmap",
  component: CryptoHeatmapPage,
});
const fundingRatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/funding-rates",
  component: FundingRatesPage,
});
const portfolioTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portfolio-tracker",
  component: PortfolioTrackerPage,
});
const rbsPriceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rbs-price",
  component: RbsPricePage,
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
  alertsCenterRoute,
  airdropPresaleHubRoute,
  stakingSimulatorRoute,
  communityLeaderboardRoute,
  adultFormRoute,
  tradingToolsRoute,
  fearGreedRoute,
  cryptoHeatmapRoute,
  fundingRatesRoute,
  portfolioTrackerRoute,
  rbsPriceRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
