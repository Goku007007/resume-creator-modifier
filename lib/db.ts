import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { ResumeJSON, DEFAULT_RESUME } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

// Database path - uses Application Support on macOS
function getDbPath(): string {
    const appDir = path.join(os.homedir(), 'Library', 'Application Support', 'resume-modifier');
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }
    return path.join(appDir, 'data.db');
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!db) {
        db = new Database(getDbPath());
        initDb(db);
    }
    return db;
}

function initDb(database: Database.Database) {
    database.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

    // Seed default profiles if none exist
    const count = database.prepare('SELECT COUNT(*) as count FROM profiles').get() as { count: number };
    if (count.count === 0) {
        seedDefaultProfiles(database);
    }
}

function seedDefaultProfiles(database: Database.Database) {
    const profiles = [
        { name: 'Full-Stack', data: DEFAULT_RESUME },
        { name: 'Data Engineering', data: createDataEngineeringProfile() },
        { name: 'Cloud Engineering', data: createCloudEngineeringProfile() },
        { name: 'Automation/Integration', data: createAutomationProfile() },
    ];

    const insert = database.prepare(`
    INSERT INTO profiles (id, name, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

    for (const profile of profiles) {
        const now = new Date().toISOString();
        insert.run(uuidv4(), profile.name, JSON.stringify(profile.data), now, now);
    }
}

function createDataEngineeringProfile(): ResumeJSON {
    return {
        ...DEFAULT_RESUME,
        profileMeta: {
            profileName: 'Data Engineering',
            resumeName: 'Gokul_Nandakumar_Data_Engineering',
            updatedAt: new Date().toISOString(),
        },
        sections: {
            ...DEFAULT_RESUME.sections,
            skills: {
                heading: 'Skills',
                groups: [
                    { label: 'Languages', items: ['Python', 'SQL', 'TypeScript', 'Spark SQL'] },
                    { label: 'Data Engineering', items: ['Apache Airflow', 'dbt', 'Delta Lake', 'Snowflake', 'BigQuery'] },
                    { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'DuckDB', 'Redis'] },
                    { label: 'Cloud', items: ['Azure (Synapse, Data Factory)', 'AWS (S3, Glue, Redshift)', 'GCP (BigQuery, GCS)'] },
                    { label: 'Tools', items: ['Docker', 'Git', 'CI/CD', 'Terraform', 'GitHub Actions'] },
                    { label: 'Cert', items: ['AWS Certified Solutions Architect - Associate'] },
                ],
            },
        },
    };
}

function createCloudEngineeringProfile(): ResumeJSON {
    return {
        ...DEFAULT_RESUME,
        profileMeta: {
            profileName: 'Cloud Engineering',
            resumeName: 'Gokul_Nandakumar_Cloud_Engineering',
            updatedAt: new Date().toISOString(),
        },
        sections: {
            ...DEFAULT_RESUME.sections,
            skills: {
                heading: 'Skills',
                groups: [
                    { label: 'Cloud Platforms', items: ['Azure', 'AWS', 'GCP'] },
                    { label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines'] },
                    { label: 'DevOps', items: ['GitHub Actions', 'Azure DevOps', 'Jenkins', 'GitLab CI'] },
                    { label: 'Languages', items: ['Python', 'TypeScript', 'Bash', 'SQL'] },
                    { label: 'Monitoring', items: ['Prometheus', 'Grafana', 'Azure Monitor', 'CloudWatch'] },
                    { label: 'Cert', items: ['AWS Certified Solutions Architect - Associate'] },
                ],
            },
        },
    };
}

function createAutomationProfile(): ResumeJSON {
    return {
        ...DEFAULT_RESUME,
        profileMeta: {
            profileName: 'Automation/Integration',
            resumeName: 'Gokul_Nandakumar_Automation',
            updatedAt: new Date().toISOString(),
        },
        sections: {
            ...DEFAULT_RESUME.sections,
            skills: {
                heading: 'Skills',
                groups: [
                    { label: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL'] },
                    { label: 'Automation', items: ['Selenium', 'Playwright', 'Apache Airflow', 'Zapier', 'n8n'] },
                    { label: 'APIs', items: ['RESTful APIs', 'GraphQL', 'OAuth', 'Webhooks', 'Stripe', 'Twilio'] },
                    { label: 'Backend', items: ['FastAPI', 'Django', 'Node.js', 'Express'] },
                    { label: 'Tools', items: ['Docker', 'Git', 'pytest', 'Jest', 'GitHub Actions'] },
                    { label: 'Cert', items: ['AWS Certified Solutions Architect - Associate'] },
                ],
            },
        },
    };
}

// Profile CRUD operations
export interface ProfileRecord {
    id: string;
    name: string;
    content: ResumeJSON;
    created_at: string;
    updated_at: string;
}

export function getAllProfiles(): { id: string; name: string }[] {
    const db = getDb();
    const rows = db.prepare('SELECT id, name FROM profiles ORDER BY created_at').all() as { id: string; name: string }[];
    return rows;
}

export function getProfile(id: string): ProfileRecord | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id) as { id: string; name: string; content: string; created_at: string; updated_at: string } | undefined;
    if (!row) return null;
    return {
        ...row,
        content: JSON.parse(row.content),
    };
}

export function createProfile(name: string, data: ResumeJSON): string {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare('INSERT INTO profiles (id, name, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(
        id,
        name,
        JSON.stringify(data),
        now,
        now
    );
    return id;
}

export function updateProfile(id: string, data: ResumeJSON): void {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare('UPDATE profiles SET content = ?, updated_at = ? WHERE id = ?').run(
        JSON.stringify(data),
        now,
        id
    );
}

export function renameProfile(id: string, name: string): void {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare('UPDATE profiles SET name = ?, updated_at = ? WHERE id = ?').run(name, now, id);
}

export function deleteProfile(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM profiles WHERE id = ?').run(id);
}

export function duplicateProfile(id: string): string | null {
    const original = getProfile(id);
    if (!original) return null;
    const newName = `${original.name} (Copy)`;
    return createProfile(newName, original.content);
}

// Version snapshots
export function saveVersion(profileId: string, data: ResumeJSON, description?: string): string {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare('INSERT INTO versions (id, profile_id, content, created_at, description) VALUES (?, ?, ?, ?, ?)').run(
        id,
        profileId,
        JSON.stringify(data),
        now,
        description || null
    );
    return id;
}

// Settings
export function getSetting(key: string): string | null {
    const db = getDb();
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
    return row?.value || null;
}

export function setSetting(key: string, value: string): void {
    const db = getDb();
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}
