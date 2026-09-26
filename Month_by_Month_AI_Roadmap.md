**ZENIN AI  ·  PERSONAL**

**Month-by-Month Roadmap**

AI Implementation Engineer track, built on the 1Life plan · \~15 hrs/week · Target: \$60K/yr by Year 2

# **How to Read This Plan**

This expands the 1Life six-month curriculum week by week, then extends it through Month 12 by layering in the job and income tracks discussed earlier: an internal move at your current employer (Track 1), remote junior AI roles (Track 2), and Zenin AI productized services (Track 3). Months 1–6 are almost entirely Track 1 groundwork — build the proof first. Career actions get heavier from Month 5 onward.

Default week: 6 hrs technical study, 3 hrs coding exercises, 4 hrs main project, 1 hr documentation, 1 hr career/business work \= 15 hrs. On a heavy university week, drop to 10–12 hrs; on a light week, push to 18–20. Never cut the coding block.

# **Months 1–2: Foundations**

## **Month 1 — Python \+ Git Reset**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 1 | Python syntax, variables, conditionals, loops, functions, lists/dicts/sets/tuples, comprehensions, exceptions | CLI Expense Tracker: add/delete/categorize expenses, show totals, save to JSON |
| 2 | Modules, packages, virtual environments, pip, file handling, JSON/CSV, datetime, type hints, classes, basic testing | Expense Tracker v2: CSV export, filtering, date ranges, unit tests, configuration |
| 3 | Git commits, branches, merge/rebase basics, pull requests, .gitignore, env variables, HTTP methods, status codes, REST APIs | API Data Collector: Python client that consumes a public API, validates and transforms data, saves JSON |
| 4 | SQL and PostgreSQL: tables, keys, SELECT/WHERE/JOIN/GROUP BY, INSERT/UPDATE/DELETE, indexes, transactions, schema design | Convert the API project into API → Python → PostgreSQL, with a proper schema |

**Milestone:** A GitHub repo with README, src/, tests/ for the expense tracker, plus a database-backed API project.

**Career / income actions this month:**

* Tell your manager or team lead you are studying backend and AI engineering — this plants the seed for Track 1 later.

* Set up your GitHub profile properly (bio, pinned repos placeholder).

**Track focus:** *Track 1 groundwork*

## **Month 2 — Backend / API Engineer**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 5 | FastAPI structure, routes, request/response models, Pydantic, validation, query/path parameters, error handling, docs | Customer Ticket API: POST/GET/PATCH/DELETE /tickets endpoints |
| 6 | Authentication concepts, middleware, dependency injection, async basics, API architecture, logging, testing APIs | PROJECT 1 — Support Ticket Backend: customer records, tickets, statuses, priority, search, pagination, PostgreSQL, FastAPI, tests |

**Milestone:** Polished GitHub project: README, architecture diagram, API docs, setup instructions, tests, screenshots. This is your first serious portfolio piece.

**Career / income actions this month:**

* If your job has any internal tool with a rough workflow (tickets, requests, approvals), mentally note it as a future Track 1 pitch.

**Track focus:** *Track 1 groundwork*

# **Months 3–4: AI Core**

## **Month 3 — LLM Fundamentals \+ First AI API**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 7 | Tokens/context, temperature, system/user instructions, structured outputs, hallucination, prompt design, model selection, cost/latency | Python LLM CLI: input a customer complaint, output structured JSON (category, priority, summary, suggested\_action) |
| 8 | API authentication, structured outputs, tool/function calling, retries, timeouts, error handling, token/cost tracking, model abstraction | Ticket Intelligence API: FastAPI → LLM → structured classification → PostgreSQL |

**Milestone:** A working API that classifies, summarizes, and routes a support ticket automatically.

**Career / income actions this month:**

* Draft one sentence describing this project in business terms (e.g. "auto-triages support tickets") — you will reuse this in outreach and CV copy later.

**Track focus:** *Track 1 groundwork*

## 

## **Month 4 — RAG \+ Real AI Applications**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 9 | Embeddings, semantic similarity, chunking, metadata, retrieval, context construction, why naive RAG fails | Tiny document search system: 10–20 documents, return most relevant chunks for a question |
| 10 | Vector columns, pgvector, similarity search, metadata filtering, retrieval quality (keep everything in PostgreSQL) | Documents → chunk → embed → PostgreSQL \+ pgvector → retrieve pipeline |
| 11 | Assemble the pieces into a full RAG chatbot with citations and refusal behavior | PROJECT 2 — Company Knowledge Assistant: upload docs, chunk, embed, retrieve, answer, cite sources, refuse when unsure |
| 12 | Retrieval failures, hallucinations, chunk-size tradeoffs, top-k, relevance, grounded answers, evaluation datasets | Build 50–100 test questions with expected answers, retrieved chunks, actual answers, correct/incorrect — your first AI evaluation dataset |

**Milestone:** A working RAG assistant framed as an internal company support tool (not a generic "chat with PDF"), backed by an evaluation dataset.

**Career / income actions this month:**

* Show the Knowledge Assistant demo informally to a colleague or manager — this is your first internal proof point for Track 1\.

* If comfortable, ask if any team has documents/FAQs that could use something like this.

**Track focus:** *Track 1 pitch begins*

# **Months 5–6: Automation, Agents, Capstone**

## **Month 5 — Automation \+ Agents**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 13 | n8n: triggers, nodes, HTTP requests, webhooks, credentials, branching, expressions, error handling, retries | Form submission → n8n → LLM → classify → PostgreSQL → notification |
| 14 | Webhooks, CRM-style workflows, scheduling, conditional routing, external APIs, human approval | Lead Qualification Automation: website lead → n8n → AI qualification → score → save → notify sales |
| 15 | Tool/function calling in your own code: get\_customer(), create\_ticket(), search\_knowledge(), send\_email(), update\_status() | AI Support Agent v1 — the model chooses tools, your application executes them |
| 16 | Approval workflows, confidence thresholds, escalation, failure recovery, audit logs | Add human-in-the-loop: AI drafts a response, routes to send or human review based on confidence |

**Milestone:** An AI support agent that knows when not to act autonomously — more valuable than a flashy chatbot, and a strong Zenin AI service prototype.

**Career / income actions this month:**

* Pitch Track 1 formally: propose one internal automation pilot to your manager, using the lead-qualification or support-agent pattern.

* If Track 1 is not viable at your job, begin drafting your narrow offer statement for Track 3 (Zenin AI) and Track 2 CV positioning.

**Track focus:** *Track 1 pitch / Track 3 setup*

## **Month 6 — Production Engineering \+ Capstone**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 17 | LangGraph only now: state, nodes, edges, routing, persistence, retries, human interrupts | Turn the support agent into an explicit graph: receive → classify → retrieve → decide → answer/escalate/create ticket → evaluate |
| 18 | Testing: pytest, unit/integration/API tests; AI testing: expected outputs, regression datasets, hallucination checks, tool-call validation | Automated test suite: run 100 test questions through the agent, score, generate a report |
| 19 | Docker: images, containers, Dockerfile, env variables, Compose, networking, volumes | Containerize FastAPI, PostgreSQL, and the AI service |
| 20 | Logging, monitoring, secrets, rate limits, retries, timeouts, background jobs, basic cloud deployment | Make the support automation system deployable by someone other than you |
| 21–23 | Capstone architecture and reliability work | PROJECT 3 — AI Customer Operations Platform: FastAPI, PostgreSQL, pgvector, LLM, RAG, tool calling, n8n, human approval, evaluation, auth, logging. Deploy it with Docker, write a production README, architecture diagram, API docs, and a demo video |
| 24 | Portfolio and CV assembly | Pin 4 repos on GitHub: AI Customer Operations Platform, Company Knowledge Assistant, Support Ticket Backend, AI Evaluation Harness. Write outcome-based CV bullets |

**Milestone:** A deployed, documented capstone with 100+ evaluation cases and a demo video — your flagship portfolio piece for both Track 1 and Track 2\.

**Career / income actions this month:**

* Have the "am I ready to ask for more" conversation with your manager, or start quietly applying to remote AI Automation/Implementation roles (Track 2\) in parallel.

* Publish a short LinkedIn post about the capstone.

**Track focus:** *Track 1 ask / Track 2 launch*

# 

# **Months 7–9: Positioning and First Income**

## **Month 7 — Applications \+ Networking**

| Week | Learn | Build |
| :---- | :---- | :---- |
| 25–26 | Interview prep: RAG, hallucination causes, tool calling, evaluation, API key security, retries, scaling, why PostgreSQL, why n8n, where humans stay in the loop. Business prep: what problem your system solves, manual work removed, failure handling, pricing | No new build — refine the capstone based on feedback from mock interviews or peer review |

**Milestone:** You can clearly explain both the technical and business case for your capstone.

**Career / income actions this month:**

* Apply to Track 2 roles: AI Automation Engineer, AI Implementation Engineer, AI Integration Engineer, AI Workflow Engineer, LLM Evaluation Engineer, AI QA Automation Engineer.

* Reach out directly to AI startups, automation agencies, SaaS companies, and consultancies — not just job boards.

* If Track 1 conversations are progressing, keep pushing for a formalized role change or raise.

**Track focus:** *Track 2 applications*

## **Month 8 — Second Portfolio Angle \+ Zenin AI Offer**

| Week | Learn | Build |
| :---- | :---- | :---- |
| Weeks 27–30 | Pick one production-hardening topic you skipped (JWT/OAuth basics, rate limiting, or a second agent pattern with memory/persistence) | Rebuild or extend one earlier project to production standard, OR build a second distinct project type (e.g. an internal tool for invoice processing or lead qualification) |

**Milestone:** A second, distinct portfolio project, documented with a README and short demo video, broadening your proof beyond the capstone.

**Career / income actions this month:**

* Define your narrow Zenin AI offer (e.g. "I build custom RAG assistants and support-automation agents for small businesses").

* Set up a simple portfolio site and one freelance platform profile (Upwork/Contra) at an entry rate (\$25–40/hr) to win first reviews.

* Continue Track 2 applications; note response rates.

**Track focus:** *Track 3 setup*

## 

## **Month 9 — Open Work, Visibility, First Clients**

| Week | Learn | Build |
| :---- | :---- | :---- |
| Weeks 31–34 | Contribute one small PR to an open-source AI/LLM repo. Publish 2–3 short technical posts on what you built and why | Apply what you learn from outreach responses to refine your offer and pricing |

**Milestone:** A small public trail of work (PR \+ posts) and the start of a "ships real AI systems" presence.

**Career / income actions this month:**

* Apply daily to Track 2 roles and do direct outreach for Track 3 clients in parallel.

* Aim for 1–2 small paid Zenin AI projects this month, even at lower rates, for testimonials.

* If a Track 2 offer arrives, evaluate it against your job and Zenin AI income potential before accepting.

**Track focus:** *Track 2 \+ Track 3 active*

# **Months 10–12: Convert and Scale**

## **Month 10 — Land the Role or the First Real Clients**

| Week | Learn | Build |
| :---- | :---- | :---- |
| Weeks 35–38 | No new curriculum — this month is applications, interviews, and client delivery | Deliver any active Zenin AI project to a high standard; use it as a case study immediately |

**Milestone:** Either a signed offer (Track 1 or Track 2\) or 2–3 completed Zenin AI projects with testimonials.

**Career / income actions this month:**

* If a job offer is close, prioritize interview prep over new outreach.

* If freelancing is your main channel this month, track hours, income, and client feedback as evidence for future rate increases.

**Track focus:** *Convert*

## **Month 11 — Stabilize Income**

| Week | Learn | Build |
| :---- | :---- | :---- |
| Weeks 39–42 | If employed: onboarding and ramping in the new or upgraded role. If freelancing: continue outreach and delivery | Package your most repeatable project type into a fixed-price Zenin AI offer (e.g. "RAG assistant setup — flat fee") |

**Milestone:** A stable income source in place — salary, contract, or a repeatable freelance offer — with a clear next 90-day plan.

**Career / income actions this month:**

* With 2–3 completed projects and testimonials, raise Zenin AI rates (\$50–80/hr equivalent).

* If employed, keep Zenin AI running part-time as Track 3 upside rather than your main bet.

**Track focus:** *Stabilize*

## **Month 12 — Review and Set Year 2 Targets**

| Week | Learn | Build |
| :---- | :---- | :---- |
| Weeks 43–46 | Review the full year: what shipped, what income arrived, what skills are strongest | No new build — write a short retrospective and a Year 2 plan (one niche to go deeper in: a vertical like legal/healthcare, or a technical layer like evaluation or fine-tuning) |

**Milestone:** A documented Year 1 retrospective and a Year 2 plan aimed at \$60K+ total income through salary and/or Zenin AI.

**Career / income actions this month:**

* Decide your Year 2 primary channel (job, freelance, or a blended model) based on what actually worked this year, not what you originally assumed would work.

**Track focus:** *Plan Year 2*

# **Income Checkpoints**

| By end of | Realistic income state |
| :---- | :---- |
| Month 6 | Still on current salary. Zero or near-zero AI/freelance income — this is expected. |
| Month 9 | First small Zenin AI payments (testimonial-stage), or early Track 2 interviews. |
| Month 12 | Either a new/upgraded job role, or a repeatable Zenin AI income stream — often both, part-time. |
| Year 2 | \$60K/yr total income is realistic if either a remote/upgraded role or a productized Zenin AI offer has taken hold. |

# **Non-Negotiables**

* Every month ends with something built and shipped, not just notes.

* Never exceed \~40% of learning time on watching/reading; the rest becomes code.

* Protect the coding block like a work meeting — cut study time before build time on a busy week.

* Track 1 (internal move) is your highest-probability path; treat Tracks 2 and 3 as parallel, not primary, until Month 6\.