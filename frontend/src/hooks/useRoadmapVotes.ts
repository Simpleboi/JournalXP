import { useState, useEffect } from 'react';
import { authFetch } from '@/lib/authFetch';

interface VoteData {
  votes: number;
  hasVoted?: boolean;
}

interface VotesResponse {
  votes: Record<string, VoteData>;
}

interface VoteResponse {
  success: boolean;
  featureId: string;
  votes: number;
  hasVoted: boolean;
}

export const useRoadmapVotes = () => {
  const [votes, setVotes] = useState<Record<string, VoteData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<Record<string, boolean>>({});

  // Fetch all votes on mount
  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try authenticated fetch first (will show hasVoted status)
      // If not authenticated, falls back to public fetch
      const response = await fetch('/api/roadmap/votes', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch votes: ${response.status}`);
      }

      const data: VotesResponse = await response.json();
      setVotes(data.votes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch votes');
      console.error('Error fetching votes:', err);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (featureId: string): Promise<boolean> => {
    try {
      setVotingInProgress((prev) => ({ ...prev, [featureId]: true }));

      const response = await authFetch('/roadmap/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featureId,
          action: 'vote',
        }),
      });

      const data: VoteResponse = response as VoteResponse;

      // Optimistically update local state
      setVotes((prev) => ({
        ...prev,
        [featureId]: {
          votes: data.votes,
          hasVoted: data.hasVoted,
        },
      }));

      return true;
    } catch (err) {
      console.error('Error voting:', err);
      // Re-fetch to get correct state
      await fetchVotes();
      throw err;
    } finally {
      setVotingInProgress((prev) => ({ ...prev, [featureId]: false }));
    }
  };

  const unvote = async (featureId: string): Promise<boolean> => {
    try {
      setVotingInProgress((prev) => ({ ...prev, [featureId]: true }));

      const response = await authFetch('/roadmap/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featureId,
          action: 'unvote',
        }),
      });

      const data: VoteResponse = response as VoteResponse;

      // Optimistically update local state
      setVotes((prev) => ({
        ...prev,
        [featureId]: {
          votes: data.votes,
          hasVoted: data.hasVoted,
        },
      }));

      return true;
    } catch (err) {
      console.error('Error unvoting:', err);
      // Re-fetch to get correct state
      await fetchVotes();
      throw err;
    } finally {
      setVotingInProgress((prev) => ({ ...prev, [featureId]: false }));
    }
  };

  const toggleVote = async (featureId: string): Promise<void> => {
    const currentVote = votes[featureId];
    if (currentVote?.hasVoted) {
      await unvote(featureId);
    } else {
      await vote(featureId);
    }
  };

  const getVotes = (featureId: string): number => {
    return votes[featureId]?.votes || 0;
  };

  const hasVoted = (featureId: string): boolean => {
    return votes[featureId]?.hasVoted || false;
  };

  const isVoting = (featureId: string): boolean => {
    return votingInProgress[featureId] || false;
  };

  return {
    votes,
    loading,
    error,
    vote,
    unvote,
    toggleVote,
    getVotes,
    hasVoted,
    isVoting,
    refetch: fetchVotes,
  };
};
