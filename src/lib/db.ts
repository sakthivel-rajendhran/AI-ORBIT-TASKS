import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance: Database.Database | null = null;

export interface TaskRecord {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: string;
  status: string;
  estimatedTime: string;
  featured: boolean;
  participants: number;
  popularity: string;
  expectedOutcome: string;
  createdAt: string;
  updatedAt: string;
  technologies: string[];
  skills: string[];
  requirements?: { order: number; content: string }[];
  constraints?: { order: number; content: string }[];
  evaluationCriteria?: { order: number; criterion: string }[];
  relatedTasks?: TaskSummary[];
}

export type AssignmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface TaskAssignment {
  id: string;
  taskId: string;
  taskSlug: string;
  userId: string;
  status: AssignmentStatus;
  startedAt: string;
  completedAt?: string | null;
  updatedAt: string;
  notes?: string | null;
}

export interface TaskSummary {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  status: string;
  estimatedTime: string;
  featured: boolean;
  participants: number;
  technologies: string[];
  skills: string[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  badge?: string;
  category: string;
  tasksCompleted: number;
  totalAttempts: number;
  score: number;
  successRate: number;
  streakDays: number;
  weeklyScore: number;
  monthlyScore: number;
  createdAt: string;
}

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'tasks.db');
  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  initSchema(dbInstance);

  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      status TEXT NOT NULL,
      estimated_time TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      participants INTEGER NOT NULL DEFAULT 0,
      popularity TEXT NOT NULL DEFAULT 'Medium',
      expected_outcome TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_technologies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      order_num INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_constraints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      order_num INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      criterion TEXT NOT NULL,
      order_num INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_participations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      started_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_assignments (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      task_slug TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
      started_at TEXT NOT NULL,
      completed_at TEXT,
      updated_at TEXT NOT NULL,
      notes TEXT,
      UNIQUE(task_id, user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_slug ON tasks(slug);
    CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
    CREATE INDEX IF NOT EXISTS idx_tasks_difficulty ON tasks(difficulty);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_featured ON tasks(featured);
    CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tasks_participants ON tasks(participants DESC);
    CREATE INDEX IF NOT EXISTS idx_tasks_featured_created ON tasks(featured DESC, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tasks_cat_diff ON tasks(category, difficulty);
    CREATE INDEX IF NOT EXISTS idx_task_tech_task_id ON task_technologies(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_tech_name ON task_technologies(name);
    CREATE INDEX IF NOT EXISTS idx_task_skills_task_id ON task_skills(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_skills_name ON task_skills(name);
    CREATE INDEX IF NOT EXISTS idx_task_req_task_id ON task_requirements(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_const_task_id ON task_constraints(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_eval_task_id ON task_evaluations(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_part_task_id ON task_participations(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_assign_task_id ON task_assignments(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_assign_user_id ON task_assignments(user_id);
    CREATE INDEX IF NOT EXISTS idx_task_assign_task_slug ON task_assignments(task_slug);
    CREATE INDEX IF NOT EXISTS idx_task_assign_status ON task_assignments(status);

    CREATE TABLE IF NOT EXISTS leaderboard_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      badge TEXT,
      category TEXT NOT NULL,
      tasks_completed INTEGER NOT NULL DEFAULT 0,
      total_attempts INTEGER NOT NULL DEFAULT 0,
      score INTEGER NOT NULL DEFAULT 0,
      success_rate INTEGER NOT NULL DEFAULT 0,
      streak_days INTEGER NOT NULL DEFAULT 0,
      weekly_score INTEGER NOT NULL DEFAULT 0,
      monthly_score INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_lb_users_score ON leaderboard_users(score DESC);
    CREATE INDEX IF NOT EXISTS idx_lb_users_category ON leaderboard_users(category);
    CREATE INDEX IF NOT EXISTS idx_lb_users_monthly ON leaderboard_users(monthly_score DESC);
    CREATE INDEX IF NOT EXISTS idx_lb_users_weekly ON leaderboard_users(weekly_score DESC);
    CREATE INDEX IF NOT EXISTS idx_lb_users_tasks ON leaderboard_users(tasks_completed DESC);
  `);
}
