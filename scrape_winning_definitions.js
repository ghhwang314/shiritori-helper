const fs = require('fs');
const https = require('https');

// Helper function to query Daum Dictionary for a word
function fetchDefinition(word) {
    return new Promise((resolve) => {
        const url = `https://dic.daum.net/search.do?q=${encodeURIComponent(word)}&dic=korean`;
        
        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                resolve(null);
                return;
            }
            
            let html = '';
            res.on('data', chunk => html += chunk);
            res.on('end', () => {
                const korIdx = html.indexOf('한국어사전');
                if (korIdx === -1) {
                    resolve(null);
                    return;
                }
                const section = html.substring(korIdx, korIdx + 3000);
                const match = section.match(/<span class="txt_search">([\s\S]*?)<\/span>/);
                if (match) {
                    const definition = match[1].replace(/<[^>]*>/g, '').trim();
                    resolve(definition);
                } else {
                    resolve(null);
                }
            });
        });
        
        req.on('error', () => {
            resolve(null); // Skip on error
        });
    });
}

async function run() {
    try {
        console.log('Loading app.js...');
        let appCode = fs.readFileSync('app.js', 'utf8');

        // Extract current WORD_DATABASE
        const dbMatch = appCode.match(/const WORD_DATABASE = (\[[\s\S]*?\n\];)/);
        if (!dbMatch) throw new Error('WORD_DATABASE not found in app.js');
        
        // Evaluate the database array
        const db = eval(dbMatch[1]);
        console.log(`Loaded ${db.length} words from database.`);

        // Filter winning words (tier > 1) that have generic/strategy definitions
        const targetWords = db.filter(item => {
            if (item.tier <= 1) return false; // Only winning words
            const def = item.definition;
            // Check if it is a generic/templated definition
            return def.includes('한방단어') || def.includes('필승') || def.includes('공격글자') || def.includes('끝글자') || def.includes('전략적') || def === '';
        });

        console.log(`Found ${targetWords.length} winning words needing custom definitions.`);

        if (targetWords.length === 0) {
            console.log('No words need definition enhancement.');
            return;
        }

        // We will process them sequentially with a delay to be polite
        let successCount = 0;
        let skipCount = 0;
        
        for (let i = 0; i < targetWords.length; i++) {
            const item = targetWords[i];
            console.log(`[${i + 1}/${targetWords.length}] Fetching definition for: ${item.word}...`);
            
            const definition = await fetchDefinition(item.word);
            
            if (definition) {
                // We got a real definition!
                item.definition = definition;
                successCount++;
                console.log(`  -> Found: "${definition}"`);
            } else {
                // Keep the existing strategy guide if no definition found
                skipCount++;
                console.log(`  -> Not found in Korean dictionary (keeping existing strategy guide).`);
            }

            // Save incrementally every 50 words or on the last word
            if ((i + 1) % 50 === 0 || i === targetWords.length - 1) {
                console.log('Saving progress to app.js...');
                
                let formattedDb = '[\n';
                db.forEach((entry, idx) => {
                    formattedDb += `    { word: "${entry.word}", startChar: "${entry.startChar}", endChar: "${entry.endChar}", definition: "${entry.definition}", tier: ${entry.tier} }${idx < db.length - 1 ? ',' : ''}\n`;
                });
                formattedDb += '];';

                appCode = appCode.replace(/const WORD_DATABASE = \[[\s\S]*?\n\];/, `const WORD_DATABASE = ${formattedDb}`);
                fs.writeFileSync('app.js', appCode, 'utf8');
                console.log('Progress saved successfully.');
            }

            // Wait 250ms between requests
            await new Promise(r => setTimeout(r, 250));
        }

        console.log(`Enhancement finished! Success: ${successCount}, Skipped: ${skipCount}`);

        // Re-run kakaotalk bot builder if present
        if (fs.existsSync('build_kakaotalk_bot.js')) {
            console.log('Re-building kakaotalk-bot.js...');
            const { execSync } = require('child_process');
            execSync('node build_kakaotalk_bot.js');
            console.log('kakaotalk-bot.js updated.');
        }

    } catch (err) {
        console.error('Error running enhancement:', err);
    }
}

run();
