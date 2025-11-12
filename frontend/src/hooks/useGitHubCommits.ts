import { useState, useEffect } from 'react';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

interface FormattedCommit {
  message: string;
  sha: string;
  shortSha: string;
  date: string;
  timeAgo: string;
  url: string;
  author: string;
}

export const useGitHubCommits = (owner: string, repo: string, limit: number = 10) => {
  const [commits, setCommits] = useState<FormattedCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: GitHubCommit[] = await response.json();

        const formattedCommits = data.map((commit) => ({
          message: commit.commit.message.split('\n')[0], // Get first line only
          sha: commit.sha,
          shortSha: commit.sha.substring(0, 7),
          date: commit.commit.author.date,
          timeAgo: formatTimeAgo(new Date(commit.commit.author.date)),
          url: commit.html_url,
          author: commit.commit.author.name,
        }));

        setCommits(formattedCommits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch commits');
        console.error('Error fetching GitHub commits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [owner, repo, limit]);

  return { commits, loading, error };
};

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}
