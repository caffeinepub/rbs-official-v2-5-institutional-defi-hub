import { Skeleton } from '@/components/ui/skeleton';

export function MarketIntelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-48 bg-gold/10" />
            <Skeleton className="h-4 w-64 bg-gold/10" />
          </div>
          <Skeleton className="h-10 w-32 bg-gold/10" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-4 w-40 mb-2 bg-gold/10" />
          <Skeleton className="h-2 w-full bg-gold/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 bg-gold/10" />
                <Skeleton className="h-6 w-16 bg-gold/10" />
              </div>
              <Skeleton className="h-8 w-20 bg-gold/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
