export interface WeeklyDeliverable {
  week: number;
  learn: string;
  build: string;
  is_completed: boolean;
  xp_reward: number;
}

export interface CareerAction {
  action: string;
  is_completed: boolean;
}

export interface MonthlyMilestone {
  month: number;
  title: string;
  phase: "Phase I: Foundations" | "Phase II: AI Core" | "Phase III: Agents & Capstone" | "Phase IV: Scale & Income";
  trackFocus: string;
  flagshipProject?: string;
  milestoneDescription: string;
  weeks: WeeklyDeliverable[];
  careerActions: CareerAction[];
  status: "completed" | "in_progress" | "available" | "locked";
  xp_reward: number;
  is_completed: boolean;
}

export interface StrategicTrack {
  id: string;
  name: string;
  tagline: string;
  targetRole: string;
  description: string;
  probability: string;
  timeline: string;
  accentColor: string;
  keyAction: string;
}

export const STRATEGIC_TRACKS: StrategicTrack[] = [
  {
    id: "track-1",
    name: "Track 1: Internal Company Move",
    tagline: "Highest Probability Path",
    targetRole: "Internal Automation & AI Lead",
    description: "Build internal proof on current job workflows (tickets, reports, data extraction). Pitch a low-risk internal pilot in Month 5.",
    probability: "80% (Highest)",
    timeline: "Months 1–6 Groundwork, Pitch Month 5",
    accentColor: "indigo",
    keyAction: "Propose 1 internal workflow automation to manager using lead-qual or ticket agent.",
  },
  {
    id: "track-2",
    name: "Track 2: Remote Junior AI Roles",
    tagline: "High Leverage Parallel Path",
    targetRole: "AI Implementation / Workflow Engineer",
    description: "Apply to remote startups, consultancies, and agencies with 4 pinned GitHub repos, 100+ eval test cases, and Docker capstone.",
    probability: "65% (Strong)",
    timeline: "Launch Month 6–7, Active Months 7–10",
    accentColor: "cyan",
    keyAction: "Direct outreach to AI agencies, seed-stage AI startups and consultancies.",
  },
  {
    id: "track-3",
    name: "Track 3: Zenin AI Productized Services",
    tagline: "Compounding Business Upside",
    targetRole: "B2B AI Services Founder",
    description: "Narrow productized offer: Custom RAG knowledge assistants and support automation agents for small businesses ($25–80/hr).",
    probability: "Compounding Upside",
    timeline: "Setup Month 8, Scale Months 9–12",
    accentColor: "emerald",
    keyAction: "Package repeatable RAG/agent builds into fixed-price $1,500–$3,500 setups.",
  },
];

export const DEFAULT_ROADMAP_MONTHS: MonthlyMilestone[] = [
  {
    month: 1,
    title: "Python + Git Reset & Database Foundations",
    phase: "Phase I: Foundations",
    trackFocus: "Track 1 Groundwork",
    flagshipProject: "CLI Expense Tracker v2 & PostgreSQL API Pipeline",
    milestoneDescription: "A GitHub repo with README, src/, tests/ for the expense tracker, plus a database-backed API project.",
    xp_reward: 100,
    status: "in_progress",
    is_completed: false,
    weeks: [
      {
        week: 1,
        learn: "Python syntax, conditionals, loops, functions, lists/dicts/sets/tuples, comprehensions, exceptions",
        build: "CLI Expense Tracker: add/delete/categorize expenses, show totals, save to JSON",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 2,
        learn: "Modules, packages, venv, pip, file handling, JSON/CSV, datetime, type hints, basic unit testing",
        build: "Expense Tracker v2: CSV export, filtering, date ranges, unit tests, configuration",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 3,
        learn: "Git commits, branching, PRs, .gitignore, environment variables, HTTP methods, REST APIs",
        build: "API Data Collector: Python client that consumes a public API, validates data, saves JSON",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 4,
        learn: "SQL & PostgreSQL: tables, keys, SELECT/WHERE/JOIN/GROUP BY, indexes, transactions, schema design",
        build: "Convert the API project into API → Python → PostgreSQL, with a clean schema",
        is_completed: false,
        xp_reward: 25,
      },
    ],
    careerActions: [
      { action: "Tell manager/team lead you are studying backend and AI engineering to plant seed for Track 1", is_completed: false },
      { action: "Configure professional GitHub profile with bio and clean pinned repos placeholder", is_completed: false },
    ],
  },
  {
    month: 2,
    title: "Backend / API Engineer (FastAPI & Architecture)",
    phase: "Phase I: Foundations",
    trackFocus: "Track 1 Groundwork",
    flagshipProject: "PROJECT 1 — Support Ticket Backend API",
    milestoneDescription: "Polished GitHub project: README, architecture diagram, API docs, setup instructions, tests, screenshots.",
    xp_reward: 100,
    status: "available",
    is_completed: false,
    weeks: [
      {
        week: 5,
        learn: "FastAPI structure, routes, request/response models, Pydantic, validation, error handling, docs",
        build: "Customer Ticket API: POST/GET/PATCH/DELETE /tickets endpoints with Pydantic validation",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 6,
        learn: "Authentication concepts, middleware, dependency injection, async basics, logging, API testing",
        build: "PROJECT 1 — Support Ticket Backend: customer records, tickets, search, pagination, PostgreSQL, tests",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Mentally note any internal tool with rough workflows (tickets, requests, approvals) at current job", is_completed: false },
    ],
  },
  {
    month: 3,
    title: "LLM Fundamentals & First AI API",
    phase: "Phase II: AI Core",
    trackFocus: "Track 1 Groundwork",
    flagshipProject: "Ticket Intelligence API (FastAPI + LLM + PostgreSQL)",
    milestoneDescription: "A working API that classifies, summarizes, and routes support tickets automatically using structured outputs.",
    xp_reward: 150,
    status: "available",
    is_completed: false,
    weeks: [
      {
        week: 7,
        learn: "Tokens/context, temperature, structured outputs, hallucination, prompt design, model selection, latency",
        build: "Python LLM CLI: input a customer complaint, output structured JSON (category, priority, summary)",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 8,
        learn: "API auth, structured outputs, tool/function calling, retries, timeouts, token cost tracking, abstraction",
        build: "Ticket Intelligence API: FastAPI → LLM → structured classification → PostgreSQL storage",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Draft one-sentence business pitch (e.g. 'auto-triages support tickets') for CV and outreach", is_completed: false },
    ],
  },
  {
    month: 4,
    title: "RAG & Real AI Applications",
    phase: "Phase II: AI Core",
    trackFocus: "Track 1 Pitch Begins",
    flagshipProject: "PROJECT 2 — Company Knowledge Assistant & Eval Dataset",
    milestoneDescription: "A working RAG assistant framed as an internal company tool backed by a 50–100 question evaluation dataset.",
    xp_reward: 150,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 9,
        learn: "Embeddings, semantic similarity, chunking, metadata, retrieval, context construction, RAG failure modes",
        build: "Tiny document search system: 10–20 documents, return most relevant chunks for a user question",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 10,
        learn: "Vector columns, pgvector, similarity search, metadata filtering, keeping vector storage in PostgreSQL",
        build: "Documents → chunk → embed → PostgreSQL + pgvector → retrieve pipeline",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 11,
        learn: "Full RAG chatbot architecture with citations, hallucination guards, and refusal behavior",
        build: "PROJECT 2 — Company Knowledge Assistant: upload docs, chunk, embed, retrieve, answer, cite sources",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 12,
        learn: "Retrieval failures, hallucinations, chunk-size tradeoffs, top-k, groundedness, AI evaluation benchmarks",
        build: "Build 50–100 test questions with expected answers and citations — your first AI evaluation dataset",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Show the Knowledge Assistant demo informally to a colleague or manager as your first internal proof point", is_completed: false },
      { action: "Ask if any internal team has documents/FAQs that could benefit from an automated AI assistant", is_completed: false },
    ],
  },
  {
    month: 5,
    title: "Automation Workflows & Agentic Systems",
    phase: "Phase III: Agents & Capstone",
    trackFocus: "Track 1 Pitch / Track 3 Setup",
    flagshipProject: "AI Support Agent with Human-in-the-Loop",
    milestoneDescription: "An AI support agent that knows when not to act autonomously — featuring approval workflows and tool calling.",
    xp_reward: 200,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 13,
        learn: "n8n: triggers, nodes, HTTP requests, webhooks, credentials, branching, error handling, retries",
        build: "Form submission → n8n → LLM → classify → PostgreSQL → notification pipeline",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 14,
        learn: "Webhooks, CRM-style workflows, scheduling, conditional routing, external APIs, human approval gates",
        build: "Lead Qualification Automation: website lead → n8n → AI qualification → score → sales alert",
        is_completed: false,
        xp_reward: 25,
      },
      {
        week: 15,
        learn: "Tool/function calling in code: get_customer(), create_ticket(), search_knowledge(), send_email()",
        build: "AI Support Agent v1 — the model chooses tools dynamically, application executes securely",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 16,
        learn: "Approval workflows, confidence thresholds, escalation triggers, failure recovery, audit logging",
        build: "Add human-in-the-loop: AI drafts response, routes to auto-send or human review based on confidence",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Pitch Track 1 formally: propose one internal automation pilot using lead-qualification or support agent", is_completed: false },
      { action: "Draft narrow offer statement for Track 3 (Zenin AI) and Track 2 remote CV positioning", is_completed: false },
    ],
  },
  {
    month: 6,
    title: "Production Engineering & Flagship Capstone",
    phase: "Phase III: Agents & Capstone",
    trackFocus: "Track 1 Ask / Track 2 Launch",
    flagshipProject: "PROJECT 3 — AI Customer Operations Platform (Capstone)",
    milestoneDescription: "A deployed, documented capstone with 100+ evaluation cases, Docker Compose, and a demo video.",
    xp_reward: 250,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 17,
        learn: "LangGraph: state graphs, nodes, edges, routing, persistence, retries, human interrupts",
        build: "Turn support agent into explicit graph: receive → classify → retrieve → decide → answer/escalate",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 18,
        learn: "Testing: pytest, AI regression datasets, hallucination checks, tool-call validation",
        build: "Automated test suite: run 100 test questions through agent, score, generate benchmark report",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 19,
        learn: "Docker: images, containers, Dockerfile, env variables, Compose, networking, volumes",
        build: "Containerize FastAPI, PostgreSQL, pgvector, and AI service into unified Docker Compose setup",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 20,
        learn: "Logging, monitoring, secrets, rate limits, retries, timeouts, background jobs, basic cloud deploy",
        build: "Make the support automation platform deployable by anyone via single script and documented config",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 21,
        learn: "Capstone architecture polish, performance profiling, latency tuning, and reliability testing",
        build: "PROJECT 3 — AI Customer Operations Platform: full stack deployment with documentation & demo video",
        is_completed: false,
        xp_reward: 100,
      },
      {
        week: 24,
        learn: "Portfolio and CV assembly: framing outcome-based engineering metrics",
        build: "Pin 4 repos on GitHub: Operations Platform, Knowledge Assistant, Ticket Backend, Eval Harness",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Have promotion/raise conversation with current manager based on shipped internal pilots", is_completed: false },
      { action: "Quietly begin applying to remote AI Automation / Implementation Engineer roles (Track 2)", is_completed: false },
      { action: "Publish a short technical LinkedIn post breaking down the capstone architecture", is_completed: false },
    ],
  },
  {
    month: 7,
    title: "Applications, Technical Interviews & Networking",
    phase: "Phase IV: Scale & Income",
    trackFocus: "Track 2 Applications",
    flagshipProject: "Technical Interview Mastery & Direct Outreach",
    milestoneDescription: "Clear articulation of both the technical and business case for production AI systems.",
    xp_reward: 150,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 25,
        learn: "Interview prep: RAG retrieval nuances, hallucination causes, pgvector indexing, tool calling, scaling",
        build: "Refine capstone code and API docs based on mock technical interview drills",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 26,
        learn: "Business case framing: time saved, manual labor removed, failure containment, ROI calculation",
        build: "Create concise 1-page case studies for the Knowledge Assistant and Support Operations Platform",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Apply to Track 2 roles: AI Implementation Engineer, AI Automation Engineer, LLM Eval Engineer", is_completed: false },
      { action: "Reach out directly to AI startups, automation agencies, and SaaS consultancies", is_completed: false },
    ],
  },
  {
    month: 8,
    title: "Second Portfolio Angle & Zenin AI Offer Launch",
    phase: "Phase IV: Scale & Income",
    trackFocus: "Track 3 Setup",
    flagshipProject: "Zenin AI B2B Offer & Platform Profile",
    milestoneDescription: "A second distinct portfolio angle broadening proof beyond the support capstone, plus a live Zenin AI offer.",
    xp_reward: 150,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 27,
        learn: "Production hardening: OAuth2/JWT tokens, rate limiting, and conversational memory persistence",
        build: "Extend Knowledge Assistant with multi-tenant auth and conversational memory",
        is_completed: false,
        xp_reward: 50,
      },
      {
        week: 29,
        learn: "Productized service packaging: scoping, deliverables, boundaries, and client onboarding",
        build: "Set up simple Zenin AI portfolio landing page and freelance profile (Upwork/Contra) at $25–40/hr",
        is_completed: false,
        xp_reward: 50,
      },
    ],
    careerActions: [
      { action: "Define narrow Zenin AI offer: 'Custom RAG assistants and support automation agents for small businesses'", is_completed: false },
      { action: "Submit 5 tailored proposals per week on freelance platforms to win first 5-star reviews", is_completed: false },
    ],
  },
  {
    month: 9,
    title: "Open Source Visibility & First Paid Clients",
    phase: "Phase IV: Scale & Income",
    trackFocus: "Track 2 + Track 3 Active",
    flagshipProject: "1–2 Paid Zenin AI Client Projects & Open Source Contribution",
    milestoneDescription: "A public trail of real AI engineering work and first paid freelance revenue.",
    xp_reward: 200,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 31,
        learn: "Open source collaboration: reading large AI codebases, issues, PR etiquette, contributing guidelines",
        build: "Contribute one meaningful PR to an open-source AI/LLM repository (LangGraph, FastAPI, or pgvector tool)",
        is_completed: false,
        xp_reward: 75,
      },
      {
        week: 33,
        learn: "Client delivery excellence: managing expectations, milestones, and gathering video testimonials",
        build: "Deliver first 1–2 paid Zenin AI client projects to standard; document as case studies",
        is_completed: false,
        xp_reward: 100,
      },
    ],
    careerActions: [
      { action: "Publish 2–3 short technical breakdown posts on LinkedIn/X detailing architectures built", is_completed: false },
      { action: "Evaluate incoming Track 2 interviews against Zenin AI agency potential", is_completed: false },
    ],
  },
  {
    month: 10,
    title: "Landing the Role or Converting Real Clients",
    phase: "Phase IV: Scale & Income",
    trackFocus: "Convert",
    flagshipProject: "Signed Role Offer or 2–3 Testimonial Client Projects",
    milestoneDescription: "Either a signed offer (Track 1 internal / Track 2 remote) or a stable freelance pipeline.",
    xp_reward: 250,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 35,
        learn: "Contract negotiation, salary benchmarking for AI engineers, and scope management",
        build: "Deliver active client projects; turn deliverables into reusable boilerplate components",
        is_completed: false,
        xp_reward: 75,
      },
      {
        week: 37,
        learn: "Client retention strategies and expanding monthly support retainers",
        build: "Create client reporting dashboard showing monthly query volume, tokens consumed, and accuracy",
        is_completed: false,
        xp_reward: 75,
      },
    ],
    careerActions: [
      { action: "Prioritize final round interview prep if job offer is imminent", is_completed: false },
      { action: "Track client hours, revenue, and feedback as concrete proof for future rate increases", is_completed: false },
    ],
  },
  {
    month: 11,
    title: "Income Stabilization & Productized Retainers",
    phase: "Phase IV: Scale & Income",
    trackFocus: "Stabilize",
    flagshipProject: "Productized Zenin AI Offer ($50–80/hr)",
    milestoneDescription: "A predictable income source in place (salary, contract, or repeatable agency retainers).",
    xp_reward: 200,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 39,
        learn: "Engineering ramp-up in upgraded role or agency delivery standardization",
        build: "Package most repeatable project into fixed-price productized offer: 'Custom RAG setup — Flat Fee'",
        is_completed: false,
        xp_reward: 75,
      },
      {
        week: 41,
        learn: "Rate expansion psychology and communicating premium value to B2B clients",
        build: "Raise Zenin AI consulting/retainer rates to $50–80/hr equivalent",
        is_completed: false,
        xp_reward: 75,
      },
    ],
    careerActions: [
      { action: "Establish recurring retainer agreements with existing clients for maintenance & model updates", is_completed: false },
      { action: "If employed in new role, keep Zenin AI running part-time as scalable upside", is_completed: false },
    ],
  },
  {
    month: 12,
    title: "Year 1 Review & Scaling to $60K/yr Run-Rate",
    phase: "Phase IV: Scale & Income",
    trackFocus: "Plan Year 2",
    flagshipProject: "Year 1 Retrospective & Year 2 $60K Strategy",
    milestoneDescription: "Documented Year 1 retrospective and Year 2 execution roadmap aimed at $60,000+ total annual income.",
    xp_reward: 300,
    status: "locked",
    is_completed: false,
    weeks: [
      {
        week: 43,
        learn: "Annual technical audit: analyzing strongest competencies and high-value specializations",
        build: "Write comprehensive Year 1 Retrospective: all systems shipped, total revenue earned, key lessons",
        is_completed: false,
        xp_reward: 100,
      },
      {
        week: 45,
        learn: "Year 2 niche strategy: vertical specialization (Healthcare, Legal, Logistics) or deep AI infra",
        build: "Draft Year 2 Scaling Roadmap: target $60K/yr through blended employment + productized Zenin AI",
        is_completed: false,
        xp_reward: 150,
      },
    ],
    careerActions: [
      { action: "Decide primary Year 2 channel based on real empirical data rather than initial assumptions", is_completed: false },
      { action: "Celebrate 12 months of disciplined execution — claim Master AI Implementation Engineer Badge", is_completed: true },
    ],
  },
];
