import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import HomePage from './pages/HomePage';
import MarketIntelPage from './pages/MarketIntelPage';
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
import MarketPulsePage from './pages/MarketPulsePage';
import AlertsCenterPage from './pages/AlertsCenterPage';

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

const marketPulseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/market-pulse',
  component: MarketPulsePage,
});

const alertsCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts-center',
  component: AlertsCenterPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  marketIntelRoute,
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
  marketPulseRoute,
  alertsCenterRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
