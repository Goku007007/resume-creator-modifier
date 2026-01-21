import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { ResumeJSON } from '@/types/resume';
import { generateResumeCSS, GOOGLE_FONTS_LINK } from '@/lib/resumeCSS';
import { generateResumeHTML } from '@/lib/resumeHTML';
import { generateResumeCSSRussell, GOOGLE_FONTS_LINK_RUSSELL } from '@/lib/resumeCSSRussell';
import { generateResumeHTMLRussell } from '@/lib/resumeHTMLRussell';
import { generateResumeCSSGerman, GOOGLE_FONTS_LINK_GERMAN } from '@/lib/resumeCSSGerman';
import { generateResumeHTMLGerman } from '@/lib/resumeHTMLGerman';

export async function POST(request: NextRequest) {
    try {
        const { data, format = 'pdf' } = await request.json() as { data: ResumeJSON; format?: string };

        if (!data) {
            return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
        }

        // Generate HTML for the resume using shared modules
        const html = generateFullHTML(data);

        // Launch browser
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Set viewport based on page size - A4 for German, Letter for others
        const isGerman = data.rendering.format === 'german';
        // A4 at 96 DPI: 794 × 1123 pixels, Letter at 96 DPI: 816 × 1056 pixels
        const viewportWidth = isGerman ? 794 : 816;
        const viewportHeight = isGerman ? 1123 : 1056;
        await page.setViewportSize({ width: viewportWidth, height: viewportHeight });

        // Load the HTML
        await page.setContent(html, { waitUntil: 'networkidle' });

        // Essential: Wait for web fonts to fully load before rendering
        // Add a 3s timeout to prevents indefinite hangs if fonts fail to report ready
        await page.evaluate(async () => {
            await Promise.race([
                document.fonts.ready,
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
        });

        let output: Buffer;
        let contentType: string;
        let filename: string;

        if (format === 'pdf') {
            // Use A4 for German format, Letter for others
            const isGerman = data.rendering.format === 'german';
            output = await page.pdf({
                format: isGerman ? 'A4' : 'Letter',
                printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            });
            contentType = 'application/pdf';
            filename = `${data.profileMeta.resumeName || 'resume'}.pdf`;
        } else {
            // Return screenshot for preview
            output = await page.screenshot({ type: 'png' });
            contentType = 'image/png';
            filename = 'preview.png';
        }

        await browser.close();

        return new NextResponse(new Uint8Array(output), {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

function generateFullHTML(data: ResumeJSON): string {
    const { rendering } = data;
    const isRussell = rendering.format === 'russell';
    const isGerman = rendering.format === 'german';

    // Select CSS/HTML generators based on format
    const css = isGerman
        ? generateResumeCSSGerman(rendering)
        : isRussell
            ? generateResumeCSSRussell(rendering)
            : generateResumeCSS(rendering);

    const bodyHtml = isGerman
        ? generateResumeHTMLGerman(data)
        : isRussell
            ? generateResumeHTMLRussell(data)
            : generateResumeHTML(data);

    const fontsLink = isGerman
        ? GOOGLE_FONTS_LINK_GERMAN
        : isRussell
            ? GOOGLE_FONTS_LINK_RUSSELL
            : GOOGLE_FONTS_LINK;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsLink}" rel="stylesheet">
  <style>
    ${css}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>
  `;
}

