import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import HomePage from './pages/HomePage';
import MarketIntelPage from './pages/MarketIntelPage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import LivePricePage from './pages/LivePricePage';
import CommunityVotingPage from './pages/CommunityVotingPage';
import AcquisitionPage from './pages/AcquisitionPage';
import WhitepaperPage from './pages/WhitepaperPage';
import TokenomicsPage from './pages/TokenomicsPage';
import RoadmapPage from './pages/RoadmapPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import CommunityGovernancePage from './pages/CommunityGovernancePage';
import EcosystemGrowthPage from './pages/EcosystemGrowthPage';
import CommunityHighlightsPage from './pages/CommunityHighlightsPage';
import SecurityTransparencyPage from './pages/SecurityTransparencyPage';
import TestimonialsPage from './pages/TestimonialsPage';
import InsightsPage from './pages/InsightsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000,
    },
  },
});

function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background text-foreground">
        <main>
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const marketIntelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/market-intel',
  component: MarketIntelPage,
});

const advancedAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/advanced-analytics',
  component: AdvancedAnalyticsPage,
});

const aiSentimentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-sentiment',
  component: MarketIntelPage,
});

const livePriceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live-price',
  component: LivePricePage,
});

const communityVotingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-voting',
  component: CommunityVotingPage,
});

const acquisitionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/acquisition',
  component: AcquisitionPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: InsightsPage,
});

const whitepaperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/whitepaper',
  component: WhitepaperPage,
});

const tokenomicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tokenomics',
  component: TokenomicsPage,
});

const roadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roadmap',
  component: RoadmapPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQPage,
});

const communityGovernanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-governance',
  component: CommunityGovernancePage,
});

const ecosystemGrowthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ecosystem-growth',
  component: EcosystemGrowthPage,
});

const communityHighlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-highlights',
  component: CommunityHighlightsPage,
});

const securityTransparencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/security-transparency',
  component: SecurityTransparencyPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  marketIntelRoute,
  advancedAnalyticsRoute,
  aiSentimentRoute,
  livePriceRoute,
  communityVotingRoute,
  acquisitionRoute,
  testimonialsRoute,
  insightsRoute,
  whitepaperRoute,
  tokenomicsRoute,
  roadmapRoute,
  aboutRoute,
  contactRoute,
  faqRoute,
  communityGovernanceRoute,
  ecosystemGrowthRoute,
  communityHighlightsRoute,
  securityTransparencyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
