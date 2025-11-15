import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { db, FieldValue } from '../lib/admin';

const router = Router();

/**
 * GET /api/roadmap/votes
 * Get all roadmap feature votes
 * Public endpoint - no auth required
 */
router.get('/votes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const votesRef = db.collection('roadmapVotes');
    const snapshot = await votesRef.get();

    const votes: Record<string, { votes: number; hasVoted?: boolean }> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      votes[doc.id] = {
        votes: data.votes || 0,
      };
    });

    // If user is authenticated, check which features they've voted for
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.uid) {
      for (const featureId in votes) {
        const votersRef = votesRef.doc(featureId).collection('voters').doc(authReq.user.uid);
        const voterDoc = await votersRef.get();
        votes[featureId].hasVoted = voterDoc.exists;
      }
    }

    res.json({ votes });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/roadmap/vote
 * Vote for a roadmap feature (or remove vote)
 * Requires authentication
 *
 * Body: { featureId: string, action: 'vote' | 'unvote' }
 */
router.post('/vote', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featureId, action } = req.body;
    const uid = req.user!.uid;

    if (!featureId || typeof featureId !== 'string') {
      res.status(400).json({ error: 'Feature ID is required' });
      return;
    }

    if (action !== 'vote' && action !== 'unvote') {
      res.status(400).json({ error: 'Action must be "vote" or "unvote"' });
      return;
    }

    // Use transaction to ensure vote count accuracy
    const voteResult = await db.runTransaction(async (transaction: FirebaseFirestore.Transaction) => {
      const voteDocRef = db.collection('roadmapVotes').doc(featureId);
      const voterDocRef = voteDocRef.collection('voters').doc(uid);

      const voteDoc = await transaction.get(voteDocRef);
      const voterDoc = await transaction.get(voterDocRef);

      const currentVotes = voteDoc.exists ? (voteDoc.data()?.votes || 0) : 0;
      const hasVoted = voterDoc.exists;

      if (action === 'vote') {
        // Check if user has already voted
        if (hasVoted) {
          return { success: false, error: 'You have already voted for this feature', votes: currentVotes };
        }

        // Add vote
        const newVotes = currentVotes + 1;
        transaction.set(voteDocRef, {
          votes: newVotes,
          lastUpdated: FieldValue.serverTimestamp(),
        }, { merge: true });

        transaction.set(voterDocRef, {
          votedAt: FieldValue.serverTimestamp(),
        });

        return { success: true, votes: newVotes, hasVoted: true };
      } else {
        // Unvote
        if (!hasVoted) {
          return { success: false, error: 'You have not voted for this feature', votes: currentVotes };
        }

        // Remove vote
        const newVotes = Math.max(0, currentVotes - 1);
        transaction.set(voteDocRef, {
          votes: newVotes,
          lastUpdated: FieldValue.serverTimestamp(),
        }, { merge: true });

        transaction.delete(voterDocRef);

        return { success: true, votes: newVotes, hasVoted: false };
      }
    });

    if (!voteResult.success) {
      res.status(400).json({ error: voteResult.error });
      return;
    }

    res.json({
      success: true,
      featureId,
      votes: voteResult.votes,
      hasVoted: voteResult.hasVoted,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
