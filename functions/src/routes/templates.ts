/**
 * API routes for journal template management
 * Handles CRUD operations for custom templates and template preferences
 */

import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { db, FieldValue } from '../lib/admin';
import { PREBUILT_TEMPLATES } from '../../../shared/data/prebuiltTemplates';
import {
  JournalTemplate,
  TemplatePayload,
  TemplateResponse,
  UserTemplatePreferences,
} from '../../../shared/types/templates';
import { tsToIso } from '../../../shared/utils/date';

const router = Router();

/**
 * GET /api/templates
 * Get all templates (pre-built + user's custom templates)
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;

    // Get user's custom templates
    const customTemplatesSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('templates')
      .orderBy('createdAt', 'desc')
      .get();

    const customTemplates: TemplateResponse[] = customTemplatesSnapshot.docs.map(
      (doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: tsToIso(data.createdAt),
          updatedAt: data.updatedAt ? tsToIso(data.updatedAt) : undefined,
        } as TemplateResponse;
      }
    );

    // Combine pre-built and custom templates
    const allTemplates = [...PREBUILT_TEMPLATES, ...customTemplates];

    res.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
    return;
  }
});

/**
 * GET /api/templates/prebuilt
 * Get all pre-built templates
 */
router.get('/prebuilt', async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json(PREBUILT_TEMPLATES);
  } catch (error) {
    console.error('Error fetching pre-built templates:', error);
    res.status(500).json({ error: 'Failed to fetch pre-built templates' });
    return;
  }
});

/**
 * GET /api/templates/:id
 * Get a specific template by ID
 */
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.user!.uid;

    // Check if it's a pre-built template
    const prebuiltTemplate = PREBUILT_TEMPLATES.find((t) => t.id === id);
    if (prebuiltTemplate) {
      res.json(prebuiltTemplate); return;
    }

    // Check user's custom templates
    const templateDoc = await db
      .collection('users')
      .doc(uid)
      .collection('templates')
      .doc(id)
      .get();

    if (!templateDoc.exists) {
      res.status(404).json({ error: 'Template not found' }); return;
    }

    const data = templateDoc.data()!;
    const template: TemplateResponse = {
      id: templateDoc.id,
      ...data,
      createdAt: tsToIso(data.createdAt),
      updatedAt: data.updatedAt ? tsToIso(data.updatedAt) : undefined,
    } as TemplateResponse;

    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
    return;
  }
});

/**
 * POST /api/templates
 * Create a new custom template
 */
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const payload: TemplatePayload = req.body;

    // Validate required fields
    if (!payload.name || !payload.description || !payload.category || !payload.structureType) {
      res.status(400).json({
        error: 'Missing required fields: name, description, category, structureType'
      }); return;
    }

    // Add IDs to fields if they don't have them
    const fields = payload.fields?.map((field, index) => ({
      ...field,
      id: (field as any).id || `field-${Date.now()}-${index}`,
    }));

    const newTemplate: Omit<JournalTemplate, 'id'> = {
      ...payload,
      fields,
      isPrebuilt: false,
      isPublic: payload.isPublic || false,
      createdBy: uid,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    const templateRef = await db
      .collection('users')
      .doc(uid)
      .collection('templates')
      .add({
        ...newTemplate,
        createdAt: FieldValue.serverTimestamp(),
      });

    const createdTemplate: TemplateResponse = {
      id: templateRef.id,
      ...newTemplate,
    };

    res.status(201).json(createdTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
    return;
  }
});

/**
 * PUT /api/templates/:id
 * Update a custom template
 */
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.user!.uid;
    const updates: Partial<TemplatePayload> = req.body;

    // Cannot update pre-built templates
    const isPrebuilt = PREBUILT_TEMPLATES.some((t) => t.id === id);
    if (isPrebuilt) {
      res.status(403).json({ error: 'Cannot update pre-built templates' }); return;
    }

    const templateRef = db
      .collection('users')
      .doc(uid)
      .collection('templates')
      .doc(id);

    const templateDoc = await templateRef.get();
    if (!templateDoc.exists) {
      res.status(404).json({ error: 'Template not found' }); return;
    }

    // Add IDs to fields if updating fields
    const fields = updates.fields?.map((field, index) => ({
      ...field,
      id: (field as any).id || `field-${Date.now()}-${index}`,
    }));

    await templateRef.update({
      ...updates,
      fields,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await templateRef.get();
    const data = updatedDoc.data()!;

    const updatedTemplate: TemplateResponse = {
      id: updatedDoc.id,
      ...data,
      createdAt: tsToIso(data.createdAt),
      updatedAt: tsToIso(data.updatedAt),
    } as TemplateResponse;

    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
    return;
  }
});

/**
 * DELETE /api/templates/:id
 * Delete a custom template
 */
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.user!.uid;

    // Cannot delete pre-built templates
    const isPrebuilt = PREBUILT_TEMPLATES.some((t) => t.id === id);
    if (isPrebuilt) {
      res.status(403).json({ error: 'Cannot delete pre-built templates' }); return;
    }

    const templateRef = db
      .collection('users')
      .doc(uid)
      .collection('templates')
      .doc(id);

    const templateDoc = await templateRef.get();
    if (!templateDoc.exists) {
      res.status(404).json({ error: 'Template not found' }); return;
    }

    await templateRef.delete();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
    return;
  }
});

/**
 * POST /api/templates/:id/use
 * Increment usage count for a template
 */
router.post('/:id/use', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.user!.uid;

    // For pre-built templates, track usage in user preferences
    const isPrebuilt = PREBUILT_TEMPLATES.some((t) => t.id === id);

    if (!isPrebuilt) {
      // Update custom template usage count
      const templateRef = db
        .collection('users')
        .doc(uid)
        .collection('templates')
        .doc(id);

      await templateRef.update({
        usageCount: FieldValue.increment(1),
      });
    }

    // Update user's recent templates
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    let recentTemplateIds = userData?.templatePreferences?.recentTemplateIds || [];

    // Remove if already exists and add to front
    recentTemplateIds = recentTemplateIds.filter((tid: string) => tid !== id);
    recentTemplateIds.unshift(id);

    // Keep only last 10
    recentTemplateIds = recentTemplateIds.slice(0, 10);

    await userRef.set(
      {
        templatePreferences: {
          ...userData?.templatePreferences,
          recentTemplateIds,
        },
      },
      { merge: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking template usage:', error);
    res.status(500).json({ error: 'Failed to track template usage' });
    return;
  }
});

/**
 * GET /api/templates/preferences
 * Get user's template preferences
 */
router.get('/preferences/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const preferences: UserTemplatePreferences = userData?.templatePreferences || {
      favoriteTemplateIds: [],
      hiddenTemplateIds: [],
      recentTemplateIds: [],
    };

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching template preferences:', error);
    res.status(500).json({ error: 'Failed to fetch template preferences' });
    return;
  }
});

/**
 * PUT /api/templates/preferences
 * Update user's template preferences
 */
router.put('/preferences/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const updates: Partial<UserTemplatePreferences> = req.body;

    const userRef = db.collection('users').doc(uid);

    await userRef.set(
      {
        templatePreferences: updates,
      },
      { merge: true }
    );

    res.json(updates);
  } catch (error) {
    console.error('Error updating template preferences:', error);
    res.status(500).json({ error: 'Failed to update template preferences' });
    return;
  }
});

/**
 * POST /api/templates/:id/favorite
 * Toggle favorite status for a template
 */
router.post('/:id/favorite', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.user!.uid;

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    let favoriteTemplateIds = userData?.templatePreferences?.favoriteTemplateIds || [];

    // Toggle favorite
    if (favoriteTemplateIds.includes(id)) {
      favoriteTemplateIds = favoriteTemplateIds.filter((tid: string) => tid !== id);
    } else {
      favoriteTemplateIds.push(id);
    }

    await userRef.set(
      {
        templatePreferences: {
          ...userData?.templatePreferences,
          favoriteTemplateIds,
        },
      },
      { merge: true }
    );

    res.json({ isFavorite: favoriteTemplateIds.includes(id) });
  } catch (error) {
    console.error('Error toggling template favorite:', error);
    res.status(500).json({ error: 'Failed to toggle template favorite' });
    return;
  }
});

export default router;
