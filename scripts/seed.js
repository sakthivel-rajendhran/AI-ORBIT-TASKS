const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tasks.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Ensure tables exist
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
`);

const tasks = [
  {
    id: "task_01",
    slug: "ai-customer-support-agent",
    title: "AI Customer Support Agent",
    shortDescription: "Build an autonomous customer support agent capable of multi-turn conversational troubleshooting and CRM ticket routing.",
    description: "Develop a production-ready conversational support assistant that can intake natural customer inquiries, retrieve relevant policy articles from a knowledge store, diagnose technical problems through multi-turn questions, and cleanly route unresolved tickets into a support desk queue with comprehensive context summaries.",
    category: "AI Agents",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "4–6 hours",
    featured: true,
    participants: 184,
    popularity: "High",
    expectedOutcome: "A functional, testable conversational agent with simulated ticketing webhooks, streaming dialogue, and deterministic sentiment-triggered human handoff.",
    technologies: ["Python", "FastAPI", "OpenAI", "LangChain", "LLM"],
    skills: ["Prompt Engineering", "API Integration", "State Management", "Conversation Design"],
    requirements: [
      { order: 1, content: "Accept customer inquiries through real-time streaming chat interface." },
      { order: 2, content: "Classify incoming intent and verify account tier from mock customer records." },
      { order: 3, content: "Query embedded policy documentation to answer standard support questions accurately." },
      { order: 4, content: "Maintain conversation session memory across at least 10 sequential turns." },
      { order: 5, content: "Trigger escalation webhook with structured incident summary when confidence score drops below 0.70." }
    ],
    constraints: [
      { order: 1, content: "API latency must remain under 1200ms per generated token chunk." },
      { order: 2, content: "API credentials and backend secrets must never be exposed to the client application." },
      { order: 3, content: "Personally Identifiable Information (PII) like phone numbers and credit cards must be masked before model submission." },
      { order: 4, content: "Must implement graceful fallback messaging when LLM gateway encounters rate limits." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Intent classification accuracy across common support queries." },
      { order: 2, criterion: "Robustness of escalation triggering on complex technical inquiries." },
      { order: 3, criterion: "Session state persistence across disconnects and browser reloads." },
      { order: 4, criterion: "Cleanliness of modular architectural boundaries between service layers." }
    ]
  },
  {
    id: "task_02",
    slug: "rag-knowledge-assistant",
    title: "RAG Knowledge Assistant",
    shortDescription: "Construct a high-precision retrieval-augmented generation engine over unstructured engineering documentation.",
    description: "Design and implement a semantic search and question-answering system over a corpus of engineering specifications and API manuals. The system must chunk documents intelligently, store vector embeddings, perform hybrid lexical and semantic search, and synthesize accurate answers with clickable markdown citations.",
    category: "Generative AI",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "5–8 hours",
    featured: true,
    participants: 242,
    popularity: "Very High",
    expectedOutcome: "An enterprise RAG API that outputs grounded answers with exact source chunk references and confidence scores.",
    technologies: ["Python", "OpenAI", "LangChain", "Qdrant", "LLM"],
    skills: ["Vector Databases", "Chunking Strategies", "Semantic Search", "Prompt Engineering"],
    requirements: [
      { order: 1, content: "Ingest Markdown and PDF specification documents and generate hierarchical chunks with metadata." },
      { order: 2, content: "Generate dense embeddings using text-embedding-3-small or open-source BGE models." },
      { order: 3, content: "Implement hybrid retrieval combining BM25 keyword matching with dense vector similarity." },
      { order: 4, content: "Synthesize concise answers quoting specific document sections and line ranges." },
      { order: 5, content: "Return explicit 'Information not found' fallback when similarity threshold is under 0.65." }
    ],
    constraints: [
      { order: 1, content: "Vector retrieval stage must complete in under 200ms for collections up to 50,000 chunks." },
      { order: 2, content: "Ground truth citation must be verified before presenting answers to prevent hallucination." },
      { order: 3, content: "All chunking operations must preserve section header hierarchy." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Retrieval recall at rank 5 on technical test benchmark questions." },
      { order: 2, criterion: "Faithfulness of generated summaries to the retrieved context chunks." },
      { order: 3, criterion: "Handling of ambiguous or out-of-domain knowledge queries." },
      { order: 4, criterion: "Vector database indexing efficiency and query latency." }
    ]
  },
  {
    id: "task_03",
    slug: "document-intelligence-pipeline",
    title: "Document Intelligence Pipeline",
    shortDescription: "Build a multimodal OCR and layout-aware document parser for automated financial invoice processing.",
    description: "Construct an automated ingestion and document processing pipeline that extracts key-value pairs, nested tables, and line items from scanned PDF receipts and invoices. Integrate optical character recognition with layout-aware language models to output standardized JSON schema representations.",
    category: "Computer Vision",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "8–12 hours",
    featured: false,
    participants: 97,
    popularity: "High",
    expectedOutcome: "A microservice that accepts invoice scans, accurately identifies tabular billing line-items, and outputs schema-validated JSON records.",
    technologies: ["Python", "PyTorch", "OpenCV", "FastAPI"],
    skills: ["Multimodal Models", "OCR Systems", "Computer Vision", "Schema Validation"],
    requirements: [
      { order: 1, content: "Accept PDF and high-resolution image uploads with automated deskewing and preprocessing." },
      { order: 2, content: "Detect tabular boundaries and extract column headers alongside row cells." },
      { order: 3, content: "Extract vendor names, tax identification numbers, total amounts, and due dates." },
      { order: 4, content: "Validate mathematical consistency (e.g. subtotal + tax = total amount)." },
      { order: 5, content: "Flag anomalies or unreadable fields for human verification review." }
    ],
    constraints: [
      { order: 1, content: "Must support multi-page invoices with spanning tables across page boundaries." },
      { order: 2, content: "Must achieve at least 95% field extraction accuracy on standard invoice formats." },
      { order: 3, content: "Document processing time must not exceed 5 seconds per page." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Precision and recall of extracted financial line items." },
      { order: 2, criterion: "Resilience against varied invoice formats and noisy scans." },
      { order: 3, criterion: "Cleanliness of data transformation and JSON validation." },
      { order: 4, criterion: "Error handling on corrupt or non-document file uploads." }
    ]
  },
  {
    id: "task_04",
    slug: "multi-agent-research-workflow",
    title: "Multi-Agent Research Workflow",
    shortDescription: "Orchestrate specialized AI agents to autonomously plan, browse, synthesize, and critique deep tech research reports.",
    description: "Create an autonomous multi-agent team composed of a Lead Planner, Web Search Researcher, Data Analyst, Fact-Checking Critic, and Technical Writer. Given a complex prompt, the agents must collaborate, cross-verify source citations, draft comprehensive sections, and compile a publication-grade markdown whitepaper.",
    category: "AI Agents",
    difficulty: "Expert",
    status: "Active",
    estimatedTime: "12–16 hours",
    featured: true,
    participants: 135,
    popularity: "Very High",
    expectedOutcome: "A distributed multi-agent coordinator capable of delivering 2,000+ word structured research papers with verified bibliography.",
    technologies: ["Python", "TypeScript", "LLM", "OpenAI"],
    skills: ["Agent Orchestration", "Async Programming", "Graph-Based Workflows", "Fact Verification"],
    requirements: [
      { order: 1, content: "Break high-level user research objectives into atomic research questions." },
      { order: 2, content: "Dispatch concurrent search agents with query refinement loops." },
      { order: 3, content: "Implement a critic agent that challenges speculative claims and checks source credibility." },
      { order: 4, content: "Synthesize findings into cohesive sections with executive summaries and future outlooks." },
      { order: 5, content: "Render final output into Markdown format with standardized bibliography entries." }
    ],
    constraints: [
      { order: 1, content: "Agents must operate under strict token and loop budgets to prevent infinite cycles." },
      { order: 2, content: "Inter-agent messages must adhere to strongly typed message envelope protocols." },
      { order: 3, content: "Support human-in-the-loop approval at the outline approval stage." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Coherence and technical depth of generated research reports." },
      { order: 2, criterion: "Effectiveness of critic feedback loops in correcting factual errors." },
      { order: 3, criterion: "Orchestration resilience when individual agent subtasks timeout." },
      { order: 4, criterion: "Code modularity and agent role extensibility." }
    ]
  },
  {
    id: "task_05",
    slug: "object-detection-dashboard",
    title: "Object Detection Dashboard",
    shortDescription: "Build an interactive real-time computer vision dashboard streaming inference over video feeds.",
    description: "Develop a full-stack real-time computer vision application that ingests video camera streams, executes YOLO or SSD object detection inference on the edge or server, and overlays bounding boxes, class labels, and tracking IDs onto a Next.js canvas interface with live throughput statistics.",
    category: "Computer Vision",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "6–9 hours",
    featured: false,
    participants: 112,
    popularity: "High",
    expectedOutcome: "A responsive web dashboard displaying live annotated video at 30+ FPS with target count analytics and alert thresholds.",
    technologies: ["TypeScript", "Next.js", "Python", "OpenCV", "React"],
    skills: ["WebSockets", "Canvas API", "Computer Vision", "Real-Time Streaming"],
    requirements: [
      { order: 1, content: "Establish bi-directional WebSocket connection streaming encoded video frames." },
      { order: 2, content: "Overlay dynamic bounding boxes, detection confidence, and tracking IDs." },
      { order: 3, content: "Provide interactive filters to toggle visible object categories in real-time." },
      { order: 4, content: "Track zone occupancy and trigger alert toasts when capacity limits are exceeded." },
      { order: 5, content: "Export temporal detection telemetry to CSV and JSON formats." }
    ],
    constraints: [
      { order: 1, content: "End-to-end glass-to-glass latency must not exceed 150ms over local networks." },
      { order: 2, content: "Frontend canvas rendering must sustain 60 FPS without dropping main-thread frames." },
      { order: 3, content: "Interface must remain fully responsive on mobile tablet and desktop viewports." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Smoothness and synchronization of video playback and bounding box layers." },
      { order: 2, criterion: "Accuracy of target tracking across temporary occlusion events." },
      { order: 3, criterion: "UI responsiveness and component hierarchy under high event frequency." },
      { order: 4, criterion: "WebSocket reconnection and error state resilience." }
    ]
  },
  {
    id: "task_06",
    slug: "ai-code-review-assistant",
    title: "AI Code Review Assistant",
    shortDescription: "Develop an automated pull request reviewer that flags security bugs, style flaws, and performance regressions.",
    description: "Build an automated code analysis engine that parses git diffs, extracts abstract syntax trees (AST), and employs language models to detect potential security vulnerabilities, race conditions, memory leaks, and anti-patterns with actionable inline code suggestions.",
    category: "AI Engineering",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "5–7 hours",
    featured: true,
    participants: 210,
    popularity: "Very High",
    expectedOutcome: "A CI/CD-compatible GitHub review bot that posts formatted inline comments with before-and-after diff snippets.",
    technologies: ["TypeScript", "LLM", "OpenAI", "Next.js"],
    skills: ["AST Analysis", "Git APIs", "Prompt Engineering", "Security Auditing"],
    requirements: [
      { order: 1, content: "Parse unified git diffs into structured per-file, per-hunk AST representations." },
      { order: 2, content: "Identify potential security issues such as SQL injection, XSS, and hardcoded secrets." },
      { order: 3, content: "Suggest optimized code refactoring snippets with precise line number anchors." },
      { order: 4, content: "Assign severity classifications (Critical, Warning, Optimization, Nitpick)." },
      { order: 5, content: "Generate an executive summary comment detailing overall PR risk profile." }
    ],
    constraints: [
      { order: 1, content: "Must ignore non-code assets, lockfiles, and minified bundles automatically." },
      { order: 2, content: "Review execution time must be under 30 seconds for PRs up to 500 lines of change." },
      { order: 3, content: "Must not post repetitive or superficial comments (e.g. trivial whitespace nits)." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Relevance and accuracy of identified bugs vs false positive rate." },
      { order: 2, criterion: "Clarity and correctness of recommended replacement code snippets." },
      { order: 3, criterion: "Robustness against diverse programming languages (TS, Python, Go)." },
      { order: 4, criterion: "Integration capability with standard webhooks and CLI tools." }
    ]
  },
  {
    id: "task_07",
    slug: "medical-image-classifier",
    title: "Medical Image Classifier",
    shortDescription: "Train and deploy a convolutional neural network to classify chest X-ray radiographs with Grad-CAM visual heatmaps.",
    description: "Develop a clinically oriented computer vision classifier that inspects DICOM/PNG chest X-rays to detect pathological findings such as pneumonia and cardiomegaly. Integrate Gradient-weighted Class Activation Mapping (Grad-CAM) to generate visual heatmaps explaining the model's diagnostic focus.",
    category: "Machine Learning",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "8–11 hours",
    featured: false,
    participants: 78,
    popularity: "Medium",
    expectedOutcome: "A containerized medical diagnosis API returning predicted disease probabilities and superimposed Grad-CAM visual explanations.",
    technologies: ["Python", "PyTorch", "FastAPI", "OpenCV"],
    skills: ["Deep Learning", "Convolutional Networks", "Explainable AI", "Model Quantization"],
    requirements: [
      { order: 1, content: "Preprocess radiological scans with histogram equalization and spatial normalization." },
      { order: 2, content: "Fine-tune a ResNet-50 or DenseNet-121 backbone using transfer learning techniques." },
      { order: 3, content: "Compute Grad-CAM activation maps corresponding to the final convolutional layer." },
      { order: 4, content: "Provide calibration curves showing probability alignment with clinical prevalence." },
      { order: 5, content: "Package model weights into an ONNX runtime container for rapid CPU inference." }
    ],
    constraints: [
      { order: 1, content: "Must display prominent non-diagnostic research disclaimer on all generated reports." },
      { order: 2, content: "Area Under ROC Curve (AUC-ROC) must exceed 0.88 on held-out evaluation dataset." },
      { order: 3, content: "Memory footprint must remain under 1.5 GB during batch inference execution." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Classification accuracy and sensitivity on minority pathological classes." },
      { order: 2, criterion: "Interpretability and anatomical accuracy of Grad-CAM heatmap overlays." },
      { order: 3, criterion: "Inference throughput and latency benchmarking." },
      { order: 4, criterion: "Data augmentation pipeline rigor and prevention of test set leakage." }
    ]
  },
  {
    id: "task_08",
    slug: "semantic-search-engine",
    title: "Semantic Search Engine",
    shortDescription: "Build a high-performance vector search engine indexing articles with hybrid dense-sparse scoring.",
    description: "Implement a full-text and semantic search microservice that indexes technical blog articles, handles cross-lingual queries, and ranks results using a blended reciprocity score combining BM25 keyword matching with dense sentence transformer embeddings.",
    category: "Data Science",
    difficulty: "Beginner",
    status: "Active",
    estimatedTime: "3–5 hours",
    featured: false,
    participants: 312,
    popularity: "High",
    expectedOutcome: "A standalone search API and client query bar with instant autocomplete, semantic match highlighting, and score breakdown.",
    technologies: ["Python", "FastAPI", "JavaScript", "TypeScript"],
    skills: ["Vector Search", "Information Retrieval", "Text Preprocessing", "API Design"],
    requirements: [
      { order: 1, content: "Create an inverted index for fast keyword lookups alongside a vector storage index." },
      { order: 2, content: "Implement Reciprocal Rank Fusion (RRF) to merge dense and sparse result rankings." },
      { order: 3, content: "Generate contextual keyword snippet highlights surrounding search terms." },
      { order: 4, content: "Support faceted filtering across categories, publish dates, and reading duration." },
      { order: 5, content: "Provide automated typo tolerance and query synonym expansion." }
    ],
    constraints: [
      { order: 1, content: "Query execution time must stay under 80ms for 100,000 indexed records." },
      { order: 2, content: "Zero external cloud dependencies; must run fully on local embedded storage." },
      { order: 3, content: "Index updates must be atomic and preserve search availability during writes." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Search relevance on semantic paraphrases with zero overlapping keywords." },
      { order: 2, criterion: "Query execution speed and memory efficiency under concurrent read loads." },
      { order: 3, criterion: "Clarity and completeness of REST API endpoints and swagger docs." },
      { order: 4, criterion: "Test coverage across edge queries (empty input, punctuation, special chars)." }
    ]
  },
  {
    id: "task_09",
    slug: "voice-ai-conversational-bot",
    title: "Voice AI Conversational Bot",
    shortDescription: "Construct an ultra-low latency voice-to-voice AI conversational pipeline with interruptibility support.",
    description: "Build an end-to-end voice assistant utilizing WebRTC audio streaming, streaming automatic speech recognition (Whisper), low-latency LLM completion, and streaming neural text-to-speech. Crucially, support natural barge-in (interruption) detection when the user speaks while the assistant is talking.",
    category: "Natural Language Processing",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "7–10 hours",
    featured: true,
    participants: 165,
    popularity: "High",
    expectedOutcome: "A working browser-to-server voice interface with sub-600ms turnaround latency and natural barge-in capability.",
    technologies: ["Python", "TypeScript", "React", "LLM", "OpenAI"],
    skills: ["Audio Streaming", "WebSockets", "Voice Activity Detection", "Low-Latency Systems"],
    requirements: [
      { order: 1, content: "Capture microphone audio via Web Audio API and stream PCM chunks to backend." },
      { order: 2, content: "Integrate Voice Activity Detection (VAD) to demarcate utterance start and end boundaries." },
      { order: 3, content: "Transcribe audio stream concurrently with token generation." },
      { order: 4, content: "Synthesize outgoing speech chunks in real-time and stream audio back to the client." },
      { order: 5, content: "Instantly cancel audio synthesis and flush buffers when user barge-in is detected." }
    ],
    constraints: [
      { order: 1, content: "End-to-end voice latency (user stops speaking to first sound playback) must be < 700ms." },
      { order: 2, content: "Audio buffering must prevent clipping and popping artifacts on variable network links." },
      { order: 3, content: "Browser microphone permissions must be requested with graceful permission denial states." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Responsiveness and voice turnaround latency measured over network simulation." },
      { order: 2, criterion: "Cleanliness and immediacy of barge-in cancellation handling." },
      { order: 3, criterion: "Naturalness of voice synthesis and conversational cadence." },
      { order: 4, criterion: "Architecture clarity separating audio pipeline from LLM orchestration." }
    ]
  },
  {
    id: "task_10",
    slug: "financial-fraud-detection-model",
    title: "Financial Fraud Detection Model",
    shortDescription: "Build a real-time transactional fraud scoring model handling extreme class imbalance and drift detection.",
    description: "Train a production-grade machine learning model to detect fraudulent card transactions in real-time. Apply sophisticated feature engineering (velocity features, geographical displacement, transaction frequency), calibrate probabilities on imbalanced distributions, and configure continuous drift monitoring.",
    category: "Machine Learning",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "5–8 hours",
    featured: false,
    participants: 145,
    popularity: "Medium",
    expectedOutcome: "A fast scoring microservice evaluating transactions in <15ms with risk explainability codes.",
    technologies: ["Python", "FastAPI", "Docker"],
    skills: ["Class Imbalance Handling", "Feature Engineering", "Model Interpretability", "SHAP Values"],
    requirements: [
      { order: 1, content: "Engineer rolling-window velocity features (e.g. transactions in last 10 minutes)." },
      { order: 2, content: "Train an ensemble classifier using XGBoost or LightGBM with focal loss tuning." },
      { order: 3, content: "Generate individual SHAP reason codes explaining the top contributing fraud risk factors." },
      { order: 4, content: "Implement a rule-override engine allowing analysts to block or allowlist specific entities." },
      { order: 5, content: "Build a population drift monitoring check using Kolmogorov-Smirnov statistical tests." }
    ],
    constraints: [
      { order: 1, content: "Model scoring p99 latency must not exceed 20 milliseconds per transaction." },
      { order: 2, content: "False positive rate on clean test dataset must be held strictly below 0.5%." },
      { order: 3, content: "All feature calculations must rely strictly on historical point-in-time data." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Precision-Recall AUC (PR-AUC) on highly skewed test transactions." },
      { order: 2, criterion: "Interpretability and fidelity of generated transaction risk explanation codes." },
      { order: 3, criterion: "Sub-20ms latency performance under load testing." },
      { order: 4, criterion: "Safety and isolation of real-time rule engine overrides." }
    ]
  },
  {
    id: "task_11",
    slug: "ai-meeting-summarizer",
    title: "AI Meeting Summarizer",
    shortDescription: "Convert messy audio meeting transcripts into structured action items, decisions, and executive briefs.",
    description: "Construct an automated post-meeting intelligence service that processes raw speaker-diarized transcripts. The system identifies distinct meeting segments, synthesizes key decisions, assigns action items with named owners and deadlines, and outputs an executive summary ready for Slack or email dispatch.",
    category: "Generative AI",
    difficulty: "Beginner",
    status: "Active",
    estimatedTime: "3–4 hours",
    featured: false,
    participants: 289,
    popularity: "High",
    expectedOutcome: "A clean web application that accepts raw transcript files and formats them into an actionable, editable meeting briefing.",
    technologies: ["TypeScript", "Next.js", "OpenAI", "React", "LLM"],
    skills: ["Prompt Engineering", "JSON Schema Enforcement", "UI Development", "Information Extraction"],
    requirements: [
      { order: 1, content: "Parse speaker transcript files with speaker names, timestamps, and dialogues." },
      { order: 2, content: "Extract structured action items with assignee names, estimated deadlines, and priority." },
      { order: 3, content: "Identify unanimous consensus agreements and unresolved agenda items." },
      { order: 4, content: "Provide copyable Markdown and one-click export to clipboard." },
      { order: 5, content: "Enable inline editing of generated action items before final export." }
    ],
    constraints: [
      { order: 1, content: "Must handle meeting transcripts containing up to 40,000 words without hitting token ceiling." },
      { order: 2, content: "Output format must strictly conform to a typed TypeScript interface." },
      { order: 3, content: "All participant privacy settings must be respected; do not persist transcripts permanently." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Action item extraction accuracy and owner assignment fidelity." },
      { order: 2, criterion: "Conciseness and quality of the executive summary." },
      { order: 3, criterion: "User experience and visual polish of the meeting summary view." },
      { order: 4, criterion: "Handling of transcripts with overlapping speech and disfluent phrasing." }
    ]
  },
  {
    id: "task_12",
    slug: "autonomous-drone-navigation-policy",
    title: "Autonomous Drone Navigation Policy",
    shortDescription: "Train a reinforcement learning policy for simulated quadrotor obstacle avoidance in cluttered urban environments.",
    description: "Implement a deep reinforcement learning policy (PPO or SAC) in a 3D simulation environment that commands quadrotor pitch, roll, and thrust to navigate toward waypoint goals while avoiding static and dynamic obstacles using simulated depth-camera and LiDAR sensor inputs.",
    category: "Robotics",
    difficulty: "Expert",
    status: "Active",
    estimatedTime: "14–18 hours",
    featured: true,
    participants: 64,
    popularity: "Medium",
    expectedOutcome: "A trained neural policy achieving >95% collision-free goal arrival rates in simulated obstacle courses.",
    technologies: ["Python", "PyTorch"],
    skills: ["Reinforcement Learning", "Kinematics", "Simulation Environments", "Policy Optimization"],
    requirements: [
      { order: 1, content: "Formulate Markov Decision Process (MDP) reward function penalizing proximity to obstacles." },
      { order: 2, content: "Implement Proximal Policy Optimization (PPO) with generalized advantage estimation (GAE)." },
      { order: 3, content: "Process synthetic 1D LiDAR range vectors into spatial state representations." },
      { order: 4, content: "Verify policy stability under random wind gusts and motor thrust variations." },
      { order: 5, content: "Plot learning curves, episode returns, and flight trajectory heatmaps." }
    ],
    constraints: [
      { order: 1, content: "Policy inference execution must run within a 10ms control cycle budget." },
      { order: 2, content: "Reward formulation must avoid local minima like hovering stationary indefinitely." },
      { order: 3, content: "Simulation environment must be reproducible with fixed pseudo-random seeds." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Goal completion rate across unseen test obstacle configurations." },
      { order: 2, criterion: "Smoothness of control actions (absence of aggressive thrust chatter)." },
      { order: 3, criterion: "Rigor of simulation benchmarks and ablation comparisons." },
      { order: 4, criterion: "Code clarity and reproducibility of the training pipeline." }
    ]
  },
  {
    id: "task_13",
    slug: "llm-evaluation-pipeline",
    title: "LLM Evaluation Pipeline",
    shortDescription: "Build a CI/CD automated test harness measuring LLM hallucination, bias, semantic drift, and prompt regressions.",
    description: "Construct an automated quality gate for production prompt engineering. When prompt templates or underlying foundation models are updated, this harness executes a suite of adversarial test cases, scores semantic accuracy using deterministic metrics and LLM-as-a-judge, and prevents deployment if regressions are detected.",
    category: "AI Engineering",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "6–9 hours",
    featured: true,
    participants: 198,
    popularity: "High",
    expectedOutcome: "A command-line test runner and dashboard producing pass/fail gates and visual diffs of response regressions.",
    technologies: ["Python", "TypeScript", "LLM", "OpenAI"],
    skills: ["Prompt Evaluation", "Testing Frameworks", "Adversarial Testing", "Metric Design"],
    requirements: [
      { order: 1, content: "Define test suite datasets in declarative YAML/JSON format with input fixtures and assertions." },
      { order: 2, content: "Implement exact-match, regex, embedding cosine similarity, and LLM-evaluator metrics." },
      { order: 3, content: "Calculate statistical confidence intervals across non-deterministic LLM runs." },
      { order: 4, content: "Generate HTML/Markdown test summary reports displaying regressions side-by-side." },
      { order: 5, content: "Integrate as a standard exit-code-based CLI step for GitHub Actions workflows." }
    ],
    constraints: [
      { order: 1, content: "Test runner must support concurrent async batching to minimize evaluation time." },
      { order: 2, content: "Judge prompts must be calibrated to eliminate self-preference and position biases." },
      { order: 3, content: "Cost and token consumption per test run must be logged and capped." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Reliability and calibration of LLM-as-a-judge scoring against human ratings." },
      { order: 2, criterion: "Sensitivity to subtle hallucinations and format breakages." },
      { order: 3, criterion: "Clarity and actionability of generated test regression reports." },
      { order: 4, criterion: "Execution speed through asynchronous concurrency." }
    ]
  },
  {
    id: "task_14",
    slug: "resume-screening-assistant",
    title: "Resume Screening Assistant",
    shortDescription: "Build an ethical AI applicant resume parser and skills matcher against technical job descriptions.",
    description: "Develop an automated resume screening microservice that extracts candidate career history, education credentials, and core competencies from PDF/Word documents. Compare extracted profiles against job vacancy requirements, generate transparent fit scores, and provide unbiased candidate summaries.",
    category: "Natural Language Processing",
    difficulty: "Beginner",
    status: "Active",
    estimatedTime: "4–5 hours",
    featured: false,
    participants: 215,
    popularity: "High",
    expectedOutcome: "A structured candidate evaluation dashboard highlighting matched skills, missing prerequisites, and transparent ranking scores.",
    technologies: ["Python", "FastAPI", "React", "TypeScript"],
    skills: ["Named Entity Recognition", "Document Parsing", "Fairness & Bias Mitigation", "REST APIs"],
    requirements: [
      { order: 1, content: "Extract raw text from PDF and DOCX documents with robust multi-column layout handling." },
      { order: 2, content: "Extract technical skills, certifications, and years of experience into structured JSON." },
      { order: 3, content: "Compute semantic fit scores against custom job descriptions." },
      { order: 4, content: "Mask candidate demographic signals (name, gender, age, location) to prevent bias." },
      { order: 5, content: "Provide clear bulleted rationale explaining why a candidate scored high or low." }
    ],
    constraints: [
      { order: 1, content: "Must strictly avoid discriminatory keywords or implicit proxy filtering." },
      { order: 2, content: "Parsing time per resume must not exceed 2.5 seconds." },
      { order: 3, content: "Must maintain 100% data confidentiality without public logging." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Accuracy of extracted skills and employment duration." },
      { order: 2, criterion: "Robustness against non-standard resume layouts and creative typography." },
      { order: 3, criterion: "Fairness safeguards and demographic anonymization completeness." },
      { order: 4, criterion: "UI clarity and candidate comparison usability." }
    ]
  },
  {
    id: "task_15",
    slug: "customer-sentiment-analyzer",
    title: "Customer Sentiment Analyzer",
    shortDescription: "Fine-tune a transformer model to classify multi-dimensional emotions and aspect-based sentiment in user reviews.",
    description: "Construct an aspect-based sentiment analysis API that ingests customer reviews and comments. Rather than simple positive/negative binary output, the model extracts specific product aspects (e.g., 'battery life', 'price', 'customer support') and predicts nuanced emotions (frustration, delight, skepticism).",
    category: "Natural Language Processing",
    difficulty: "Beginner",
    status: "Active",
    estimatedTime: "3–5 hours",
    featured: false,
    participants: 178,
    popularity: "Medium",
    expectedOutcome: "An interactive analytics dashboard revealing sentiment trends grouped by product features.",
    technologies: ["Python", "FastAPI", "Next.js", "React"],
    skills: ["Aspect-Based Sentiment", "Transformer Fine-Tuning", "Data Visualization", "API Development"],
    requirements: [
      { order: 1, content: "Extract aspect terms and corresponding sentiment polarities from unstructured reviews." },
      { order: 2, content: "Classify emotion categories: Joy, Sadness, Anger, Fear, Surprise, and Neutral." },
      { order: 3, content: "Compute overall Net Sentiment Score and aggregate trends across product versions." },
      { order: 4, content: "Provide interactive charts showing sentiment distribution over time." },
      { order: 5, content: "Flag urgent customer churn risks and safety complaints for immediate alerting." }
    ],
    constraints: [
      { order: 1, content: "Inference response time must remain under 50ms per customer review." },
      { order: 2, content: "Must handle slang, colloquial expressions, emojis, and sarcastic tone correctly." },
      { order: 3, content: "Client dashboard must update live as new reviews are posted." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "F1-score across granular emotion categories." },
      { order: 2, criterion: "Aspect extraction precision on multifaceted customer feedback." },
      { order: 3, criterion: "Aesthetics and usability of the interactive sentiment visualization dashboard." },
      { order: 4, criterion: "API error resilience and payload validation." }
    ]
  },
  {
    id: "task_16",
    slug: "ai-content-moderation-shield",
    title: "AI Content Moderation Shield",
    shortDescription: "Implement a multi-modal safety filter detecting toxicity, hate speech, spam, and illicit imagery in real-time.",
    description: "Design a high-throughput content moderation gateway that inspects user-generated text and image posts before publication. Combine lightweight rule-based filters with deep multimodal classifiers to detect policy violations, assign confidence scores, and enforce automated redaction or review queues.",
    category: "AI Engineering",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "5–8 hours",
    featured: false,
    participants: 104,
    popularity: "Medium",
    expectedOutcome: "A low-latency moderation proxy service with custom policy rule configurations and audit logs.",
    technologies: ["Python", "FastAPI", "Docker", "OpenCV"],
    skills: ["Content Safety", "Multimodal Moderation", "Rule Engines", "High-Throughput APIs"],
    requirements: [
      { order: 1, content: "Scan incoming text payloads for toxicity, harassment, and spam patterns." },
      { order: 2, content: "Process image attachments to flag NSFW content, gore, and hate iconography." },
      { order: 3, content: "Implement tier-based routing: Auto-Approve, Human Review, or Immediate Block." },
      { order: 4, content: "Maintain an encrypted audit log of all moderation decisions and flagged content." },
      { order: 5, content: "Provide admin dashboard to customize category severity thresholds dynamically." }
    ],
    constraints: [
      { order: 1, content: "P99 latency must not exceed 60ms for text-only posts and 250ms for images." },
      { order: 2, content: "Must withstand adversarial evasion attempts (leetspeak, zero-width characters)." },
      { order: 3, content: "Zero storage of flagged illicit materials beyond hashed compliance fingerprints." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Adversarial robustness against obfuscated toxic strings." },
      { order: 2, criterion: "Throughput under simulated concurrent spikes (1,000 req/sec)." },
      { order: 3, criterion: "Clarity of policy configuration schemas and administrative overrides." },
      { order: 4, criterion: "Accuracy of classification thresholds across diverse content genres." }
    ]
  },
  {
    id: "task_17",
    slug: "industrial-robot-arm-inverse-kinematics",
    title: "Industrial Robot Arm Inverse Kinematics",
    shortDescription: "Implement a neural inverse kinematics solver for 6-DOF robotic manipulators with collision-free trajectory planning.",
    description: "Develop a deep learning-accelerated inverse kinematics (IK) solver for a 6-axis industrial robot arm. Compare neural approximations against traditional numerical solvers (Jacobian pseudoinverse), and plan smooth collision-free trajectories for automated pick-and-place assembly operations.",
    category: "Robotics",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "9–13 hours",
    featured: false,
    participants: 52,
    popularity: "Medium",
    expectedOutcome: "A 3D simulation and trajectory calculator solving 6-DOF joint angles in microseconds with collision avoidance.",
    technologies: ["Python", "PyTorch"],
    skills: ["Robotics Kinematics", "Trajectory Optimization", "Neural Solvers", "Physical Simulation"],
    requirements: [
      { order: 1, content: "Model the kinematic chain using Denavit-Hartenberg (DH) parameters." },
      { order: 2, content: "Train a neural network mapping 3D Cartesian coordinates to 6 joint angles." },
      { order: 3, content: "Implement singularity detection and avoidance constraints." },
      { order: 4, content: "Generate minimum-jerk trajectory paths between pick and place waypoints." },
      { order: 5, content: "Visualize arm movement in a WebGL / 3D canvas viewport." }
    ],
    constraints: [
      { order: 1, content: "Neural IK solver latency must remain under 0.5ms per Cartesian target." },
      { order: 2, content: "Position error at end-effector tip must be less than 1.0mm in simulation." },
      { order: 3, content: "Joint velocity and acceleration limits must never be exceeded during transit." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Positional accuracy and orientation alignment of end-effector." },
      { order: 2, criterion: "Speedup of neural solver relative to iterative Newton-Raphson methods." },
      { order: 3, criterion: "Smoothness of generated trajectories through joint velocity profiles." },
      { order: 4, criterion: "Quality of visual 3D simulation representation." }
    ]
  },
  {
    id: "task_18",
    slug: "personalized-ai-math-tutor",
    title: "Personalized AI Math Tutor",
    shortDescription: "Build a Socratic math pedagogy agent that provides step-by-step guidance without giving away direct answers.",
    description: "Develop an interactive educational AI tutor specializing in secondary mathematics and algebra. The system diagnoses student misconceptions, poses targeted Socratic questions, renders mathematical notation with LaTeX/KaTeX, and adapts its pedagogical tone to student mastery levels.",
    category: "Generative AI",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "5–7 hours",
    featured: false,
    participants: 194,
    popularity: "High",
    expectedOutcome: "A web learning environment with interactive scratchpad, step-by-step hint reveals, and mastery tracking.",
    technologies: ["TypeScript", "Next.js", "React", "LLM", "OpenAI"],
    skills: ["Pedagogical Prompting", "KaTeX Integration", "Stateful Dialogues", "User Experience"],
    requirements: [
      { order: 1, content: "Render mathematical formulas accurately with KaTeX typesetting." },
      { order: 2, content: "Enforce Socratic methodology: never reveal complete solutions upfront." },
      { order: 3, content: "Detect and isolate the exact conceptual misstep in student scratch work." },
      { order: 4, content: "Offer progressive scaffolding: Conceptual Hint -> Sub-problem -> Direct Guidance." },
      { order: 5, content: "Track problem mastery score and update skill progression graph." }
    ],
    constraints: [
      { order: 1, content: "Model must resist student prompt injection attempts to reveal direct answers." },
      { order: 2, content: "Mathematical explanations must be 100% mathematically rigorous and verified." },
      { order: 3, content: "Interface must support mobile touchscreen input for formula sketching." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Effectiveness in nudging student to derive correct answer independently." },
      { order: 2, criterion: "Mathematical soundness and precision of hints across algebra topics." },
      { order: 3, criterion: "Resistance against jailbreaks asking for raw answers." },
      { order: 4, criterion: "Visual clarity of rendered mathematical notations." }
    ]
  },
  {
    id: "task_19",
    slug: "ai-workflow-automation-engine",
    title: "AI Workflow Automation Engine",
    shortDescription: "Build a resilient DAG execution engine chaining LLM steps, web scrapers, and external APIs with retry policies.",
    description: "Design and implement a deterministic, stateful workflow automation engine capable of orchestrating complex multi-step AI pipelines (Directed Acyclic Graphs). Support conditional branching, parallel fan-out/fan-in steps, backoff retries on flaky APIs, and real-time execution telemetry streaming.",
    category: "Automation",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "8–12 hours",
    featured: true,
    participants: 156,
    popularity: "High",
    expectedOutcome: "A robust DAG orchestration runtime with visual node progress inspector and fault-tolerant resumes.",
    technologies: ["TypeScript", "Next.js", "Python", "Docker"],
    skills: ["Workflow Engines", "DAG Execution", "Concurrency & Retries", "Distributed State"],
    requirements: [
      { order: 1, content: "Define workflow DAG schemas with strongly-typed node inputs and outputs." },
      { order: 2, content: "Execute independent graph nodes concurrently while respecting dependency topological sorts." },
      { order: 3, content: "Implement exponential backoff retry policies for rate-limited API calls." },
      { order: 4, content: "Stream step-by-step execution status and output payloads via Server-Sent Events (SSE)." },
      { order: 5, content: "Persist execution checkpoints to disk to enable resumption after system restarts." }
    ],
    constraints: [
      { order: 1, content: "Engine must detect circular graph dependency cycles and reject invalid pipelines." },
      { order: 2, content: "Step execution state must be completely isolated to prevent memory leaks." },
      { order: 3, content: "Must support cancellation of in-flight workflow executions gracefully." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Reliability of concurrent execution and topological resolution." },
      { order: 2, criterion: "Fault recovery when an individual step fails or throws timeouts." },
      { order: 3, criterion: "UX polish of the live execution telemetry stream." },
      { order: 4, criterion: "Engine architecture extensibility for adding new task node types." }
    ]
  },
  {
    id: "task_20",
    slug: "tabular-data-extraction-pipeline",
    title: "Tabular Data Extraction Pipeline",
    shortDescription: "Construct an automated ETL pipeline converting messy tables across scans into clean Parquet dataframes.",
    description: "Develop an automated data pipeline that ingests complex, multi-header spreadsheets, financial reports, and messy CSVs. Clean ambiguous date formats, normalize categorical strings, resolve conflicting currency symbols, impute missing values using statistical models, and store the output in analytical Parquet format.",
    category: "Data Science",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "4–6 hours",
    featured: false,
    participants: 122,
    popularity: "Medium",
    expectedOutcome: "An automated tabular cleaning pipeline with automated data profiling reports and schema validation tests.",
    technologies: ["Python", "FastAPI"],
    skills: ["Data Wrangling", "Pandas", "ETL Pipelines", "Data Validation"],
    requirements: [
      { order: 1, content: "Detect and unmerge multi-level hierarchical column headers." },
      { order: 2, content: "Infer correct data types (numeric, boolean, datetime) with outlier detection." },
      { order: 3, content: "Standardize currency units and perform foreign exchange conversions." },
      { order: 4, content: "Generate an automated data quality scorecard highlighting null percentages and duplicates." },
      { order: 5, content: "Export clean datasets to partitioned Apache Parquet and SQLite formats." }
    ],
    constraints: [
      { order: 1, content: "Pipeline must handle datasets with up to 1,000,000 rows without out-of-memory errors." },
      { order: 2, content: "All data transformations must be idempotent and fully logged." },
      { order: 3, content: "Zero silent truncation of floating point currency precisions." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Success rate across heterogeneous table layouts and date format variations." },
      { order: 2, criterion: "Memory efficiency and throughput on large batch files." },
      { order: 3, criterion: "Comprehensiveness of generated data validation checks." },
      { order: 4, criterion: "Code modularity and configuration declarativeness." }
    ]
  },
  {
    id: "task_21",
    slug: "agent-long-term-memory-system",
    title: "Agent Long-Term Memory System",
    shortDescription: "Design a hierarchical episodic and semantic memory architecture enabling AI agents to retain facts over months.",
    description: "Build a persistent memory architecture for autonomous AI agents that goes beyond static context windows. Combine short-term working memory buffers with episodic memory stores, semantic knowledge graphs, and memory consolidation routines that periodically summarize past conversations into core user preferences.",
    category: "AI Agents",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "7–10 hours",
    featured: true,
    participants: 187,
    popularity: "High",
    expectedOutcome: "A memory middleware service providing intelligent contextual recall and memory consolidation for AI agents.",
    technologies: ["Python", "OpenAI", "LangChain", "LLM"],
    skills: ["Memory Architectures", "Vector Retrieval", "Graph Databases", "Information Decay"],
    requirements: [
      { order: 1, content: "Implement short-term sliding context buffer with token count budgeting." },
      { order: 2, content: "Store episodic conversational episodes indexed with vector embeddings and timestamps." },
      { order: 3, content: "Implement memory consolidation worker that periodically extracts durable facts and preferences." },
      { order: 4, content: "Formulate memory retrieval scores blending recency, importance, and semantic relevance." },
      { order: 5, content: "Provide memory deletion and update APIs ensuring GDPR right-to-be-forgotten compliance." }
    ],
    constraints: [
      { order: 1, content: "Memory query stage must return top relevant memories within 150ms." },
      { order: 2, content: "Must prevent contradictory memories from confusing the agent during prompt synthesis." },
      { order: 3, content: "User memories must be strongly partitioned per user ID with zero cross-tenant contamination." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Recall accuracy of distant facts planted in mock dialogues weeks earlier." },
      { order: 2, criterion: "Effectiveness of memory consolidation in condensing redundant interactions." },
      { order: 3, criterion: "Query latency and token economy during prompt assembly." },
      { order: 4, criterion: "Security and tenant isolation rigor." }
    ]
  },
  {
    id: "task_22",
    slug: "edge-device-face-recognition-guard",
    title: "Edge Device Face Recognition Guard",
    shortDescription: "Optimize a face verification model with anti-spoofing liveness detection for deployment on Raspberry Pi / edge hardware.",
    description: "Engineer an embedded facial recognition and access control service that runs locally on edge compute. Integrate infrared or RGB liveness detection to thwart replay and print attacks, optimize deep embeddings through INT8 quantization, and execute verification against local employee rosters in under 200ms.",
    category: "Computer Vision",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "8–11 hours",
    featured: false,
    participants: 73,
    popularity: "Medium",
    expectedOutcome: "An edge-deployable verification binary with sub-200ms recognition and robust anti-spoofing defense.",
    technologies: ["Python", "PyTorch", "OpenCV"],
    skills: ["Edge Computing", "Model Quantization", "Biometric Security", "Anti-Spoofing"],
    requirements: [
      { order: 1, content: "Implement real-time face detection and 5-point facial landmark alignment." },
      { order: 2, content: "Integrate anti-spoofing texture and reflection analysis to detect phone screen presentations." },
      { order: 3, content: "Extract 512-dimensional facial embeddings using a MobileFaceNet backbone." },
      { order: 4, content: "Perform nearest-neighbor match against local biometric gallery with cosine similarity." },
      { order: 5, content: "Quantize weights to INT8 precision using ONNX Runtime for CPU acceleration." }
    ],
    constraints: [
      { order: 1, content: "Total pipeline latency must remain under 200ms on a quad-core ARM processor." },
      { order: 2, content: "False Acceptance Rate (FAR) must be strictly below 0.001%." },
      { order: 3, content: "Biometric vectors must be salted and cryptographically hashed at rest." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Liveness classification accuracy against printed photos and mobile video replays." },
      { order: 2, criterion: "Recognition precision under adverse lighting and off-axis head poses." },
      { order: 3, criterion: "FPS throughput and memory usage on constrained ARM architecture." },
      { order: 4, criterion: "Adherence to biometric privacy guidelines and security hygiene." }
    ]
  },
  {
    id: "task_23",
    slug: "supply-chain-demand-forecaster",
    title: "Supply Chain Demand Forecaster",
    shortDescription: "Build a hierarchical time-series forecasting model predicting retail inventory demands across regional warehouses.",
    description: "Construct a multi-step forecasting engine for retail supply chain optimization. Ingest historical sales records, promotion calendars, seasonal weather signals, and holiday indicators. Produce probabilistic demand forecasts with uncertainty bounds to minimize stockouts and warehouse holding expenses.",
    category: "Machine Learning",
    difficulty: "Intermediate",
    status: "Active",
    estimatedTime: "5–7 hours",
    featured: false,
    participants: 118,
    popularity: "Medium",
    expectedOutcome: "A forecast microservice returning 30-day forward demand predictions with confidence intervals and scenario simulations.",
    technologies: ["Python", "FastAPI"],
    skills: ["Time Series Forecasting", "Feature Engineering", "Probabilistic ML", "Inventory Optimization"],
    requirements: [
      { order: 1, content: "Decompose historical demand trends into seasonal, holiday, and residual components." },
      { order: 2, content: "Engineer lag features, rolling statistics, and promotional discount flags." },
      { order: 3, content: "Train gradient boosted models or Temporal Fusion Transformers (TFT) with quantile loss." },
      { order: 4, content: "Generate 10th, 50th, and 90th percentile demand forecasts." },
      { order: 5, content: "Simulate reorder point recommendations based on lead times and target service levels." }
    ],
    constraints: [
      { order: 1, content: "Must handle intermittent and zero-demand product sales histories without divergence." },
      { order: 2, content: "Mean Absolute Scaled Error (MASE) must be superior to seasonal naïve baselines." },
      { order: 3, content: "All forecast generation must run within scheduled nightly batch computation windows." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Forecast accuracy (WAPE / MASE) across high-volume and intermittent SKUs." },
      { order: 2, criterion: "Calibration of predicted uncertainty bounds (P10–P90 coverage)." },
      { order: 3, criterion: "Clarity of interactive visualization showing actuals vs forecasted demands." },
      { order: 4, criterion: "Rigor of walk-forward temporal cross-validation methodology." }
    ]
  },
  {
    id: "task_24",
    slug: "zero-shot-text-classification-api",
    title: "Zero-Shot Text Classification API",
    shortDescription: "Deploy a fast microservice classifying arbitrary text snippets against dynamic user-defined category labels.",
    description: "Implement a zero-shot classification microservice that allows client applications to pass arbitrary text alongside a dynamic array of candidate labels on the fly. Leverage natural language inference (NLI) formulations or modern lightweight embedding cross-encoders to return probability distributions without model retraining.",
    category: "Natural Language Processing",
    difficulty: "Beginner",
    status: "Active",
    estimatedTime: "3–4 hours",
    featured: false,
    participants: 230,
    popularity: "High",
    expectedOutcome: "A developer-friendly REST API accepting any text and arbitrary category lists with instant probability ranking.",
    technologies: ["Python", "FastAPI", "JavaScript", "TypeScript"],
    skills: ["Zero-Shot Learning", "NLI Models", "API Architecture", "Performance Optimization"],
    requirements: [
      { order: 1, content: "Accept incoming payloads containing input text and a dynamic list of candidate labels." },
      { order: 2, content: "Formulate classification as premise-hypothesis Natural Language Inference pairs." },
      { order: 3, content: "Compute entailment probabilities and normalize via softmax into percentage confidences." },
      { order: 4, content: "Cache frequent query-label pairs using LRU caching mechanisms." },
      { order: 5, content: "Provide OpenAPI / Swagger documentation with interactive live testing console." }
    ],
    constraints: [
      { order: 1, content: "Latency must not exceed 100ms for candidate label sets up to 10 classes." },
      { order: 2, content: "Candidate label strings must be validated and sanitized against malicious input." },
      { order: 3, content: "Microservice must run gracefully on CPU-only infrastructure." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Zero-shot classification precision across ambiguous domain vocabularies." },
      { order: 2, criterion: "Sub-100ms response latency under standard web traffic loads." },
      { order: 3, criterion: "API ergonomic design and interactive documentation completeness." },
      { order: 4, criterion: "Input error handling and descriptive validation messages." }
    ]
  },
  {
    id: "task_25",
    slug: "synthetic-data-generation-pipeline",
    title: "Synthetic Data Generation Pipeline",
    shortDescription: "Create a scalable generator synthesizing domain-specific reasoning datasets with automated verification filters.",
    description: "Design and build an automated synthetic data generation engine to produce high-quality instructional datasets for fine-tuning specialized LLMs. Employ self-instruct principles, multi-turn dialogue simulation, and rigorous rule-based/symbolic verifiers to purge hallucinations and low-quality samples.",
    category: "AI Engineering",
    difficulty: "Expert",
    status: "Active",
    estimatedTime: "10–14 hours",
    featured: true,
    participants: 142,
    popularity: "High",
    expectedOutcome: "A reproducible pipeline that outputs 10,000+ verified, deduplicated instruction-tuning examples in JSONL format.",
    technologies: ["Python", "LLM", "OpenAI", "Docker"],
    skills: ["Synthetic Data Generation", "Dataset Curation", "Quality Filtering", "Model Fine-Tuning"],
    requirements: [
      { order: 1, content: "Seed generation with high-diversity initial instructional prompt archetypes." },
      { order: 2, content: "Execute multi-turn step-by-step reasoning expansions with varying difficulty tiers." },
      { order: 3, content: "Filter outputs using automated syntax verifiers, regex rules, and safety classifiers." },
      { order: 4, content: "Deduplicate candidate instances using MinHash LSH semantic similarity checks." },
      { order: 5, content: "Export validated datasets in standard Alpaca and ShareGPT JSONL training schemas." }
    ],
    constraints: [
      { order: 1, content: "Synthetic generations must exhibit semantic diversity score > 0.82 across clusters." },
      { order: 2, content: "Automatic rejection of any generated instances containing formula errors or invalid code." },
      { order: 3, content: "Pipeline must log per-sample cost estimates and generation token consumption." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Diversity and complexity distribution of synthesized instruction pairs." },
      { order: 2, criterion: "Effectiveness of automated verifiers in weeding out flawed reasoning traces." },
      { order: 3, criterion: "Throughput and cost efficiency of the batch generation architecture." },
      { order: 4, criterion: "Readability and reproducibility of the data generation pipeline scripts." }
    ]
  },
  {
    id: "task_26",
    slug: "ecommerce-recommendation-graph",
    title: "E-Commerce Recommendation Graph",
    shortDescription: "Construct a real-time Graph Neural Network recommender linking user clickstreams and item knowledge graphs.",
    description: "Build an enterprise recommendation engine that models user interactions, co-purchases, and product metadata as a heterogeneous knowledge graph. Train a Graph Convolutional Network (GCN) to predict user-item affinities, handle cold-start products, and serve personalized top-K item recommendations in real-time.",
    category: "Data Science",
    difficulty: "Advanced",
    status: "Active",
    estimatedTime: "7–11 hours",
    featured: false,
    participants: 89,
    popularity: "Medium",
    expectedOutcome: "A graph recommendation API serving real-time personalized carousel feeds with sub-25ms response times.",
    technologies: ["Python", "PyTorch", "FastAPI"],
    skills: ["Graph Neural Networks", "Recommendation Systems", "Collaborative Filtering", "Cold-Start Handling"],
    requirements: [
      { order: 1, content: "Construct heterogeneous graph representing users, products, categories, and brands." },
      { order: 2, content: "Train node embeddings via GraphSAGE or LightGCN architectures." },
      { order: 3, content: "Address cold-start items by projecting text and category attributes into graph embedding space." },
      { order: 4, content: "Expose endpoint returning top-10 recommended products for any active session." },
      { order: 5, content: "Calculate diversity and serendipity metrics alongside standard HitRate@10." }
    ],
    constraints: [
      { order: 1, content: "Real-time recommendation scoring latency must remain under 25ms." },
      { order: 2, content: "Graph updates for new user interactions must be reflected within 60 seconds." },
      { order: 3, content: "Recommendations must enforce category diversity to avoid recommendation filter bubbles." }
    ],
    evaluationCriteria: [
      { order: 1, criterion: "Recommendation accuracy (NDCG@10 and Recall@10) on offline holdout test sets." },
      { order: 2, criterion: "Performance on new cold-start items with zero previous historical interactions." },
      { order: 3, criterion: "Sub-25ms retrieval latency under concurrent user session simulations." },
      { order: 4, criterion: "Cleanliness of graph ingestion pipeline and API interfaces." }
    ]
  }
];

console.log(`Seeding ${tasks.length} tasks...`);

const insertTask = db.prepare(`
  INSERT INTO tasks (
    id, slug, title, short_description, description, category, difficulty,
    status, estimated_time, featured, participants, popularity, expected_outcome,
    created_at, updated_at
  ) VALUES (
    @id, @slug, @title, @shortDescription, @description, @category, @difficulty,
    @status, @estimatedTime, @featured, @participants, @popularity, @expectedOutcome,
    @createdAt, @updatedAt
  )
`);

const insertTech = db.prepare(`
  INSERT INTO task_technologies (task_id, name) VALUES (?, ?)
`);

const insertSkill = db.prepare(`
  INSERT INTO task_skills (task_id, name) VALUES (?, ?)
`);

const insertReq = db.prepare(`
  INSERT INTO task_requirements (task_id, content, order_num) VALUES (?, ?, ?)
`);

const insertConst = db.prepare(`
  INSERT INTO task_constraints (task_id, content, order_num) VALUES (?, ?, ?)
`);

const insertEval = db.prepare(`
  INSERT INTO task_evaluations (task_id, criterion, order_num) VALUES (?, ?, ?)
`);

const seedTransaction = db.transaction(() => {
  // Clear existing data
  db.exec(`
    DELETE FROM task_participations;
    DELETE FROM task_evaluations;
    DELETE FROM task_constraints;
    DELETE FROM task_requirements;
    DELETE FROM task_skills;
    DELETE FROM task_technologies;
    DELETE FROM tasks;
  `);

  const now = new Date("2026-09-01T10:00:00.000Z");

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskDate = new Date(now.getTime() - i * 86400000 * 2).toISOString();

    insertTask.run({
      id: task.id,
      slug: task.slug,
      title: task.title,
      shortDescription: task.shortDescription,
      description: task.description,
      category: task.category,
      difficulty: task.difficulty,
      status: task.status,
      estimatedTime: task.estimatedTime,
      featured: task.featured ? 1 : 0,
      participants: task.participants,
      popularity: task.popularity,
      expectedOutcome: task.expectedOutcome,
      createdAt: taskDate,
      updatedAt: taskDate
    });

    for (const tech of task.technologies) {
      insertTech.run(task.id, tech);
    }

    for (const skill of task.skills) {
      insertSkill.run(task.id, skill);
    }

    for (const req of task.requirements) {
      insertReq.run(task.id, req.content, req.order);
    }

    for (const c of task.constraints) {
      insertConst.run(task.id, c.content, c.order);
    }

    for (const e of task.evaluationCriteria) {
      insertEval.run(task.id, e.criterion, e.order);
    }
  }
});

seedTransaction();

const count = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;
console.log(`Successfully seeded ${count} tasks into SQLite database at ${dbPath}`);
db.close();
