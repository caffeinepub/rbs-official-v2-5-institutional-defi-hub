export interface SearchResult {
  path: string;
  title: string;
  description?: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchResult[] = [
  {
    path: '/',
    title: 'Home',
    description: 'RBS main page with overview and features',
    keywords: ['home', 'main', 'overview', 'start', 'rbs'],
  },
  {
    path: '/tokenomics',
    title: 'Tokenomics',
    description: 'Token distribution and economic model',
    keywords: ['tokenomics', 'token', 'distribution', 'supply', 'economics'],
  },
  {
    path: '/roadmap',
    title: 'Roadmap',
    description: 'Development timeline and milestones',
    keywords: ['roadmap', 'timeline', 'milestones', 'development', 'future'],
  },
  {
    path: '/whitepaper',
    title: 'Whitepaper',
    description: 'Technical documentation and project details',
    keywords: ['whitepaper', 'documentation', 'technical', 'details', 'paper'],
  },
  {
    path: '/acquisition',
    title: 'Acquisition Portal',
    description: 'Register for presale or airdrop',
    keywords: ['acquisition', 'presale', 'airdrop', 'register', 'buy', 'get'],
  },
  {
    path: '/market-intel',
    title: 'Market Intelligence',
    description: 'Advanced trading signals and market analysis',
    keywords: ['market', 'intel', 'intelligence', 'trading', 'signals', 'analysis'],
  },
  {
    path: '/market-pulse',
    title: 'Market Pulse',
    description: 'Real-time market sentiment and trends',
    keywords: ['market', 'pulse', 'sentiment', 'trends', 'live', 'real-time'],
  },
  {
    path: '/insights',
    title: 'Insights',
    description: 'Market analysis and expert commentary',
    keywords: ['insights', 'analysis', 'expert', 'commentary', 'research'],
  },
  {
    path: '/alerts-center',
    title: 'Alerts Center',
    description: 'Manage your notifications and alerts',
    keywords: ['alerts', 'notifications', 'center', 'messages'],
  },
  {
    path: '/community-governance',
    title: 'Community Governance',
    description: 'Participate in RBS governance',
    keywords: ['governance', 'community', 'voting', 'proposals', 'dao'],
  },
  {
    path: '/community-voting',
    title: 'Community Voting',
    description: 'Vote on proposals and decisions',
    keywords: ['voting', 'vote', 'proposals', 'community', 'democracy'],
  },
  {
    path: '/community-highlights',
    title: 'Community Highlights',
    description: 'Featured community achievements',
    keywords: ['community', 'highlights', 'achievements', 'members', 'featured'],
  },
  {
    path: '/testimonials',
    title: 'Testimonials',
    description: 'User reviews and feedback',
    keywords: ['testimonials', 'reviews', 'feedback', 'users', 'community'],
  },
  {
    path: '/about',
    title: 'About RBS',
    description: 'Learn about our mission and vision',
    keywords: ['about', 'mission', 'vision', 'team', 'story'],
  },
  {
    path: '/ecosystem-growth',
    title: 'Ecosystem Growth',
    description: 'Partnership and growth opportunities',
    keywords: ['ecosystem', 'growth', 'partnerships', 'expansion', 'development'],
  },
  {
    path: '/security-transparency',
    title: 'Security & Transparency',
    description: 'Security measures and transparency reports',
    keywords: ['security', 'transparency', 'audit', 'safety', 'trust'],
  },
  {
    path: '/contact',
    title: 'Contact Us',
    description: 'Get in touch with the RBS team',
    keywords: ['contact', 'support', 'help', 'reach', 'message'],
  },
  {
    path: '/faq',
    title: 'FAQ',
    description: 'Frequently asked questions',
    keywords: ['faq', 'questions', 'answers', 'help', 'support'],
  },
];
