import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SEARCH_INDEX, type SearchResult } from './searchIndex';

interface SiteSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SiteSearch({ isOpen, onClose }: SiteSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery))
    );

    setResults(filtered.slice(0, 8));
  }, [query]);

  const handleSelect = (path: string) => {
    navigate({ to: path });
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search RBS
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, features, and content..."
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {query && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{query}"
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Button
                  key={result.path}
                  onClick={() => handleSelect(result.path)}
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4 hover:bg-primary/5"
                >
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{result.title}</div>
                    {result.description && (
                      <div className="text-sm text-muted-foreground mt-1">{result.description}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
