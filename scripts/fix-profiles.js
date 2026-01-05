// Script to fix known issues in parsed profiles
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

const DB_PATH = path.join(os.homedir(), 'Library', 'Application Support', 'resume-modifier', 'data.db');

// Fix known skill label issues
const SKILL_LABEL_FIXES = {
    'Databricks Tools': 'Tools',
    'GitHub Actions Systems & Operations': 'Systems & Operations',
    'Prometheus Certifications': 'Certifications',
    'Associate AI': 'AI - Assisted Dev & API',
    'MySQLConcepts': 'Concepts',
    'Spark Databases': 'Databases',
    'Cassandra Concepts': 'Concepts',
    'Scrum Certifications': 'Certifications',
    'Java Frameworks & Tools': 'Frameworks & Tools',
    'Funnel Analysis Technical': 'Technical',
    'Airflow Marketing Concepts': 'Marketing Concepts',
};

// Merge duplicate labels
function mergeSkillGroups(groups) {
    const merged = new Map();

    for (const group of groups) {
        let label = group.label;

        // Apply fixes
        if (SKILL_LABEL_FIXES[label]) {
            label = SKILL_LABEL_FIXES[label];
        }

        if (merged.has(label)) {
            // Merge items, avoiding duplicates
            const existing = merged.get(label);
            for (const item of group.items) {
                if (!existing.items.includes(item)) {
                    existing.items.push(item);
                }
            }
        } else {
            merged.set(label, { label, items: [...group.items] });
        }
    }

    return Array.from(merged.values());
}

function main() {
    console.log('Opening database at:', DB_PATH);
    const db = new Database(DB_PATH);

    const profiles = db.prepare('SELECT id, name, content FROM profiles').all();
    console.log(`Found ${profiles.length} profiles to fix\n`);

    const update = db.prepare('UPDATE profiles SET content = ?, updated_at = ? WHERE id = ?');

    for (const profile of profiles) {
        const content = JSON.parse(profile.content);
        console.log(`Fixing: ${profile.name}`);

        // Fix skills
        const originalCount = content.sections.skills.groups.length;
        content.sections.skills.groups = mergeSkillGroups(content.sections.skills.groups);
        const newCount = content.sections.skills.groups.length;
        console.log(`  Skills: ${originalCount} -> ${newCount} groups`);

        // Fix Systems Engineer education if needed
        if (profile.name === 'Systems Engineer' && content.sections.education.length < 2) {
            content.sections.education = [
                { school: 'Illinois Institute of Technology', degree: 'Master of Information Technology' },
                { school: 'SREC', degree: 'Bachelor of Computer Science and Engineering' }
            ];
            console.log(`  Fixed education: Added missing SREC entry`);
        }

        // Remove company name trailing commas
        for (const exp of content.sections.experience) {
            exp.company = exp.company.replace(/,\s*$/, '');
        }

        // Update
        update.run(JSON.stringify(content), new Date().toISOString(), profile.id);

        // Show final skills
        console.log(`  Final skills:`);
        for (const g of content.sections.skills.groups) {
            console.log(`    - ${g.label}: ${g.items.length} items`);
        }
        console.log('');
    }

    db.close();
    console.log('Done! All profiles fixed.');
}

main();
