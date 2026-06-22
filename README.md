# EduStack – AI Course Generator

A full-stack web application that lets authenticated users generate personalized coding courses using Google Gemini AI, complete with chapter-by-chapter content, embedded YouTube videos, and social sharing.

---

## Features

- **Three-step course creation wizard** — select a category, describe your topic, configure difficulty, chapter count, and duration
- **AI-generated course outlines** — Gemini produces a full course structure (name, description, chapters) from a single prompt
- **AI-generated chapter content** — each chapter gets structured subtopics, detailed explanations, and code examples
- **YouTube video integration** — up to three relevant YouTube videos are embedded per chapter via the YouTube Data API v3
- **Course banner uploads** — drag-and-drop image upload with Firebase Storage; falls back to a placeholder automatically
- **Draft → Published workflow** — courses stay in draft until all chapters are generated, then become publicly viewable
- **Explore page** — browse all published courses created by any user
- **Social sharing** — share finished courses via WhatsApp, Email, or LinkedIn directly from the finish screen
- **Responsive layout** — mobile sidebar, skeleton loading states throughout
- **Free tier course limit** — users can create up to 5 courses; an upgrade page is present (not yet implemented)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Authentication | Clerk |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Drizzle ORM |
| AI | Google Gemini 1.5 Flash |
| Video | YouTube Data API v3 |
| File Storage | Firebase Storage |
| Animations | Motion (Framer Motion successor) |
| Icons | Lucide React + React Icons |

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Accounts and API keys for: **Clerk**, **Neon**, **Google AI Studio**, **Google Cloud** (YouTube), **Firebase**

---

## Installation

```bash
git clone <your-fork-url>
cd ai-course-generator-main
npm install
```

---

## Environment Variables

Copy the example file and fill in every value before starting the dev server.

```bash
cp .env.example .env.local
```

Open `.env.local` and set all variables. Each one is annotated with exactly where to find the value:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key for client-side auth |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key for server-side middleware |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Route for the sign-in page (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Route for the sign-up page (`/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | Redirect after sign-in (`/dashboard`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | Redirect after sign-up (`/dashboard`) |
| `NEXT_PUBLIC_DB_CONNECTION_STRING` | Yes | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Yes | Google Gemini API key |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase project API key for Storage |
| `NEXT_PUBLIC_HOST_NAME` | Yes | Base URL for course share links (e.g. `http://localhost:3000`) |

### How to get each key

**Clerk** — [clerk.com](https://clerk.com) → Create application → Dashboard → API Keys

**Neon** — [neon.tech](https://neon.tech) → Create project → Connection Details → copy the `postgresql://...` string

**Gemini** — [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) → Create API key

**YouTube** — [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Enable *YouTube Data API v3* → Credentials → Create API Key

**Firebase** — [Firebase Console](https://console.firebase.google.com) → Project Settings → General → Your Apps → Web app → SDK config → copy `apiKey`

---

## Database Setup

This project uses Drizzle ORM with a Neon PostgreSQL database. After filling in `NEXT_PUBLIC_DB_CONNECTION_STRING`, push the schema to create the tables:

```bash
npm run db:push
```

This creates two tables:

- **`courselist`** — stores course metadata (title, category, level, banner, publish state, owner)
- **`chapters`** — stores per-chapter AI content and video IDs, keyed by `courseId`

To open the Drizzle visual editor:

```bash
npm run db:studio
```

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The landing page is publicly accessible. Routes under `/dashboard` and `/create-course` are protected by Clerk middleware — you must be signed in.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:generate` | Generate a new Drizzle migration |
| `npm run db:studio` | Open Drizzle Studio (visual DB editor) |

---

## Project Structure

```
ai-course-generator-main/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/   # Clerk-hosted sign-in page
│   │   └── sign-up/[[...sign-up]]/   # Clerk-hosted sign-up page
│   ├── _components/                  # Landing page: Header, Hero, Footer
│   ├── _context/                     # React contexts (user course list, course wizard input)
│   ├── _shared/                      # Shared data (category list)
│   ├── course/[courseId]/
│   │   ├── page.jsx                  # Public course overview
│   │   └── start/                    # Interactive chapter-by-chapter player
│   ├── create-course/
│   │   ├── page.jsx                  # Three-step creation wizard
│   │   ├── layout.jsx                # Wizard layout with header
│   │   └── [courseId]/
│   │       ├── page.jsx              # Course layout review + content generation
│   │       ├── finish/               # Post-generation share screen
│   │       └── _components/          # CourseBasicInfo, ChapterList, CourseDetail, editors
│   ├── dashboard/
│   │   ├── page.jsx                  # User's course list
│   │   ├── layout.jsx                # Dashboard layout with sidebar
│   │   ├── explore/                  # Browse all published courses
│   │   ├── upgrade/                  # Upgrade page (placeholder — not implemented)
│   │   └── logout/                   # Clerk sign-out confirmation dialog
│   │       └── _components/          # Header, SideBar, MobileSideBar, CourseCard, etc.
│   ├── layout.js                     # Root layout — wraps entire app in ClerkProvider
│   ├── page.js                       # Landing page
│   └── globals.css
├── components/
│   └── ui/                           # shadcn/ui components (Button, Dialog, Toast, etc.)
├── configs/
│   ├── AiModel.jsx                   # Gemini 1.5 Flash chat sessions
│   ├── db.jsx                        # Neon + Drizzle database client
│   ├── firebaseConfig.jsx            # Firebase Storage initialisation
│   ├── schema.jsx                    # Drizzle table definitions
│   └── service.jsx                   # YouTube Data API v3 helper
├── drizzle/                          # Auto-generated SQL migration files
├── hooks/
│   ├── use-mobile.jsx
│   └── use-toast.js
├── lib/
│   └── utils.js                      # Tailwind class merge utility
├── public/                           # Static assets (images, icons)
├── drizzle.config.js
├── middleware.js                      # Clerk route protection
├── next.config.mjs
├── tailwind.config.js
└── .env.example                      # Environment variable template
```

---

## How It Works

### Course Creation Flow

1. **Select Category** — choose from Programming, Development, Interview, Deployment, or a custom category
2. **Topic & Description** — enter the course topic and an optional description
3. **Options** — set difficulty level (Basic / Intermediate / Advance), whether to include YouTube videos, number of chapters (1–20), and total duration
4. **Generate Layout** — Gemini generates a structured JSON outline (course name, description, chapter list) and saves it as a draft to the database
5. **Review & Edit** — review the generated outline; edit the title, description, or upload a banner image
6. **Generate Content** — for each chapter, Gemini generates subtopics with explanations and code examples; the YouTube API fetches up to three relevant videos per chapter
7. **Finish** — the course is published; a shareable URL is displayed with one-click copy and social share buttons

### Course Viewing Flow

- Public course overview at `/course/[courseId]` (requires the course to be published)
- Full chapter player at `/course/[courseId]/start` with a collapsible sidebar chapter list

---

## Future Improvements

The following features are scaffolded or partially present but not yet implemented:

- **Upgrade / subscription system** — the `/dashboard/upgrade` page exists but renders a placeholder only
- **Course limit enforcement** — the sidebar shows `X out of 5 courses created` but there is no server-side enforcement of the limit
- **Custom category icon** — the "Others" category in `CategoryList.jsx` currently uses the interview icon; a dedicated icon would be cleaner
- **Remove leftover social links** — `Footer.jsx` contains the original developer's personal Facebook, Instagram, LinkedIn, and GitHub links and should be updated to reflect this fork
- **Remove leftover branding** — `Header.jsx` and `SideBar.jsx` reference `seedofocode_logo.png`; replace with the EduStack logo
- **Remove leftover share text** — the finish screen's WhatsApp, Email, and LinkedIn share messages still reference "SeedOfCode"; update them to "EduStack"
- **Clean up remaining debug logs** — `UserCourseList.jsx` and `explore/page.jsx` contain `console.log("DEBUG: ...")` calls left from development
- **Add a pagination system** to the Explore page for large course catalogs
- **Add a search / filter system** to the Explore page

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

---

> No license file is present in this repository. All rights reserved by the respective authors until a license is added.
