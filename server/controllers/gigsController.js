import { getDatabase } from '../db/database.js';

export async function getUserGigs(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;

    const gigs = db.prepare(`
      SELECT id, title, brand, category, budget, progress, status, due_date as dueDate, created_at as createdAt
      FROM gigs
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId);

    res.json({
      success: true,
      gigs
    });
  } catch (error) {
    next(error);
  }
}

export async function createGig(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    const { title, brand, category, budget, dueDate } = req.body;

    if (!title || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Title and budget are required.'
      });
    }

    const result = db.prepare(`
      INSERT INTO gigs (user_id, title, brand, category, budget, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      title,
      brand || 'Self-Created / Direct',
      category || 'Sponsorship',
      parseFloat(budget),
      dueDate || '7 Days'
    );

    const newGig = db.prepare(`
      SELECT id, title, brand, category, budget, progress, status, due_date as dueDate, created_at as createdAt
      FROM gigs
      WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig: newGig
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGigProgress(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    const { id } = req.params;
    const { progress, status } = req.body;

    const gig = db.prepare('SELECT * FROM gigs WHERE id = ? AND user_id = ?').get(id, userId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or unauthorized.'
      });
    }

    const newProgress = progress !== undefined ? parseInt(progress, 10) : gig.progress;
    const newStatus = status || (newProgress >= 100 ? 'Completed' : 'In Progress');

    db.prepare(`
      UPDATE gigs
      SET progress = ?, status = ?
      WHERE id = ? AND user_id = ?
    `).run(newProgress, newStatus, id, userId);

    const updatedGig = db.prepare(`
      SELECT id, title, brand, category, budget, progress, status, due_date as dueDate, created_at as createdAt
      FROM gigs
      WHERE id = ?
    `).get(id);

    res.json({
      success: true,
      message: 'Gig updated successfully',
      gig: updatedGig
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteGig(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    const { id } = req.params;

    const result = db.prepare('DELETE FROM gigs WHERE id = ? AND user_id = ?').run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or unauthorized.'
      });
    }

    res.json({
      success: true,
      message: 'Gig deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}
