import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Vote, Plus, Search, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import { useGetPollsByCode, useGetPollById, useCreatePoll, useCastVote, calculateTotalVotes, calculatePercentage } from '@/hooks/useCommunityVoting';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { PageHead } from '@/components/PageHead';
import { toast } from 'sonner';

export default function CommunityVotingPage() {
  const { identity } = useInternetIdentity();
  const [joinCode, setJoinCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [selectedPollId, setSelectedPollId] = useState<bigint | null>(null);
  const [activeTab, setActiveTab] = useState('join');

  // Create poll state
  const [createCode, setCreateCode] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [passcode, setPasscode] = useState('');

  const { data: polls, isLoading: pollsLoading, error: pollsError } = useGetPollsByCode(searchedCode, !!searchedCode);
  const { data: selectedPoll, isLoading: pollLoading } = useGetPollById(selectedPollId, selectedPollId !== null);
  const createPollMutation = useCreatePoll();
  const castVoteMutation = useCastVote();

  const handleSearch = () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }
    setSearchedCode(joinCode.trim());
    setSelectedPollId(null);
  };

  const handleCreatePoll = async () => {
    if (!createCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    if (!passcode.trim()) {
      toast.error('Please enter the Market Intel passcode');
      return;
    }
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    try {
      await createPollMutation.mutateAsync({
        code: createCode.trim(),
        question: question.trim(),
        options: validOptions,
        passcode: passcode.trim(),
      });
      toast.success('Poll created successfully!');
      setCreateCode('');
      setQuestion('');
      setOptions(['', '']);
      setPasscode('');
      setSearchedCode(createCode.trim());
      setActiveTab('join');
    } catch (error: any) {
      console.error('Create poll error:', error);
      toast.error(error.message || 'Failed to create poll');
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (!selectedPollId) return;

    try {
      await castVoteMutation.mutateAsync({
        pollId: selectedPollId,
        optionIndex: BigInt(optionIndex),
      });
      toast.success('Vote cast successfully!');
    } catch (error: any) {
      console.error('Vote error:', error);
      toast.error(error.message || 'Failed to cast vote');
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  if (!identity) {
    return (
      <>
        <PageHead title="Community Voting" description="Create and participate in community polls" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 mex-scale-in">
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

            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Note:</strong> Poll system backend is not yet implemented. This is a preview of the UI.
              </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join" className="mex-focus-ring">
                  <Search className="h-4 w-4 mr-2" />
                  Join & Vote
                </TabsTrigger>
                <TabsTrigger value="create" className="mex-focus-ring">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </TabsTrigger>
              </TabsList>

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

                {pollsError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {pollsError.message || 'Failed to load polls'}
                    </AlertDescription>
                  </Alert>
                )}

                {pollsLoading && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Vote className="h-12 w-12 text-gold mx-auto mb-4 animate-spin" />
                      <p className="text-lg metallic-text">Loading polls...</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

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
                      disabled={createPollMutation.isPending}
                      className="w-full bg-gold hover:bg-gold/90 text-black mex-hover-lift"
                    >
                      {createPollMutation.isPending ? (
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
