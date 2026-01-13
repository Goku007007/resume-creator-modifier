
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

const DB_PATH = path.join(os.homedir(), 'Library', 'Application Support', 'resume-modifier', 'data.db');

function analyzeProfiles() {
    if (!fs.existsSync(DB_PATH)) {
        console.error(`Database not found at ${DB_PATH}`);
        return;
    }

    const db = new Database(DB_PATH, { readonly: true });

    const rows = db.prepare('SELECT name, content FROM profiles').all();
    console.log(`Found ${rows.length} profiles.\n`);

    let totalBulletsAllProfiles = 0;
    let totalCharsAllBullets = 0;

    rows.forEach(row => {
        try {
            const content = JSON.parse(row.content);
            const experiences = content.sections?.experience || [];

            if (experiences.length === 0) {
                console.log(`Profile: ${row.name} - No experience entries.`);
                return;
            }

            let profileBulletCount = 0;
            let profileBulletChars = 0;

            experiences.forEach(exp => {
                if (exp.bullets && Array.isArray(exp.bullets)) {
                    exp.bullets.forEach(bullet => {
                        profileBulletCount++;
                        profileBulletChars += bullet.length;
                    });
                }
            });

            const avgChars = profileBulletCount > 0 ? (profileBulletChars / profileBulletCount).toFixed(0) : 0;
            console.log(`Profile: ${row.name}`);
            console.log(`  - Total Bullets: ${profileBulletCount}`);
            console.log(`  - Avg Chars per Bullet: ${avgChars}`);
            console.log('---');

            totalBulletsAllProfiles += profileBulletCount;
            totalCharsAllBullets += profileBulletChars;

        } catch (err) {
            console.error(`Error parsing profile ${row.name}:`, err.message);
        }
    });

    console.log('\nOVERALL STATISTICS');
    const overallAvg = totalBulletsAllProfiles > 0
        ? (totalCharsAllBullets / totalBulletsAllProfiles).toFixed(0)
        : 0;

    console.log(`Total Profiles Analyzed: ${rows.length}`);
    console.log(`Total Bullets (Experience): ${totalBulletsAllProfiles}`);
    console.log(`Overall Average Character Length per Bullet: ${overallAvg}`);
}

analyzeProfiles();
