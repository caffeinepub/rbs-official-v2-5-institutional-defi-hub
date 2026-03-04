# RBS Official

## Current State
Multi-page crypto token site (matte black + turquoise/amber neon theme). All pages exist and are routed. The site uses:
- SmokySectionTransition (IntersectionObserver fade/reveal) for scroll animations
- useScrollAnimation hook for element-level animations
- Motion library (Framer Motion v12) available but NOT used for premium animations
- Gold/amber color system throughout

**Known issues from previous builds:**
- `SmokySectionTransition` wraps with `smoky-section-hidden` / `smoky-section-visible` CSS classes but those CSS classes are NOT defined in index.css — causing sections to remain invisible (opacity:0, transform hidden state never resolved)
- HomePage uses mex-fade-in/mex-scale-in which start opacity:0 — but if JS doesn't fire or is too fast, content disappears
- TokenBurnTrackerPage.tsx is empty (0 bytes) — no burn tracker content but it's still imported/routed
- Some pages have minimal content (AboutPage, PartnersPage etc) that may appear blank
- Animation CSS class `.smoky-section-hidden` and `.smoky-section-visible` are MISSING from index.css — this is the PRIMARY cause of sections not appearing

## Requested Changes (Diff)

### Add
- CSS definitions for `.smoky-section-hidden` and `.smoky-section-visible` in index.css — CRITICAL FIX
- Premium scroll-triggered animations: floating particles, staggered card reveals, parallax hero, shimmer scan lines, pulsing neon borders, slide-in-from-sides, magnetic hover effects
- Keyframe animations: float, neon-pulse, scan, particle-drift, slide-reveal, bounce-subtle
- Animation utilities: `.animate-float`, `.animate-neon-pulse`, `.animate-scan`, `.animate-particle`, `.slide-left-reveal`, `.slide-right-reveal`, `.stagger-reveal`
- RBS-specific CSS variables: `--rbs-gold`, `--rbs-neon`, `--turquoise`
- Smooth scroll-triggered reveal for every major section using IntersectionObserver
- Staking Calculator visible link in Header nav (under Resources or standalone)
- HomePage: expand with Stats ticker, animated token metrics row, social links section
- Add `.neon-border-pulse` card variant for key sections

### Modify
- `src/index.css`: Add missing smoky-section CSS classes, add premium animation keyframes and utilities, fix body background to matte black theme
- `SmokySectionTransition.tsx`: Ensure CSS classes are properly applied and visible state works
- `HomePage.tsx`: Add animated stats ticker, richer hero with particle field, token metrics section  
- `Header.tsx`: Add Staking link in Resources dropdown
- All pages: Wrap key sections with better scroll animations using the `motion` library's `useInView` + `animate`

### Remove
- Any reference to `TokenBurnTrackerPage` routing (the file is empty)
- Burn tracker from navigation

## Implementation Plan
1. Fix `index.css` — add missing `.smoky-section-hidden` / `.smoky-section-visible` CSS classes (MOST CRITICAL)
2. Add comprehensive premium animation keyframes and utility classes to `index.css`
3. Update `SmokySectionTransition.tsx` to use motion library for smoother reveals
4. Create `AnimatedSection.tsx` component using Framer Motion for left/right/up/fade reveals
5. Update `HomePage.tsx` with animated stats ticker, particle hero, RBS metrics
6. Add Staking Calculator to Header nav
7. Fix all pages to use proper animation wrappers
8. Ensure matte black dark theme is the default/forced theme
