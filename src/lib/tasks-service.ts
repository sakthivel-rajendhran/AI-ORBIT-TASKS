import { getDb, TaskRecord, TaskSummary, TaskAssignment, AssignmentStatus } from './db';

export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  technology?: string;
  skill?: string;
  featured?: boolean;
  sort?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface RawTaskRow {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  status: string;
  estimatedTime: string;
  featured: number;
  participants: number;
}

interface RawTaskDetailRow extends RawTaskRow {
  description: string;
  popularity: string;
  expectedOutcome: string;
  createdAt: string;
  updatedAt: string;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory micro-caches with TTL
let statsCache: CacheEntry<{ totalTasks: number; totalCategories: number; featuredTasks: number; activeTasks: number }> | null = null;
let categoriesCache: CacheEntry<{ name: string; count: number }[]> | null = null;
const taskDetailCache = new Map<string, CacheEntry<TaskRecord>>();

export function getTasks(params: GetTasksParams): PaginatedResult<TaskSummary> {
  const db = getDb();

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
  const offset = (page - 1) * limit;

  const whereClauses: string[] = [];
  const bindings: Record<string, string | number> = {};

  if (params.search && params.search.trim()) {
    const term = `%${params.search.trim()}%`;
    bindings.search = term;
    whereClauses.push(`(
      t.title LIKE @search
      OR t.short_description LIKE @search
      OR t.description LIKE @search
      OR t.category LIKE @search
      OR EXISTS (SELECT 1 FROM task_technologies tt WHERE tt.task_id = t.id AND tt.name LIKE @search)
      OR EXISTS (SELECT 1 FROM task_skills ts WHERE ts.task_id = t.id AND ts.name LIKE @search)
    )`);
  }

  if (params.category && params.category.trim() && params.category.toLowerCase() !== 'all') {
    bindings.category = params.category.trim();
    whereClauses.push(`LOWER(t.category) = LOWER(@category)`);
  }

  if (params.difficulty && params.difficulty.trim() && params.difficulty.toLowerCase() !== 'all') {
    bindings.difficulty = params.difficulty.trim();
    whereClauses.push(`LOWER(t.difficulty) = LOWER(@difficulty)`);
  }

  if (params.status && params.status.trim() && params.status.toLowerCase() !== 'all') {
    bindings.status = params.status.trim();
    whereClauses.push(`LOWER(t.status) = LOWER(@status)`);
  }

  if (params.technology && params.technology.trim() && params.technology.toLowerCase() !== 'all') {
    bindings.technology = params.technology.trim();
    whereClauses.push(`EXISTS (
      SELECT 1 FROM task_technologies tt 
      WHERE tt.task_id = t.id AND LOWER(tt.name) = LOWER(@technology)
    )`);
  }

  if (params.skill && params.skill.trim() && params.skill.toLowerCase() !== 'all') {
    bindings.skill = params.skill.trim();
    whereClauses.push(`EXISTS (
      SELECT 1 FROM task_skills ts 
      WHERE ts.task_id = t.id AND LOWER(ts.name) = LOWER(@skill)
    )`);
  }

  if (params.featured !== undefined) {
    bindings.featured = params.featured ? 1 : 0;
    whereClauses.push(`t.featured = @featured`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let orderBySql = 'ORDER BY t.featured DESC, t.created_at DESC';
  switch (params.sort?.toLowerCase()) {
    case 'newest':
      orderBySql = 'ORDER BY t.created_at DESC';
      break;
    case 'oldest':
      orderBySql = 'ORDER BY t.created_at ASC';
      break;
    case 'most-popular':
    case 'most popular':
    case 'popular':
    case 'popularity':
      orderBySql = 'ORDER BY t.participants DESC';
      break;
    case 'shortest-time':
    case 'shortest time':
      orderBySql = 'ORDER BY t.estimated_time ASC';
      break;
    case 'longest-time':
    case 'longest time':
      orderBySql = 'ORDER BY t.estimated_time DESC';
      break;
    case 'difficulty':
      orderBySql = `ORDER BY CASE t.difficulty 
        WHEN 'Beginner' THEN 1 
        WHEN 'Intermediate' THEN 2 
        WHEN 'Advanced' THEN 3 
        WHEN 'Expert' THEN 4 
        ELSE 5 END ASC`;
      break;
    case 'featured':
    default:
      orderBySql = 'ORDER BY t.featured DESC, t.created_at DESC';
      break;
  }

  // Count query
  const countStmt = db.prepare(`
    SELECT COUNT(*) as total
    FROM tasks t
    ${whereSql}
  `);
  const totalRow = countStmt.get(bindings) as { total: number };
  const total = totalRow?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // Data query
  const dataStmt = db.prepare(`
    SELECT 
      t.id,
      t.slug,
      t.title,
      t.short_description as shortDescription,
      t.category,
      t.difficulty,
      t.status,
      t.estimated_time as estimatedTime,
      t.featured,
      t.participants
    FROM tasks t
    ${whereSql}
    ${orderBySql}
    LIMIT @limit OFFSET @offset
  `);

  const taskRows = dataStmt.all({
    ...bindings,
    limit,
    offset
  }) as RawTaskRow[];

  if (taskRows.length === 0) {
    return {
      data: [],
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  const taskIds = taskRows.map((r) => r.id);
  const placeholders = taskIds.map(() => '?').join(',');

  const techs = db.prepare(`
    SELECT task_id, name FROM task_technologies WHERE task_id IN (${placeholders})
  `).all(...taskIds) as { task_id: string; name: string }[];

  const skills = db.prepare(`
    SELECT task_id, name FROM task_skills WHERE task_id IN (${placeholders})
  `).all(...taskIds) as { task_id: string; name: string }[];

  const techMap = new Map<string, string[]>();
  const skillMap = new Map<string, string[]>();

  for (const t of techs) {
    if (!techMap.has(t.task_id)) techMap.set(t.task_id, []);
    techMap.get(t.task_id)!.push(t.name);
  }

  for (const s of skills) {
    if (!skillMap.has(s.task_id)) skillMap.set(s.task_id, []);
    skillMap.get(s.task_id)!.push(s.name);
  }

  const data: TaskSummary[] = taskRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    category: row.category,
    difficulty: row.difficulty,
    status: row.status,
    estimatedTime: row.estimatedTime,
    featured: Boolean(row.featured),
    participants: row.participants,
    technologies: techMap.get(row.id) || [],
    skills: skillMap.get(row.id) || []
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

export function getTaskBySlug(slug: string): TaskRecord | null {
  if (!slug || typeof slug !== 'string') return null;
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  const now = Date.now();
  const cached = taskDetailCache.get(cleanSlug);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const db = getDb();

  const taskRow = db.prepare(`
    SELECT 
      id,
      slug,
      title,
      short_description as shortDescription,
      description,
      category,
      difficulty,
      status,
      estimated_time as estimatedTime,
      featured,
      participants,
      popularity,
      expected_outcome as expectedOutcome,
      created_at as createdAt,
      updated_at as updatedAt
    FROM tasks
    WHERE LOWER(slug) = ?
  `).get(cleanSlug) as RawTaskDetailRow | undefined;

  if (!taskRow) {
    return null;
  }

  const taskId = taskRow.id;

  const technologies = (db.prepare(`
    SELECT name FROM task_technologies WHERE task_id = ? ORDER BY id ASC
  `).all(taskId) as { name: string }[]).map((r) => r.name);

  const skills = (db.prepare(`
    SELECT name FROM task_skills WHERE task_id = ? ORDER BY id ASC
  `).all(taskId) as { name: string }[]).map((r) => r.name);

  const requirements = db.prepare(`
    SELECT order_num as "order", content FROM task_requirements WHERE task_id = ? ORDER BY order_num ASC
  `).all(taskId) as { order: number; content: string }[];

  const constraints = db.prepare(`
    SELECT order_num as "order", content FROM task_constraints WHERE task_id = ? ORDER BY order_num ASC
  `).all(taskId) as { order: number; content: string }[];

  const evaluationCriteria = db.prepare(`
    SELECT order_num as "order", criterion FROM task_evaluations WHERE task_id = ? ORDER BY order_num ASC
  `).all(taskId) as { order: number; criterion: string }[];

  // Dynamically query 3 to 4 related tasks based on category and shared skills
  const relatedRows = db.prepare(`
    SELECT DISTINCT
      t.id,
      t.slug,
      t.title,
      t.short_description as shortDescription,
      t.category,
      t.difficulty,
      t.status,
      t.estimated_time as estimatedTime,
      t.featured,
      t.participants
    FROM tasks t
    WHERE t.id != ?
      AND (
        t.category = ?
        OR EXISTS (
          SELECT 1 FROM task_technologies tt
          JOIN task_technologies tt2 ON tt.name = tt2.name
          WHERE tt.task_id = t.id AND tt2.task_id = ?
        )
      )
    ORDER BY 
      CASE WHEN t.category = ? THEN 1 ELSE 2 END,
      t.participants DESC
    LIMIT 4
  `).all(taskId, taskRow.category, taskId, taskRow.category) as RawTaskRow[];

  // Batch fetch related task technologies and skills (Zero N+1)
  const relatedTasks: TaskSummary[] = [];
  if (relatedRows.length > 0) {
    const relIds = relatedRows.map((r) => r.id);
    const relPlaceholders = relIds.map(() => '?').join(',');

    const relTechs = (db.prepare(`
      SELECT task_id, name FROM task_technologies WHERE task_id IN (${relPlaceholders})
    `).all(...relIds) as { task_id: string; name: string }[]);

    const relSkills = (db.prepare(`
      SELECT task_id, name FROM task_skills WHERE task_id IN (${relPlaceholders})
    `).all(...relIds) as { task_id: string; name: string }[]);

    const relTechMap = new Map<string, string[]>();
    const relSkillMap = new Map<string, string[]>();

    for (const t of relTechs) {
      if (!relTechMap.has(t.task_id)) relTechMap.set(t.task_id, []);
      relTechMap.get(t.task_id)!.push(t.name);
    }
    for (const s of relSkills) {
      if (!relSkillMap.has(s.task_id)) relSkillMap.set(s.task_id, []);
      relSkillMap.get(s.task_id)!.push(s.name);
    }

    for (const rel of relatedRows) {
      relatedTasks.push({
        id: rel.id,
        slug: rel.slug,
        title: rel.title,
        shortDescription: rel.shortDescription,
        category: rel.category,
        difficulty: rel.difficulty,
        status: rel.status,
        estimatedTime: rel.estimatedTime,
        featured: Boolean(rel.featured),
        participants: rel.participants,
        technologies: relTechMap.get(rel.id) || [],
        skills: relSkillMap.get(rel.id) || []
      });
    }
  }

  const record: TaskRecord = {
    id: taskRow.id,
    slug: taskRow.slug,
    title: taskRow.title,
    shortDescription: taskRow.shortDescription,
    description: taskRow.description,
    category: taskRow.category,
    difficulty: taskRow.difficulty,
    status: taskRow.status,
    estimatedTime: taskRow.estimatedTime,
    featured: Boolean(taskRow.featured),
    participants: taskRow.participants,
    popularity: taskRow.popularity,
    expectedOutcome: taskRow.expectedOutcome,
    createdAt: taskRow.createdAt,
    updatedAt: taskRow.updatedAt,
    technologies,
    skills,
    requirements,
    constraints,
    evaluationCriteria,
    relatedTasks
  };

  taskDetailCache.set(cleanSlug, { data: record, expiresAt: now + 30000 });
  return record;
}

export function getCategories(): { name: string; count: number }[] {
  const now = Date.now();
  if (categoriesCache && categoriesCache.expiresAt > now) {
    return categoriesCache.data;
  }

  const db = getDb();
  const data = db.prepare(`
    SELECT category as name, COUNT(*) as count
    FROM tasks
    GROUP BY category
    ORDER BY count DESC, category ASC
  `).all() as { name: string; count: number }[];

  categoriesCache = { data, expiresAt: now + 60000 };
  return data;
}

export function getStats() {
  const now = Date.now();
  if (statsCache && statsCache.expiresAt > now) {
    return statsCache.data;
  }

  const db = getDb();

  const row = db.prepare(`
    SELECT 
      COUNT(*) as totalTasks,
      COUNT(DISTINCT category) as totalCategories,
      COALESCE(SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END), 0) as featuredTasks,
      COALESCE(SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END), 0) as activeTasks
    FROM tasks
  `).get() as {
    totalTasks: number;
    totalCategories: number;
    featuredTasks: number;
    activeTasks: number;
  };

  const stats = {
    totalTasks: row.totalTasks,
    totalCategories: row.totalCategories,
    featuredTasks: row.featuredTasks,
    activeTasks: row.activeTasks
  };

  statsCache = { data: stats, expiresAt: now + 30000 };
  return stats;
}

interface RawAssignmentRow {
  id: string;
  task_id: string;
  task_slug: string;
  user_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
  notes: string | null;
}

function mapAssignmentRow(row: RawAssignmentRow): TaskAssignment {
  return {
    id: row.id,
    taskId: row.task_id,
    taskSlug: row.task_slug,
    userId: row.user_id,
    status: row.status as AssignmentStatus,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
    notes: row.notes
  };
}

export function getAssignment(taskId: string, userId: string): TaskAssignment | null {
  if (!taskId || !userId) return null;
  const db = getDb();
  const row = db.prepare(`
    SELECT id, task_id, task_slug, user_id, status, started_at, completed_at, updated_at, notes
    FROM task_assignments
    WHERE task_id = ? AND user_id = ?
  `).get(taskId, userId) as RawAssignmentRow | undefined;
  return row ? mapAssignmentRow(row) : null;
}

export function getAssignmentBySlug(taskSlug: string, userId?: string): TaskAssignment | null {
  if (!taskSlug) return null;
  const db = getDb();
  const cleanSlug = taskSlug.trim().toLowerCase();

  if (userId) {
    const row = db.prepare(`
      SELECT id, task_id, task_slug, user_id, status, started_at, completed_at, updated_at, notes
      FROM task_assignments
      WHERE LOWER(task_slug) = ? AND user_id = ?
    `).get(cleanSlug, userId) as RawAssignmentRow | undefined;
    if (row) return mapAssignmentRow(row);
  }

  // Cross-origin / multi-device demo sync fallback:
  // If no specific user assignment matches (e.g. user visits via 10.218.158.209 after starting on localhost),
  // retrieve the active assignment for this task so progress is synchronized.
  const fallbackRow = db.prepare(`
    SELECT id, task_id, task_slug, user_id, status, started_at, completed_at, updated_at, notes
    FROM task_assignments
    WHERE LOWER(task_slug) = ?
    ORDER BY started_at DESC
    LIMIT 1
  `).get(cleanSlug) as RawAssignmentRow | undefined;

  return fallbackRow ? mapAssignmentRow(fallbackRow) : null;
}

export function startTask(slug: string, userId: string = 'demo_user_01') {
  const db = getDb();
  const cleanSlug = slug.trim().toLowerCase();

  const task = db.prepare('SELECT id, slug, participants FROM tasks WHERE LOWER(slug) = ?').get(cleanSlug) as
    | { id: string; slug: string; participants: number }
    | undefined;
  if (!task) {
    return null;
  }

  // Check if assignment already exists for this user and task
  const existing = getAssignment(task.id, userId);
  if (existing) {
    return {
      taskId: task.id,
      slug: task.slug,
      participants: task.participants,
      startedAt: existing.startedAt,
      assignment: existing,
      isExisting: true
    };
  }

  const now = new Date().toISOString();
  const assignmentId = 'asgn_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

  const executeStart = db.transaction(() => {
    db.prepare(`
      INSERT INTO task_assignments (id, task_id, task_slug, user_id, status, started_at, updated_at)
      VALUES (?, ?, ?, ?, 'IN_PROGRESS', ?, ?)
    `).run(assignmentId, task.id, task.slug, userId, now, now);

    db.prepare(`
      INSERT INTO task_participations (task_id, user_id, started_at)
      VALUES (?, ?, ?)
    `).run(task.id, userId, now);

    db.prepare(`
      UPDATE tasks 
      SET participants = participants + 1, updated_at = ?
      WHERE id = ?
    `).run(now, task.id);

    return db.prepare('SELECT participants FROM tasks WHERE id = ?').get(task.id) as { participants: number };
  });

  const result = executeStart();

  // Invalidate in-memory caches
  statsCache = null;
  taskDetailCache.delete(cleanSlug);

  const newAssignment: TaskAssignment = {
    id: assignmentId,
    taskId: task.id,
    taskSlug: task.slug,
    userId,
    status: 'IN_PROGRESS',
    startedAt: now,
    completedAt: null,
    updatedAt: now,
    notes: null
  };

  return {
    taskId: task.id,
    slug: task.slug,
    participants: result.participants,
    startedAt: now,
    assignment: newAssignment,
    isExisting: false
  };
}

export function completeTask(taskSlug: string, userId: string, notes?: string): TaskAssignment | null {
  if (!taskSlug || !userId) return null;
  const db = getDb();
  const cleanSlug = taskSlug.trim().toLowerCase();
  const now = new Date().toISOString();

  const updateStmt = db.prepare(`
    UPDATE task_assignments
    SET status = 'COMPLETED', completed_at = ?, updated_at = ?, notes = COALESCE(?, notes)
    WHERE LOWER(task_slug) = ? AND user_id = ?
  `);
  const result = updateStmt.run(now, now, notes || null, cleanSlug, userId);
  if (result.changes === 0) {
    const task = db.prepare('SELECT id, slug FROM tasks WHERE LOWER(slug) = ?').get(cleanSlug) as
      | { id: string; slug: string }
      | undefined;
    if (!task) return null;

    const assignmentId = 'asgn_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    db.prepare(`
      INSERT OR REPLACE INTO task_assignments (id, task_id, task_slug, user_id, status, started_at, completed_at, updated_at, notes)
      VALUES (?, ?, ?, ?, 'COMPLETED', ?, ?, ?, ?)
    `).run(assignmentId, task.id, task.slug, userId, now, now, now, notes || null);
  }

  return getAssignmentBySlug(taskSlug, userId);
}

export function updateAssignmentNotes(taskSlug: string, userId: string, notes: string): TaskAssignment | null {
  if (!taskSlug || !userId) return null;
  const db = getDb();
  const cleanSlug = taskSlug.trim().toLowerCase();
  const now = new Date().toISOString();

  const updateStmt = db.prepare(`
    UPDATE task_assignments
    SET notes = ?, updated_at = ?
    WHERE LOWER(task_slug) = ? AND user_id = ?
  `);
  updateStmt.run(notes, now, cleanSlug, userId);
  return getAssignmentBySlug(taskSlug, userId);
}
