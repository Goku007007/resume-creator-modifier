// Improved script to parse .docx resumes with better skills parsing
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const resumeDir = '/Users/gokulananth/Downloads/Vibe Coding Projects/resume-modifier/diff resumes ';

async function extractTextFromDocx(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
}

function parseSkillsLine(line) {
    // Split on patterns like "Label:" or "Label :" 
    // This handles cases where multiple skill groups are on one line
    const groups = [];

    // Match patterns like "Label:" or "Label :" followed by content
    const pattern = /([A-Za-z&\s\-]+)\s*:\s*/g;
    const matches = [...line.matchAll(pattern)];

    for (let i = 0; i < matches.length; i++) {
        const label = matches[i][1].trim();
        const startIdx = matches[i].index + matches[i][0].length;
        const endIdx = i < matches.length - 1 ? matches[i + 1].index : line.length;
        const itemsStr = line.substring(startIdx, endIdx).trim();

        // Split items by comma, handling parentheses properly
        const items = [];
        let current = '';
        let parenDepth = 0;

        for (const char of itemsStr) {
            if (char === '(') parenDepth++;
            else if (char === ')') parenDepth--;
            else if (char === ',' && parenDepth === 0) {
                const item = current.trim();
                if (item) items.push(item);
                current = '';
                continue;
            }
            current += char;
        }
        if (current.trim()) items.push(current.trim());

        if (items.length > 0 && label) {
            groups.push({ label, items });
        }
    }

    return groups;
}

function parseResumeText(text, fileName) {
    const baseName = path.basename(fileName, '.docx');
    const profileMatch = baseName.match(/Resume_(.+)$/);
    let profileName = profileMatch ? profileMatch[1] : baseName;
    profileName = profileName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');

    let basics = {
        name: 'Gokul Nandakumar',
        email: 'goku.careers@gmail.com',
        phone: '+1 (773) 930 2964',
        links: [
            { label: 'Portfolio', url: 'https://gokuldata.vercel.app/' },
            { label: 'GitHub', url: 'https://github.com/Goku007007' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/gokul-nandakumar/' }
        ],
        locationLine: ''
    };

    let skills = { heading: 'Skills', groups: [] };
    let experience = [];
    let projects = [];
    let education = [];

    const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p);

    let currentSection = 'header';
    let currentExp = null;
    let currentProj = null;

    for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        const lowerPara = para.toLowerCase();

        if (lowerPara === 'skills') {
            currentSection = 'skills';
            continue;
        } else if (lowerPara === 'experience') {
            currentSection = 'experience';
            continue;
        } else if (lowerPara === 'projects') {
            currentSection = 'projects';
            continue;
        } else if (lowerPara === 'education') {
            currentSection = 'education';
            continue;
        }

        if (currentSection === 'skills') {
            // Parse all skill lines in this paragraph
            const lines = para.split('\n');
            for (const line of lines) {
                const parsedGroups = parseSkillsLine(line);
                skills.groups.push(...parsedGroups);
            }
        } else if (currentSection === 'experience') {
            const jobMatch = para.match(/^([^,]+),\s*([^-]+)\s*-\s*(.+?)\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s*-\s*(Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i);

            if (jobMatch) {
                if (currentExp && currentExp.bullets.length > 0) {
                    experience.push(currentExp);
                }
                currentExp = {
                    title: jobMatch[1].trim(),
                    company: jobMatch[2].trim().replace(/,\s*$/, ''),
                    location: jobMatch[3].trim(),
                    start: jobMatch[4].trim(),
                    end: jobMatch[5] === 'Present' ? null : jobMatch[5].trim(),
                    bullets: [],
                    tech: []
                };
            } else if (currentExp) {
                currentExp.bullets.push(para);
            }
        } else if (currentSection === 'projects') {
            if (para.includes('Github') || para.includes('github')) {
                if (currentProj && currentProj.bullets.length > 0) {
                    projects.push(currentProj);
                }
                const name = para.replace(/\s*Github\s*/gi, '').replace(/\t/g, '').trim();
                currentProj = { name, bullets: [] };
            } else if (currentProj) {
                currentProj.bullets.push(para);
            }
        } else if (currentSection === 'education') {
            const eduMatch = para.match(/^([^-–]+)\s*[-–]\s*(.+)$/);
            if (eduMatch) {
                education.push({
                    school: eduMatch[1].trim(),
                    degree: eduMatch[2].trim()
                });
            }
        }
    }

    if (currentExp && currentExp.bullets.length > 0) experience.push(currentExp);
    if (currentProj && currentProj.bullets.length > 0) projects.push(currentProj);

    return {
        profileMeta: {
            profileName: profileName,
            resumeName: baseName,
            updatedAt: new Date().toISOString()
        },
        basics,
        sections: { skills, experience, projects, education },
        rendering: {
            fontFamily: 'Calibri',
            fontSize: 11,
            lineHeight: 1.15,
            monoFontFamily: 'Geist Mono, Andale Mono, monospace',
            pageSize: 'LETTER',
            density: 'COMPACT'
        }
    };
}

async function main() {
    const files = fs.readdirSync(resumeDir).filter(f => f.endsWith('.docx'));
    console.log(`Found ${files.length} .docx files\n`);

    const results = [];

    for (const file of files) {
        const filePath = path.join(resumeDir, file);
        console.log(`Processing: ${file}`);

        const text = await extractTextFromDocx(filePath);
        const parsed = parseResumeText(text, file);

        console.log(`  Profile: ${parsed.profileMeta.profileName}`);
        console.log(`  Skills groups: ${parsed.sections.skills.groups.length}`);
        for (const g of parsed.sections.skills.groups) {
            console.log(`    - ${g.label}: ${g.items.length} items`);
        }
        console.log(`  Experience entries: ${parsed.sections.experience.length}`);
        console.log(`  Projects: ${parsed.sections.projects.length}`);
        console.log(`  Education: ${parsed.sections.education.length}`);
        console.log('');

        results.push(parsed);
    }

    const outputPath = '/Users/gokulananth/Downloads/Vibe Coding Projects/resume-modifier/scripts/parsed-resumes.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nSaved ${results.length} parsed resumes to ${outputPath}`);
}

main().catch(console.error);
