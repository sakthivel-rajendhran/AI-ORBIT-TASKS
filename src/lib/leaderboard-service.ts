import { getDb } from './db';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  badge?: string;
  category: string;
  tasksCompleted: number;
  score: number;
  successRate: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface GetLeaderboardParams {
  period?: 'all-time' | 'month' | 'week';
  category?: string;
  sort?: 'score' | 'tasks' | 'success_rate';
  page?: number;
  limit?: number;
  userId?: string;
}

export interface LeaderboardResult {
  users: LeaderboardEntry[];
  podium: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
  stats: {
    totalParticipants: number;
    totalChallenges: number;
    totalCategories: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const SEED_LEADERBOARD_USERS = [
  {
    id: 'usr_01',
    name: 'Elena Rostova',
    username: 'elena_ai',
    badge: 'Grandmaster',
    category: 'AI Agents',
    tasksCompleted: 24,
    totalAttempts: 25,
    score: 2450,
    successRate: 96,
    streakDays: 14,
    weeklyScore: 420,
    monthlyScore: 1280
  },
  {
    id: 'usr_02',
    name: 'Marcus Chen',
    username: 'marcus_nlp',
    badge: 'Agent Architect',
    category: 'Natural Language Processing',
    tasksCompleted: 21,
    totalAttempts: 23,
    score: 2180,
    successRate: 91,
    streakDays: 11,
    weeklyScore: 380,
    monthlyScore: 1150
  },
  {
    id: 'usr_03',
    name: 'Sophia Vance',
    username: 'sophia_genai',
    badge: 'LLM Pioneer',
    category: 'Generative AI',
    tasksCompleted: 19,
    totalAttempts: 20,
    score: 1950,
    successRate: 95,
    streakDays: 9,
    weeklyScore: 350,
    monthlyScore: 1020
  },
  {
    id: 'usr_04',
    name: 'Alex Kumar',
    username: 'alex_k',
    badge: 'Vector Specialist',
    category: 'Data Science',
    tasksCompleted: 18,
    totalAttempts: 20,
    score: 1720,
    successRate: 90,
    streakDays: 7,
    weeklyScore: 310,
    monthlyScore: 890
  },
  {
    id: 'usr_05',
    name: 'Priya Sharma',
    username: 'priya_vision',
    badge: 'Vision Expert',
    category: 'Computer Vision',
    tasksCompleted: 17,
    totalAttempts: 18,
    score: 1680,
    successRate: 94,
    streakDays: 6,
    weeklyScore: 290,
    monthlyScore: 840
  },
  {
    id: 'usr_06',
    name: 'Rahul Mehta',
    username: 'rahul_m',
    badge: 'ML Engineer',
    category: 'Machine Learning',
    tasksCompleted: 16,
    totalAttempts: 19,
    score: 1590,
    successRate: 84,
    streakDays: 5,
    weeklyScore: 260,
    monthlyScore: 780
  },
  {
    id: 'usr_07',
    name: 'David Kim',
    username: 'dkim_robotics',
    badge: 'Robotics Core',
    category: 'Robotics',
    tasksCompleted: 15,
    totalAttempts: 16,
    score: 1520,
    successRate: 93,
    streakDays: 8,
    weeklyScore: 240,
    monthlyScore: 760
  },
  {
    id: 'usr_08',
    name: 'Amara Okafor',
    username: 'amara_ops',
    badge: 'AI Engineer',
    category: 'AI Engineering',
    tasksCompleted: 15,
    totalAttempts: 17,
    score: 1480,
    successRate: 88,
    streakDays: 4,
    weeklyScore: 220,
    monthlyScore: 710
  },
  {
    id: 'usr_09',
    name: 'Lucas Dupont',
    username: 'lucas_auto',
    badge: 'Automation Lead',
    category: 'Automation',
    tasksCompleted: 14,
    totalAttempts: 15,
    score: 1390,
    successRate: 93,
    streakDays: 5,
    weeklyScore: 210,
    monthlyScore: 680
  },
  {
    id: 'usr_10',
    name: 'Sarah Jenkins',
    username: 'sarah_rag',
    badge: 'RAG Master',
    category: 'AI Agents',
    tasksCompleted: 14,
    totalAttempts: 16,
    score: 1350,
    successRate: 87,
    streakDays: 6,
    weeklyScore: 190,
    monthlyScore: 650
  },
  {
    id: 'usr_11',
    name: 'Vikram Patel',
    username: 'vikram_p',
    badge: 'Model Tuner',
    category: 'Machine Learning',
    tasksCompleted: 13,
    totalAttempts: 14,
    score: 1290,
    successRate: 92,
    streakDays: 3,
    weeklyScore: 180,
    monthlyScore: 620
  },
  {
    id: 'usr_12',
    name: 'Camila Rodriguez',
    username: 'camila_ai',
    badge: 'NLP Researcher',
    category: 'Natural Language Processing',
    tasksCompleted: 13,
    totalAttempts: 15,
    score: 1250,
    successRate: 86,
    streakDays: 4,
    weeklyScore: 170,
    monthlyScore: 590
  },
  {
    id: 'usr_13',
    name: 'Felix Weber',
    username: 'felix_cv',
    badge: 'Neural Builder',
    category: 'Computer Vision',
    tasksCompleted: 12,
    totalAttempts: 13,
    score: 1190,
    successRate: 92,
    streakDays: 5,
    weeklyScore: 160,
    monthlyScore: 560
  },
  {
    id: 'usr_14',
    name: 'Zainab Al-Mansoor',
    username: 'zainab_ds',
    badge: 'Data Scientist',
    category: 'Data Science',
    tasksCompleted: 12,
    totalAttempts: 14,
    score: 1140,
    successRate: 85,
    streakDays: 3,
    weeklyScore: 150,
    monthlyScore: 530
  },
  {
    id: 'usr_15',
    name: 'Oliver Hansen',
    username: 'oliver_eng',
    badge: 'Prompt Specialist',
    category: 'AI Engineering',
    tasksCompleted: 11,
    totalAttempts: 12,
    score: 1080,
    successRate: 91,
    streakDays: 4,
    weeklyScore: 140,
    monthlyScore: 500
  },
  {
    id: 'usr_16',
    name: 'Maya Lin',
    username: 'maya_gen',
    badge: 'Diffusion Pioneer',
    category: 'Generative AI',
    tasksCompleted: 11,
    totalAttempts: 13,
    score: 1040,
    successRate: 84,
    streakDays: 2,
    weeklyScore: 130,
    monthlyScore: 480
  },
  {
    id: 'usr_17',
    name: 'Tariq Hassan',
    username: 'tariq_bot',
    badge: 'Swarm Dev',
    category: 'AI Agents',
    tasksCompleted: 10,
    totalAttempts: 11,
    score: 990,
    successRate: 90,
    streakDays: 3,
    weeklyScore: 120,
    monthlyScore: 450
  },
  {
    id: 'usr_18',
    name: 'Anya Ivanova',
    username: 'anya_robot',
    badge: 'Kinematics Lead',
    category: 'Robotics',
    tasksCompleted: 10,
    totalAttempts: 12,
    score: 950,
    successRate: 83,
    streakDays: 2,
    weeklyScore: 110,
    monthlyScore: 420
  },
  {
    id: 'usr_19',
    name: 'Jason Scott',
    username: 'jason_auto',
    badge: 'Workflow Pro',
    category: 'Automation',
    tasksCompleted: 9,
    totalAttempts: 10,
    score: 890,
    successRate: 90,
    streakDays: 3,
    weeklyScore: 100,
    monthlyScore: 390
  },
  {
    id: 'usr_20',
    name: 'Kavita Reddy',
    username: 'kavita_r',
    badge: 'Speech Alchemist',
    category: 'Natural Language Processing',
    tasksCompleted: 9,
    totalAttempts: 11,
    score: 850,
    successRate: 81,
    streakDays: 2,
    weeklyScore: 90,
    monthlyScore: 370
  },
  {
    id: 'usr_21',
    name: 'Benjamin Cole',
    username: 'ben_cole',
    badge: 'PyTorch Dev',
    category: 'Machine Learning',
    tasksCompleted: 8,
    totalAttempts: 9,
    score: 790,
    successRate: 88,
    streakDays: 2,
    weeklyScore: 80,
    monthlyScore: 340
  },
  {
    id: 'usr_22',
    name: 'Nadia Larsson',
    username: 'nadia_cv',
    badge: 'Detection Eng',
    category: 'Computer Vision',
    tasksCompleted: 8,
    totalAttempts: 10,
    score: 740,
    successRate: 80,
    streakDays: 1,
    weeklyScore: 70,
    monthlyScore: 310
  },
  {
    id: 'usr_23',
    name: 'Kenji Sato',
    username: 'kenji_s',
    badge: 'Data Strategist',
    category: 'Data Science',
    tasksCompleted: 7,
    totalAttempts: 8,
    score: 680,
    successRate: 87,
    streakDays: 2,
    weeklyScore: 60,
    monthlyScore: 280
  },
  {
    id: 'usr_24',
    name: 'Chloe Tremblay',
    username: 'chloe_t',
    badge: 'Agent Tester',
    category: 'AI Agents',
    tasksCompleted: 7,
    totalAttempts: 9,
    score: 630,
    successRate: 77,
    streakDays: 1,
    weeklyScore: 50,
    monthlyScore: 250
  },
  {
    id: 'usr_25',
    name: 'Liam Gallagher',
    username: 'liam_g',
    badge: 'Inference Specialist',
    category: 'AI Engineering',
    tasksCompleted: 6,
    totalAttempts: 7,
    score: 570,
    successRate: 85,
    streakDays: 1,
    weeklyScore: 40,
    monthlyScore: 220
  }
];

function ensureLeaderboardSeeded() {
  const db = getDb();

  db.exec(`
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

  const countRow = db.prepare('SELECT COUNT(*) as count FROM leaderboard_users').get() as { count: number };
  if (countRow && countRow.count >= SEED_LEADERBOARD_USERS.length) {
    return;
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO leaderboard_users (
      id, name, username, avatar_url, badge, category,
      tasks_completed, total_attempts, score, success_rate,
      streak_days, weekly_score, monthly_score, created_at
    ) VALUES (
      @id, @name, @username, @avatarUrl, @badge, @category,
      @tasksCompleted, @totalAttempts, @score, @successRate,
      @streakDays, @weeklyScore, @monthlyScore, datetime('now', '-30 days')
    )
  `);

  const insertMany = db.transaction((users) => {
    for (const u of users) {
      insert.run({
        ...u,
        avatarUrl: u.avatarUrl || null
      });
    }
  });

  insertMany(SEED_LEADERBOARD_USERS);
}

export function getLeaderboard(params: GetLeaderboardParams = {}): LeaderboardResult {
  const db = getDb();
  ensureLeaderboardSeeded();

  const period = params.period || 'all-time';
  const category = params.category && params.category !== 'All' ? params.category : undefined;
  const sort = params.sort || 'score';
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(params.limit) || 20));

  // Determine scoring column based on period
  let scoreColumn = 'u.score';
  if (period === 'month') scoreColumn = 'u.monthly_score';
  if (period === 'week') scoreColumn = 'u.weekly_score';

  // Determine order by based on sort parameter
  let orderBy = `${scoreColumn} DESC, u.tasks_completed DESC`;
  if (sort === 'tasks') {
    orderBy = `u.tasks_completed DESC, ${scoreColumn} DESC`;
  } else if (sort === 'success_rate') {
    orderBy = `u.success_rate DESC, ${scoreColumn} DESC`;
  }

  const whereClauses: string[] = [];
  const bindings: Record<string, string | number> = {};

  if (category) {
    whereClauses.push('LOWER(u.category) = LOWER(@category)');
    bindings.category = category;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total users matching criteria
  const totalRow = db.prepare(`SELECT COUNT(*) as total FROM leaderboard_users u ${whereSql}`).get(bindings) as { total: number };
  const total = totalRow?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;

  // Query users with dense ranking
  const querySql = `
    SELECT 
      u.id, u.name, u.username, u.avatar_url as avatarUrl, u.badge, u.category,
      u.tasks_completed as tasksCompleted,
      ${scoreColumn} as score,
      u.success_rate as successRate,
      u.streak_days as streakDays
    FROM leaderboard_users u
    ${whereSql}
    ORDER BY ${orderBy}
  `;

  const allFilteredRows = db.prepare(querySql).all(bindings) as Array<Omit<LeaderboardEntry, 'rank'>>;

  // Build ranked entries
  const allRankedEntries: LeaderboardEntry[] = allFilteredRows.map((row, index) => ({
    ...row,
    rank: index + 1
  }));

  // Top 3 Podium is always top 3 from allRankedEntries
  const podium = allRankedEntries.slice(0, 3);

  // Paginated items
  const paginatedUsers = allRankedEntries.slice(offset, offset + limit);

  // Real user session resolution if userId provided
  let currentUser: LeaderboardEntry | null = null;
  if (params.userId) {
    // Check if session user has completed assignments in SQLite
    const userAssignments = db.prepare(`
      SELECT a.status, t.difficulty, t.category
      FROM task_assignments a
      JOIN tasks t ON t.id = a.task_id
      WHERE a.user_id = ?
    `).all(params.userId) as Array<{ status: string; difficulty: string; category: string }>;

    if (userAssignments.length > 0) {
      const completed = userAssignments.filter(a => a.status === 'COMPLETED');
      const totalAttempts = userAssignments.length;
      const tasksCompleted = completed.length;

      // Base 100 pts per completion + difficulty multiplier
      let calculatedScore = 0;
      for (const a of completed) {
        let diffBonus = 50;
        if (a.difficulty === 'Intermediate') diffBonus = 100;
        if (a.difficulty === 'Advanced') diffBonus = 150;
        if (a.difficulty === 'Expert') diffBonus = 200;
        calculatedScore += 100 + diffBonus;
      }

      const successRate = totalAttempts > 0 ? Math.round((tasksCompleted / totalAttempts) * 100) : 0;
      const userRank = allRankedEntries.filter(u => u.score > calculatedScore).length + 1;

      currentUser = {
        rank: userRank,
        id: params.userId,
        name: 'You (Current Session)',
        username: `user_${params.userId.slice(-6)}`,
        badge: tasksCompleted >= 5 ? 'Rising Contender' : 'Participant',
        category: completed[0]?.category || 'General AI',
        tasksCompleted,
        score: calculatedScore,
        successRate,
        streakDays: tasksCompleted > 0 ? 1 : 0,
        isCurrentUser: true
      };
    }
  }

  // Aggregate stats
  const participantsRow = db.prepare(`
    SELECT SUM(participants) as totalParticipants FROM tasks
  `).get() as { totalParticipants: number };
  const categoriesRow = db.prepare(`
    SELECT COUNT(DISTINCT category) as totalCategories FROM tasks
  `).get() as { totalCategories: number };
  const tasksCountRow = db.prepare(`
    SELECT COUNT(*) as totalTasks FROM tasks
  `).get() as { totalTasks: number };

  return {
    users: paginatedUsers,
    podium,
    currentUser,
    stats: {
      totalParticipants: participantsRow?.totalParticipants || 1245,
      totalChallenges: tasksCountRow?.totalTasks || 26,
      totalCategories: categoriesRow?.totalCategories || 9
    },
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}
