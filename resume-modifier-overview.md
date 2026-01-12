# Resume Modifier

**A powerful, local-first resume editing application**

🔗 **GitHub:** [https://github.com/Goku007007/resume-creator-modifier](https://github.com/Goku007007/resume-creator-modifier)

---

## Summary

Resume Modifier is a full-stack web application designed to solve the common pain of managing and tailoring multiple resume versions for different job applications. Unlike traditional document editors, this application treats resumes as **structured data (JSON)**, enabling powerful features like programmatic editing, live preview, version control, and intelligent quality analysis.

---

## The Problem It Solves

As a job seeker applying to multiple roles, common challenges include:

- **Each job requires a tailored resume** — different keywords, different emphasis
- **Managing multiple resume versions** becomes a nightmare in Word/Google Docs
- **No live preview** means constant export-and-check cycles
- **ATS optimization** requires tracking which skills are highlighted per role
- **Version control** is non-existent in traditional tools
- **Quality consistency** — hard to maintain professional standards across bullets

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Live Preview** | Two-column WYSIWYG editing with real-time PDF preview |
| **Profile Management** | Create, duplicate, rename, and delete role-specific resume profiles |
| **JSON Patch Support** | Apply merge patches or RFC 6902 operations for bulk programmatic edits |
| **Skills Panel** | Auto-extracted tech stack visualization from all resume sections |
| **Resume Linter** | Built-in quality warnings with scoring system |
| **PDF Export** | One-click pixel-perfect PDF generation via Playwright |
| **Local Storage** | All data stays on your machine using SQLite |
| **Version Snapshots** | Save and restore previous versions with descriptions |
| **DOCX Import** | Import existing resumes from Word documents |
| **Keyboard Navigation** | Click any field in preview to jump directly to the edit form |
| **Fullscreen Preview** | Distraction-free preview mode for final review |

---

## Resume Linter — Quality Analysis

The built-in linter performs intelligent quality checks on your resume content:

### Hard Rules (Errors)
| Rule | Description |
|------|-------------|
| **No First-Person Pronouns** | Detects "I", "me", "my" in bullet points |
| **No Fluff Adjectives** | Flags overused words like "passionate", "hardworking", "team player", "synergy" |
| **No Duplicate Bullets** | Identifies identical bullet points across sections |

### Soft Rules (Warnings)
| Rule | Description |
|------|-------------|
| **Bullet Length Check** | Warns when bullets are too short (<50 chars) or too long (>180 chars) |
| **Action Verb Start** | Ensures bullets begin with strong action verbs (built, developed, designed, etc.) |
| **Quantify Impact** | Suggests adding metrics and numbers to bullet points |
| **Punctuation Consistency** | Checks for uniform punctuation across all bullets |

### Quality Score
The linter calculates a **0-100 quality score** based on rule violations:
- Errors: -10 points each
- Warnings: -5 points each
- Info: -2 points each

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **React 19** | Component-based UI with hooks |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Monaco Editor** | VS Code's editor for JSON editing |

### Backend & Data
| Technology | Purpose |
|------------|---------|
| **SQLite (better-sqlite3)** | Local database for profile storage |
| **Playwright** | Headless browser for pixel-perfect PDF export |
| **Ajv** | JSON Schema validation |
| **fast-json-patch** | RFC 6902 JSON Patch implementation |
| **Mammoth** | DOCX to HTML conversion for imports |
| **UUID** | Unique identifier generation |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Local-first** | No cloud dependencies; complete privacy and offline functionality |
| **Structured data** | Resume stored as JSON enables programmatic manipulation |
| **Profile isolation** | Each role profile is independent and fully customizable |
| **Real-time sync** | Changes reflect instantly in the preview pane |
| **Version snapshots** | Never lose work; restore any previous state |

---

## Component Architecture

```
components/
├── EditorPanel/          # Main editing interface with section tabs
├── ResumePreview/        # Live PDF preview renderer
├── JsonPatchModal/       # Monaco-powered JSON editing modal
├── ProfileSwitcher/      # Profile management dropdown
├── PreviewToolbar/       # Export and view controls
├── FullscreenPreviewModal/ # Distraction-free preview mode
├── ConfirmDialog/        # Reusable confirmation dialogs
└── ChipInput/            # Tag-style input for skills
```

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profiles` | GET | List all profiles |
| `/api/profiles` | POST | Create new profile |
| `/api/profiles/[id]` | GET | Get specific profile |
| `/api/profiles/[id]` | PUT | Update profile |
| `/api/profiles/[id]` | DELETE | Delete profile |
| `/api/export` | POST | Generate PDF from resume data |

---

## Database Operations

The application provides full CRUD operations for profiles:

- `getAllProfiles()` — List all saved profiles
- `getProfile(id)` — Retrieve specific profile
- `createProfile(name, data)` — Create new profile
- `updateProfile(id, data)` — Update existing profile
- `renameProfile(id, name)` — Rename profile
- `deleteProfile(id)` — Delete profile
- `duplicateProfile(id)` — Clone existing profile
- `saveVersion(profileId, data, description)` — Save version snapshot

---

## Project Structure

```
resume-modifier/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main editor page (574 lines)
│   └── api/               # API routes
│       ├── ai/            # AI-assisted features
│       ├── export/        # PDF generation
│       └── profiles/      # Profile CRUD
├── components/            # React components (8 modules)
├── lib/                   # Core utilities
│   ├── db.ts             # SQLite operations
│   ├── linter.ts         # Resume quality analysis
│   ├── patch.ts          # JSON patch logic
│   ├── schema.ts         # JSON schema validation
│   ├── resumeHTML.ts     # HTML template generation
│   └── resumeCSS.ts      # PDF styling
├── types/                 # TypeScript definitions
├── scripts/              # Data import/export scripts
│   ├── import-resumes.js # DOCX import utility
│   ├── seed-profiles.js  # Default profile seeding
│   └── fix-profiles.js   # Database maintenance
└── public/               # Static assets
```

---

## Resume JSON Schema

The application uses a structured JSON format for resume data:

```typescript
interface ResumeJSON {
  profileMeta: {
    profileName: string;      // e.g., "Software Engineer"
    resumeName: string;       // Filename for PDF export
    updatedAt: string;        // ISO timestamp
  };
  basics: {
    name: string;
    email: string;
    phone: string;
    links: Array<{ label: string; url: string }>;
    locationLine: string;
  };
  sections: {
    skills: {
      heading: string;
      groups: Array<{ label: string; items: string[] }>;
    };
    experience: Array<{
      company: string;
      location: string;
      title: string;
      start: string;
      end: string | null;      // null = current position
      bullets: string[];
      tech?: string[];         // Optional tech tags
    }>;
    projects: Array<{
      name: string;
      link?: string;
      bullets: string[];
    }>;
    education: Array<{
      school: string;
      degree: string;
    }>;
  };
  rendering: {
    fontFamily: string;        // e.g., "Calibri"
    fontSize: number;          // e.g., 11
    lineHeight: number;        // e.g., 1.15
    monoFontFamily: string;    // For code snippets
    pageSize: "LETTER" | "A4";
    density: "COMPACT" | "NORMAL" | "SPACIOUS";
  };
}
```

---

## JSON Patch Examples

### Merge Patch (Simple Updates)
```json
{
  "basics": {
    "name": "New Name"
  },
  "sections": {
    "skills": {
      "groups": [
        { "label": "Languages", "items": ["Python", "TypeScript", "SQL"] }
      ]
    }
  }
}
```

### RFC 6902 Patch (Precise Operations)
```json
[
  { "op": "replace", "path": "/basics/name", "value": "New Name" },
  { "op": "add", "path": "/sections/experience/0/bullets/-", "value": "New achievement" },
  { "op": "remove", "path": "/sections/projects/2" }
]
```

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Goku007007/resume-creator-modifier.git
cd resume-creator-modifier

# Install dependencies
npm install

# Install Playwright browsers (for PDF export)
npx playwright install chromium

# Start development server
./start.sh
# OR
npm run dev
```

The app will be available at `http://localhost:3001`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `./start.sh` | Development startup script |

---

## Data Storage

All data is stored locally in SQLite:
```
~/Library/Application Support/resume-modifier/data.db
```

Database tables:
- `profiles` — Resume profiles with JSON content
- `versions` — Version snapshots for each profile
- `settings` — Application settings

---

## Use Cases

1. **Job Seekers** — Maintain multiple tailored resumes for different roles
2. **Developers** — Use JSON patches to programmatically update resumes
3. **Career Changers** — Easily reframe experience for different industries
4. **ATS Optimization** — Track and manage keywords per role profile
5. **Version Control** — Never lose work with automatic snapshots

---

## Future Roadmap

- [ ] AI-powered bullet point suggestions
- [ ] ATS keyword analysis and scoring
- [ ] Resume comparison/diff view
- [ ] Cloud sync option (opt-in)
- [ ] Template library

---

## License

MIT

---

**Built by [Gokul Nandakumar](https://github.com/Goku007007)**
