import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Vote, Plus, Search, AlertCircle } from 'lucide-react';
import { useCommunityVoting } from '@/hooks/useCommunityVoting';
import type { PollView } from '@/hooks/useCommunityVoting';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { PageHead } from '@/components/PageHead';
import { toast } from 'sonner';

const MARKET_INTEL_PASSCODE = 'BP2420075112009BP';

function getTotalVotes(poll: PollView): number {
  return poll.votes.reduce((sum, kv) => sum + Number(kv.value), 0);
}

function getVoteCount(poll: PollView, option: string): number {
  const kv = poll.votes.find((v) => v.key === option);
  return kv ? Number(kv.value) : 0;
}

function getPercentage(poll: PollView, option: string): number {
  const total = getTotalVotes(poll);
  if (total === 0) return 0;
  return (getVoteCount(poll, option) / total) * 100;
}

export default function CommunityVotingPage() {
  const { identity } = useInternetIdentity();
  const [joinCode, setJoinCode] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [activeTab, setActiveTab] = useState('join');

  // Create poll state
  const [createCode, setCreateCode] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [passcode, setPasscode] = useState('');

  // Track which polls the user has voted on (client-side, backend enforces dedup)
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  const { polls, isLoading, error, createPoll, castVote, isCreating, isVoting } = useCommunityVoting(activeCode);

  const handleSearch = () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }
    setActiveCode(joinCode.trim());
  };

  const handleCreatePoll = async () => {
    if (!createCode.trim()) { toast.error('Please enter a join code'); return; }
    if (!question.trim()) { toast.error('Please enter a question'); return; }
    if (!passcode.trim()) { toast.error('Please enter the Market Intel passcode'); return; }
    if (passcode !== MARKET_INTEL_PASSCODE) { toast.error('Invalid passcode'); return; }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) { toast.error('Please provide at least 2 options'); return; }

    try {
      await createPoll(question.trim(), validOptions, createCode.trim());
      toast.success('Poll created successfully!');
      setCreateCode('');
      setQuestion('');
      setOptions(['', '']);
      setPasscode('');
      setActiveCode(createCode.trim());
      setJoinCode(createCode.trim());
      setActiveTab('join');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create poll');
    }
  };

  const handleVote = async (poll: PollView, optionIndex: number) => {
    const key = String(poll.id);
    if (votedPolls.has(key)) {
      toast.error('You have already voted on this poll');
      return;
    }
    try {
      await castVote(poll.id, optionIndex);
      setVotedPolls((prev) => new Set([...prev, key]));
      toast.success('Vote cast successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to cast vote');
    }
  };

  const addOption = () => {
    if (options.length < 10) setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  if (!identity) {
    return (
      <>
        <PageHead title="Community Voting" description="Create and participate in community polls" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-gold">Authentication Required</CardTitle>
              <CardDescription>Please log in to access Community Voting</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Community Voting" description="Create and participate in community polls" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 mex-fade-up">
              <h1 className="text-4xl md:text-5xl font-poppins font-bold metallic-text-hero mb-2">
                Community Voting
              </h1>
              <p className="text-lg metallic-text-secondary">
                Create polls and vote on community decisions
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join" className="mex-focus-ring">
                  <Search className="h-4 w-4 mr-2" />
                  Join &amp; Vote
                </TabsTrigger>
                <TabsTrigger value="create" className="mex-focus-ring">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </TabsTrigger>
              </TabsList>

              {/* ── JOIN & VOTE TAB ── */}
              <TabsContent value="join" className="space-y-6">
                <Card className="glass-card-gold glow-border">
                  <CardHeader>
                    <CardTitle className="text-gold">Enter Join Code</CardTitle>
                    <CardDescription>Enter the code to view and vote on polls (no passcode required)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Enter join code"
                        className="mex-focus-ring"
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={!joinCode.trim()}
                        className="bg-gold hover:bg-gold/90 text-black mex-hover-lift"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error instanceof Error ? error.message : 'Failed to load polls'}
                    </AlertDescription>
                  </Alert>
                )}

                {isLoading && activeCode && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Vote className="h-12 w-12 text-gold mx-auto mb-4 animate-spin" />
                      <p className="text-lg metallic-text">Loading polls...</p>
                    </CardContent>
                  </Card>
                )}

                {!isLoading && activeCode && polls.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">No polls found for this code.</p>
                      <p className="text-sm text-muted-foreground mt-1">Try a different code or create a new poll.</p>
                    </CardContent>
                  </Card>
                )}

                {!isLoading && polls.length > 0 && (
                  <div className="space-y-6">
                    {polls.map((poll) => {
                      const total = getTotalVotes(poll);
                      const hasVoted = votedPolls.has(String(poll.id));
                      return (
                        <Card key={String(poll.id)} className="glass-card-gold glow-border">
                          <CardHeader>
                            <CardTitle className="text-foreground">{poll.question}</CardTitle>
                            <CardDescription>
                              {total} vote{total !== 1 ? 's' : ''} · Code: {poll.code}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {poll.options.map((option, idx) => {
                              const pct = getPercentage(poll, option);
                              const count = getVoteCount(poll, option);
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-foreground font-medium">{option}</span>
                                    <span className="text-muted-foreground">{count} ({pct.toFixed(1)}%)</span>
                                  </div>
                                  <Progress value={pct} className="h-2" />
                                  {!hasVoted && poll.isActive && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleVote(poll, idx)}
                                      disabled={isVoting}
                                      className="mt-1 border-gold text-gold hover:bg-gold/10 mex-hover-lift"
                                    >
                                      <Vote className="h-3 w-3 mr-1" />
                                      Vote
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                            {hasVoted && (
                              <p className="text-sm text-green-600 font-medium mt-2">✓ You have voted on this poll</p>
                            )}
                            {!poll.isActive && (
                              <p className="text-sm text-muted-foreground mt-2">This poll is closed.</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* ── CREATE POLL TAB ── */}
              <TabsContent value="create" className="space-y-6">
                <Card className="glass-card-gold glow-border">
                  <CardHeader>
                    <CardTitle className="text-gold">Create New Poll</CardTitle>
                    <CardDescription>Set up a new poll for your community (requires Market Intel passcode)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="passcode">Market Intel Passcode</Label>
                      <Input
                        id="passcode"
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter Market Intel passcode"
                        className="mt-2 mex-focus-ring"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Same passcode used for Market Intel access
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="createCode">Join Code</Label>
                      <Input
                        id="createCode"
                        value={createCode}
                        onChange={(e) => setCreateCode(e.target.value)}
                        placeholder="Enter a unique code for this poll"
                        className="mt-2 mex-focus-ring"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Share this code with others to let them vote
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to ask?"
                        className="mt-2 mex-focus-ring"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Options</Label>
                      {options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="mex-focus-ring"
                          />
                          {options.length > 2 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeOption(index)}
                              className="mex-hover-lift"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      {options.length < 10 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={addOption}
                          className="w-full border-gold text-gold hover:bg-gold/10 mex-hover-lift"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={handleCreatePoll}
                      disabled={isCreating}
                      className="w-full bg-gold hover:bg-gold/90 text-black mex-hover-lift"
                    >
                      {isCreating ? (
                        <>
                          <Vote className="mr-2 h-4 w-4 animate-spin" />
                          Creating Poll...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Poll
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
