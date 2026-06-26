const fs = require('fs');

try {
    const xmlPath = 'docx_temp/word/document.xml';
    if (!fs.existsSync(xmlPath)) {
        throw new Error('document.xml not found in the extracted files.');
    }

    const xml = fs.readFileSync(xmlPath, 'utf8');

    const paragraphs = [];
    const pRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
    let match;
    
    while ((match = pRegex.exec(xml)) !== null) {
        const pContent = match[1];
        const tRegex = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g;
        let tMatch;
        let pText = '';
        while ((tMatch = tRegex.exec(pContent)) !== null) {
            // Unescape common XML entities if present
            let text = tMatch[1]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'");
            pText += text;
        }
        paragraphs.push(pText);
    }

    fs.writeFileSync('words.txt', paragraphs.join('\n'), 'utf8');
    console.log(`Successfully extracted ${paragraphs.length} paragraphs to words.txt`);
} catch (err) {
    console.error('Error extracting text from docx:', err);
    process.exit(1);
}
