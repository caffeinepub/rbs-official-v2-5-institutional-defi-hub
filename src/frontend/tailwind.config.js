import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                gold: 'hsl(var(--gold))',
                'gold-light': 'hsl(var(--gold-light))',
                'gold-dark': 'hsl(var(--gold-dark))',
                silver: 'hsl(var(--silver))',
                steel: 'hsl(var(--steel))'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
                'glass-gold': '0 8px 32px 0 rgba(218, 165, 32, 0.15)',
                'gold-sm': '0 2px 12px rgba(218, 165, 32, 0.2)',
                'gold-md': '0 4px 24px rgba(218, 165, 32, 0.25)',
                'gold-lg': '0 8px 48px rgba(218, 165, 32, 0.3)',
                'gold-xl': '0 12px 64px rgba(218, 165, 32, 0.35)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            },
            letterSpacing: {
                tighter: '-0.04em',
                tight: '-0.02em',
                normal: '0',
                wide: '0.02em',
                wider: '0.04em',
                widest: '0.08em'
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                'sm': ['0.875rem', { lineHeight: '1.55', letterSpacing: '-0.01em' }],
                'base': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.015em' }],
                '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
                '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
                '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
                '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
