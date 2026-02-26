import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthInitializer } from '@/components/AuthInitializer';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import WhitepaperPage from '@/pages/WhitepaperPage';
import RoadmapPage from '@/pages/RoadmapPage';
import TokenomicsPage from '@/pages/TokenomicsPage';
import AcquisitionPage from '@/pages/AcquisitionPage';
import AdultFormPage from '@/pages/AdultFormPage';
import FAQPage from '@/pages/FAQPage';
import ContactPage from '@/pages/ContactPage';
import CommunityGovernancePage from '@/pages/CommunityGovernancePage';
import CommunityVotingPage from '@/pages/CommunityVotingPage';
import CommunityHighlightsPage from '@/pages/CommunityHighlightsPage';
import EcosystemGrowthPage from '@/pages/EcosystemGrowthPage';
import SecurityTransparencyPage from '@/pages/SecurityTransparencyPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import MarketIntelPage from '@/pages/MarketIntelPage';
import MarketPulsePage from '@/pages/MarketPulsePage';
import LivePricePage from '@/pages/LivePricePage';
import AISentimentPage from '@/pages/AISentimentPage';
import AdvancedAnalyticsPage from '@/pages/AdvancedAnalyticsPage';
import AlertsCenterPage from '@/pages/AlertsCenterPage';
import InsightsPage from '@/pages/InsightsPage';
import NotFoundPage from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthInitializer />
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const whitepaperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/whitepaper',
  component: WhitepaperPage,
});

const roadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roadmap',
  component: RoadmapPage,
});

const tokenomicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tokenomics',
  component: TokenomicsPage,
});

const acquisitionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/acquisition',
  component: AcquisitionPage,
});

const adultFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/adult-form',
  component: AdultFormPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const communityGovernanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-governance',
  component: CommunityGovernancePage,
});

const communityVotingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-voting',
  component: CommunityVotingPage,
});

const communityHighlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-highlights',
  component: CommunityHighlightsPage,
});

const ecosystemGrowthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ecosystem-growth',
  component: EcosystemGrowthPage,
});

const securityTransparencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/security-transparency',
  component: SecurityTransparencyPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

const marketIntelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/market-intel',
  component: MarketIntelPage,
});

const marketPulseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/market-pulse',
  component: MarketPulsePage,
});

const livePriceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live-price',
  component: LivePricePage,
});

const cryptoNewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-news',
  component: AISentimentPage,
});

const advancedAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/advanced-analytics',
  component: AdvancedAnalyticsPage,
});

const alertsCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts-center',
  component: AlertsCenterPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: InsightsPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  whitepaperRoute,
  roadmapRoute,
  tokenomicsRoute,
  acquisitionRoute,
  adultFormRoute,
  faqRoute,
  contactRoute,
  communityGovernanceRoute,
  communityVotingRoute,
  communityHighlightsRoute,
  ecosystemGrowthRoute,
  securityTransparencyRoute,
  testimonialsRoute,
  marketIntelRoute,
  marketPulseRoute,
  livePriceRoute,
  cryptoNewsRoute,
  advancedAnalyticsRoute,
  alertsCenterRoute,
  insightsRoute,
  notFoundRoute,
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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
