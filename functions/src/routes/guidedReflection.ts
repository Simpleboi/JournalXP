import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { db, admin } from '../lib/admin';
import { UserPathProgress } from '@shared/types/guidedReflection';

const router = Router();

/**
 * GET /api/guided-reflection/progress
 * Get all guided reflection progress for the authenticated user
 */
router.get('/progress', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;

    const progressRef = db.collection('users').doc(uid).collection('guidedReflectionProgress');
    const snapshot = await progressRef.get();

    const progress: { [pathId: string]: UserPathProgress } = {};
    snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      progress[doc.id] = doc.data() as UserPathProgress;
    });

    res.json({ progress });
  } catch (error) {
    console.error('Error fetching guided reflection progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * GET /api/guided-reflection/progress/:pathId
 * Get progress for a specific path
 */
router.get('/progress/:pathId', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { pathId } = req.params;

    const progressRef = db
      .collection('users')
      .doc(uid)
      .collection('guidedReflectionProgress')
      .doc(pathId);

    const doc = await progressRef.get();

    if (!doc.exists) {
      res.json({ progress: null });
      return;
    }

    res.json({ progress: doc.data() as UserPathProgress });
  } catch (error) {
    console.error('Error fetching path progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/guided-reflection/progress/:pathId
 * Save or update progress for a specific path
 */
router.post('/progress/:pathId', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { pathId } = req.params;
    const progress: UserPathProgress = req.body;

    // Validate the progress object
    if (!progress || progress.pathId !== pathId) {
      res.status(400).json({ error: 'Invalid progress data' });
      return;
    }

    const progressRef = db
      .collection('users')
      .doc(uid)
      .collection('guidedReflectionProgress')
      .doc(pathId);

    await progressRef.set({
      ...progress,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving path progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

/**
 * DELETE /api/guided-reflection/progress/:pathId
 * Delete progress for a specific path (restart)
 */
router.delete('/progress/:pathId', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { pathId } = req.params;

    const progressRef = db
      .collection('users')
      .doc(uid)
      .collection('guidedReflectionProgress')
      .doc(pathId);

    await progressRef.delete();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting path progress:', error);
    res.status(500).json({ error: 'Failed to delete progress' });
  }
});

export default router;
