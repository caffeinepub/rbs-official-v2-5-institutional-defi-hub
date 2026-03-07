import { PageHead } from "@/components/PageHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  BookOpen,
  Box,
  Layers,
  Move,
  TrendingUp,
} from "lucide-react";

export default function IndicatorsGuidePage() {
  return (
    <>
      <PageHead
        title="Indicators Guide"
        description="Learn how to use technical indicators for trading"
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 mex-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <BookOpen className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-4">
                Indicators Guide
              </h1>
              <p className="text-xl metallic-text-secondary font-inter">
                Learn how to use technical indicators for better trading
                decisions
              </p>
            </div>

            <Card className="bg-white border border-gray-200 shadow-sm-gold glow-border mb-8 mex-fade-up animation-delay-200">
              <CardHeader>
                <CardTitle className="text-gold">
                  About Technical Indicators
                </CardTitle>
                <CardDescription>
                  Technical indicators are mathematical calculations based on
                  price, volume, or open interest that help traders analyze
                  market trends and make informed decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Accordion
              type="single"
              collapsible
              className="space-y-4 mex-fade-up animation-delay-400"
            >
              <AccordionItem
                value="rsi"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5" />
                    RSI (Relative Strength Index)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> RSI measures the speed and
                    magnitude of price changes to identify overbought or
                    oversold conditions.
                  </p>
                  <p>
                    <strong>Range:</strong> 0 to 100
                  </p>
                  <p>
                    <strong>Common Settings:</strong> 14-period RSI is standard
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>RSI above 70: Overbought (potential sell signal)</li>
                    <li>RSI below 30: Oversold (potential buy signal)</li>
                    <li>RSI around 50: Neutral momentum</li>
                  </ul>
                  <p>
                    <strong>Example:</strong> If RSI is at 75, the asset may be
                    overbought and due for a price correction.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="macd"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    MACD (Moving Average Convergence Divergence)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> MACD shows the relationship
                    between two moving averages to identify trend changes and
                    momentum.
                  </p>
                  <p>
                    <strong>Components:</strong> MACD line, Signal line, and
                    Histogram
                  </p>
                  <p>
                    <strong>Common Settings:</strong> 12, 26, 9 (fast, slow,
                    signal periods)
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>MACD crosses above signal line: Bullish signal</li>
                    <li>MACD crosses below signal line: Bearish signal</li>
                    <li>Positive MACD: Upward momentum</li>
                    <li>Negative MACD: Downward momentum</li>
                  </ul>
                  <p>
                    <strong>Example:</strong> When MACD line crosses above the
                    signal line, it suggests buying pressure is increasing.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="bollinger"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5" />
                    Bollinger Bands
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> Bollinger Bands consist of a
                    middle band (moving average) and two outer bands (standard
                    deviations) that measure volatility.
                  </p>
                  <p>
                    <strong>Components:</strong> Upper band, Middle band (SMA),
                    Lower band
                  </p>
                  <p>
                    <strong>Common Settings:</strong> 20-period SMA with 2
                    standard deviations
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Price near upper band: Potentially overbought</li>
                    <li>Price near lower band: Potentially oversold</li>
                    <li>
                      Bands squeeze: Low volatility, potential breakout coming
                    </li>
                    <li>Bands widen: High volatility, strong trend</li>
                  </ul>
                  <p>
                    <strong>Example:</strong> When bands squeeze together, it
                    often precedes a significant price movement.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="vwap"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5" />
                    VWAP (Volume Weighted Average Price)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> VWAP calculates the average
                    price weighted by volume, showing the true average price
                    paid.
                  </p>
                  <p>
                    <strong>Usage:</strong> Intraday trading benchmark
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Price above VWAP: Bullish sentiment</li>
                    <li>Price below VWAP: Bearish sentiment</li>
                    <li>VWAP acts as support/resistance level</li>
                  </ul>
                  <p>
                    <strong>Example:</strong> Institutional traders often use
                    VWAP to ensure they're getting fair prices on large orders.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="ma"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Move className="h-5 w-5" />
                    Moving Average
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> Moving averages smooth out
                    price data to identify trends by filtering out short-term
                    fluctuations.
                  </p>
                  <p>
                    <strong>Types:</strong> Simple Moving Average (SMA),
                    Exponential Moving Average (EMA)
                  </p>
                  <p>
                    <strong>Common Settings:</strong> 50-day, 100-day, 200-day
                    periods
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Price above MA: Uptrend</li>
                    <li>Price below MA: Downtrend</li>
                    <li>
                      Golden Cross (50 MA crosses above 200 MA): Strong buy
                      signal
                    </li>
                    <li>
                      Death Cross (50 MA crosses below 200 MA): Strong sell
                      signal
                    </li>
                  </ul>
                  <p>
                    <strong>Example:</strong> A 200-day moving average is widely
                    watched as a long-term trend indicator.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="fvg"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5" />
                    FVG (Fair Value Gap)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> Fair Value Gaps are price
                    imbalances where the market moved too quickly, leaving
                    unfilled orders.
                  </p>
                  <p>
                    <strong>Identification:</strong> Gaps between consecutive
                    candles with no overlap
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Bullish FVG: Gap below current price (potential support)
                    </li>
                    <li>
                      Bearish FVG: Gap above current price (potential
                      resistance)
                    </li>
                    <li>Price often returns to fill these gaps</li>
                  </ul>
                  <p>
                    <strong>Example:</strong> If price jumps from $100 to $105
                    with no trading in between, the $100-$105 range is an FVG
                    that may act as support.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="orderblocks"
                className="bg-white border border-gray-200 shadow-sm glow-border px-6"
              >
                <AccordionTrigger className="text-gold font-poppins font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5" />
                    Order Blocks
                  </div>
                </AccordionTrigger>
                <AccordionContent className="metallic-text-secondary space-y-3 pt-4">
                  <p>
                    <strong>What it is:</strong> Order blocks are price zones
                    where institutional traders placed large orders, creating
                    strong support or resistance.
                  </p>
                  <p>
                    <strong>Identification:</strong> Last down candle before a
                    strong move up (bullish) or last up candle before a strong
                    move down (bearish)
                  </p>
                  <p>
                    <strong>Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Bullish order block: Strong support zone</li>
                    <li>Bearish order block: Strong resistance zone</li>
                    <li>
                      Price often reacts strongly when returning to these zones
                    </li>
                  </ul>
                  <p>
                    <strong>Example:</strong> A bullish order block at $95-$97
                    may provide strong support if price returns to that level.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Card className="bg-white border border-gray-200 shadow-sm-gold glow-border mt-8 mex-fade-up animation-delay-600">
              <CardHeader>
                <CardTitle className="text-gold">Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="metallic-text-secondary space-y-3">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Never rely on a single indicator; use multiple indicators
                    for confirmation
                  </li>
                  <li>
                    Combine technical indicators with fundamental analysis
                  </li>
                  <li>
                    Adjust indicator settings based on your trading timeframe
                  </li>
                  <li>
                    Practice with historical data before trading with real money
                  </li>
                  <li>
                    Always use proper risk management and stop-loss orders
                  </li>
                  <li>
                    Remember that no indicator is 100% accurate; they provide
                    probabilities, not certainties
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
