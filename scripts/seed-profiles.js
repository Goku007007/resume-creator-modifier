// Final script to clear DB and import parsed resumes
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(os.homedir(), 'Library', 'Application Support', 'resume-modifier', 'data.db');
const PARSED_RESUMES_PATH = '/Users/gokulananth/Downloads/Vibe Coding Projects/resume-modifier/scripts/parsed-resumes.json';

function main() {
    console.log('Opening database at:', DB_PATH);

    // Ensure directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = new Database(DB_PATH);

    // Create table if not exists
    db.exec(`
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
    `);

    // Clear existing profiles
    const deleteResult = db.prepare('DELETE FROM profiles').run();
    console.log(`Deleted ${deleteResult.changes} existing profiles`);

    // Load parsed resumes
    const parsedResumes = JSON.parse(fs.readFileSync(PARSED_RESUMES_PATH, 'utf-8'));
    console.log(`Loaded ${parsedResumes.length} parsed resumes`);

    // Insert each resume as a profile
    const insert = db.prepare(`
        INSERT INTO profiles (id, name, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    for (const resume of parsedResumes) {
        const id = uuidv4();
        const name = resume.profileMeta.profileName;
        const now = new Date().toISOString();

        insert.run(id, name, JSON.stringify(resume), now, now);
        console.log(`  Created profile: ${name}`);
        console.log(`    Skills: ${resume.sections.skills.groups.length} groups`);
        console.log(`    Experience: ${resume.sections.experience.length} entries`);
        console.log(`    Projects: ${resume.sections.projects.length} entries`);
        console.log(`    Education: ${resume.sections.education.length} entries`);
    }

    db.close();
    console.log(`\nDone! Imported ${parsedResumes.length} profiles`);
}

main();
