# Resume Modifier

A local-first resume editing application with live preview, profile management, and PDF export.

## Features

- **Live Preview**: Two-column layout with real-time resume preview
- **Structured Editing**: Edit basics, skills, experience, projects, and education sections
- **Profile Management**: Create, duplicate, rename, and delete role profiles
- **JSON Patch**: Paste JSON to update resume data (merge patch or RFC 6902)
- **PDF Export**: Download resume as PDF via Playwright
- **Resume Linter**: Automatic quality scoring and warnings
- **Local Storage**: All data stored locally in SQLite

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers (for PDF export)
npx playwright install chromium

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Requirements

- Node.js 18+
- macOS (tested), Linux, or Windows
- Times New Roman font (pre-installed on macOS)

## Fonts

The resume renderer uses:
- **Primary**: Times New Roman (serif)
- **Monospace fallback**: Geist Mono → Andale Mono → system monospace

Times New Roman is pre-installed on macOS. On Linux, install with:
```bash
# Ubuntu/Debian
sudo apt-get install ttf-mscorefonts-installer

# Fedora
sudo dnf install mscore-fonts
```

## Adding New Profiles

1. Click the profile dropdown in the top bar
2. Select "+ New Profile" or "⧉ Duplicate Profile"
3. Rename the profile as needed
4. Edit the content in the right panel

## JSON Paste/Patch

Click the "JSON" button in the top bar to open the JSON editor.

### Merge Patch (simple)
Paste a partial JSON object to merge with current data:
```json
{
  "basics": {
    "name": "New Name"
  }
}
```

### JSON Patch (RFC 6902)
Paste an array of operations for precise edits:
```json
[
  {"op": "replace", "path": "/basics/name", "value": "New Name"},
  {"op": "add", "path": "/sections/experience/0/bullets/-", "value": "New bullet point"}
]
```

## Data Storage

Data is stored in:
```
~/Library/Application Support/resume-modifier/data.db
```

## Sample Profiles

The app comes with 4 pre-seeded profiles:
- **Full-Stack** (default)
- **Data Engineering**
- **Cloud Engineering**
- **Automation/Integration**

## Resume JSON Schema

```typescript
{
  profileMeta: {
    profileName: string,
    resumeName: string,
    updatedAt: string
  },
  basics: {
    name: string,
    email: string,
    phone: string,
    links: [{ label: string, url: string }]
  },
  sections: {
    skills: {
      heading: string,
      groups: [{ label: string, items: string[] }]
    },
    experience: [{
      company: string,
      location: string,
      title: string,
      start: string,
      end: string | null,
      bullets: string[]
    }],
    projects: [{
      name: string,
      link?: string,
      bullets: string[]
    }],
    education: [{
      school: string,
      degree: string
    }]
  },
  rendering: {
    fontFamily: string,
    monoFontFamily: string,
    pageSize: "LETTER" | "A4",
    density: "COMPACT" | "NORMAL" | "SPACIOUS"
  }
}
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (for JSON)
- **Database**: SQLite (better-sqlite3)
- **PDF Export**: Playwright
- **Validation**: Ajv (JSON Schema)
- **Patching**: fast-json-patch

## License

MIT
