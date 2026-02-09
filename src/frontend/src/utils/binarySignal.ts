/**
 * Binary signal processing utilities for converting Market Intelligence data
 * into binary options signals (CALL/PUT).
 */

import { SignalConfidence, type MarketIntelligence } from '@/backend';

export interface BinarySignal {
  signal: 'CALL' | 'PUT';
  confidence: number;
  rawData: MarketIntelligence | null;
}

/**
 * Converts Market Intelligence array to a binary signal
 * Takes the most recent entry and derives CALL/PUT signal
 */
export function processBinarySignal(data: MarketIntelligence[] | undefined): BinarySignal | null {
  if (!data || data.length === 0) {
    return null;
  }

  // Get the most recent entry (highest timestamp)
  const latestEntry = data.reduce((latest, current) => {
    return current.timestamp > latest.timestamp ? current : latest;
  }, data[0]);

  // Determine CALL or PUT based on overall signal
  const isCallSignal = 
    latestEntry.overallSignal === SignalConfidence.strongBuy ||
    latestEntry.overallSignal === SignalConfidence.buy;

  // Calculate confidence percentage
  const confidence = calculateBinaryConfidence(latestEntry.overallSignal, latestEntry.historicalAccuracy);

  return {
    signal: isCallSignal ? 'CALL' : 'PUT',
    confidence,
    rawData: latestEntry,
  };
}

/**
 * Calculates binary options confidence percentage
 */
function calculateBinaryConfidence(signal: SignalConfidence, historicalAccuracy: number): number {
  let baseConfidence: number;

  switch (signal) {
    case SignalConfidence.strongBuy:
    case SignalConfidence.strongSell:
      baseConfidence = 90;
      break;
    case SignalConfidence.buy:
    case SignalConfidence.sell:
      baseConfidence = 75;
      break;
    case SignalConfidence.neutral:
      baseConfidence = 50;
      break;
    default:
      baseConfidence = 50;
  }

  // Blend with historical accuracy (weighted 70% base, 30% historical)
  const blendedConfidence = (baseConfidence * 0.7) + (historicalAccuracy * 0.3);

  // Clamp between 50 and 95
  return Math.min(95, Math.max(50, Math.round(blendedConfidence)));
}
