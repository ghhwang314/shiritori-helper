const fs = require('fs');

const ATTACK_RULES = {
    '늄': { tier: 5, name: '전설 (방어 불가)' },
    '륨': { tier: 5, name: '전설 (방어 불가)' },
    '튬': { tier: 5, name: '전설 (방어 불가)' },
    '뮴': { tier: 5, name: '전설 (방어 불가)' },
    '슘': { tier: 5, name: '전설 (방어 불가)' },
    '븀': { tier: 5, name: '전설 (방어 불가)' },
    '듐': { tier: 5, name: '전설 (방어 불가)' },
    '녘': { tier: 5, name: '전설 (방어 불가)' },
    '슭': { tier: 5, name: '전설 (방어 불가)' },
    '팎': { tier: 5, name: '전설 (방어 불가)' },
    '엌': { tier: 5, name: '전설 (방어 불가)' },
    '탉': { tier: 5, name: '전설 (방어 불가)' },
    '쁨': { tier: 5, name: '전설 (방어 불가)' },
    '냑': { tier: 5, name: '전설 (방어 불가)' },
    '읓': { tier: 5, name: '전설 (방어 불가)' },
    '읔': { tier: 5, name: '전설 (방어 불가)' },
    '읕': { tier: 5, name: '전설 (방어 불가)' },
    '읖': { tier: 5, name: '전설 (방어 불가)' },
    '읗': { tier: 5, name: '전설 (방어 불가)' },
    '즙': { tier: 4, name: '영웅 (사실상 한방)' },
    '릇': { tier: 4, name: '영웅 (사실상 한방)' },
    '듭': { tier: 4, name: '영웅 (사실상 한방)' },
    '볕': { tier: 4, name: '영웅 (방어 까다로움)' },
    '값': { tier: 3, name: '희귀 (강력한 유도)' },
    '켓': { tier: 3, name: '희귀 (방어 까다로움)' },
    '틈': { tier: 3, name: '희귀 (방어 가능)' },
    '둑': { tier: 3, name: '희귀 (방어 가능)' },
    '름': { tier: 3, name: '희귀 (두음법칙 변수)' },
    '즘': { tier: 3, name: '희귀 (방어 까다로움)' },
    '꾼': { tier: 3, name: '희귀 (방어 가능)' },
    '턴': { tier: 3, name: '희귀 (방어 가능)' },
    '삯': { tier: 3, name: '희귀 (방어 가능)' }
};

function parseWordsFile(filepath) {
    if (!fs.existsSync(filepath)) {
        console.error(`Error: File not found at ${filepath}`);
        return null;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split(/\r?\n/);
    
    let currentSyllable = '';
    let currentMode = ''; // '한방' or '유도'
    const words = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.startsWith('::')) continue;
        if (line.includes('.') && !isNaN(line.replace(/\./g, ''))) continue; // Ignore date line
        
        // Syllable header e.g., [가]
        const sylMatch = line.match(/^\[([가-힣]+)\]$/);
        if (sylMatch) {
            currentSyllable = sylMatch[1];
            continue;
        }
        
        // Mode switch
        if (line === '-한방-') {
            currentMode = '한방';
            continue;
        }
        if (line === '-유도-') {
            currentMode = '유도';
            continue;
        }
        
        // Words list
        if (currentSyllable && currentMode) {
            const list = line.split(/\s+/).filter(x => x.trim());
            for (const word of list) {
                const startChar = word.charAt(0);
                const endChar = word.slice(-1);
                
                // Calculate tier
                let tier = 0;
                let definition = '';
                if (currentMode === '한방') {
                    const rule = ATTACK_RULES[endChar];
                    tier = rule ? rule.tier : 3; // Default to 3 for unlisted winning words
                    definition = `끝말잇기 필승 한방단어 (공격글자: ${endChar})`;
                } else {
                    tier = 1; // Transition/Lure word tier
                    definition = `상대를 한방단어로 이끄는 유도단어 (끝글자: ${endChar})`;
                }
                
                words.push({
                    word,
                    startChar,
                    endChar,
                    definition,
                    tier
                });
            }
        }
    }
    return words;
}

try {
    const inputPath = 'words.txt';
    const parsedWords = parseWordsFile(inputPath);
    if (!parsedWords) {
        console.log('Please make sure you create a "words.txt" file in the workspace containing your word list.');
        process.exit(1);
    }

    console.log(`Successfully parsed ${parsedWords.length} words from ${inputPath}`);

    // Read current app.js
    let appCode = fs.readFileSync('app.js', 'utf8');

    // Extract current WORD_DATABASE
    const dbMatch = appCode.match(/const WORD_DATABASE = (\[[\s\S]*?\n\];)/);
    if (!dbMatch) throw new Error('WORD_DATABASE not found in app.js');
    
    // Parse existing database content
    const existingDbText = dbMatch[1];
    // Simple evaluation to get array (safe since it's only objects)
    const existingDb = eval(existingDbText);

    // Merge databases
    const wordMap = new Map();
    // Load existing words
    existingDb.forEach(item => {
        wordMap.set(item.word, item);
    });
    // Add or update parsed words
    parsedWords.forEach(item => {
        if (wordMap.has(item.word)) {
            // Keep definition if existing has a custom one, otherwise use new one
            const existing = wordMap.get(item.word);
            if (existing.definition && !existing.definition.startsWith('끝말잇기 필승') && !existing.definition.startsWith('상대를 한방단어로')) {
                item.definition = existing.definition;
            }
        }
        wordMap.set(item.word, item);
    });

    const mergedDb = Array.from(wordMap.values());

    // Format merged database back to JS string
    let formattedDb = '[\n';
    mergedDb.forEach((item, idx) => {
        formattedDb += `    { word: "${item.word}", startChar: "${item.startChar}", endChar: "${item.endChar}", definition: "${item.definition}", tier: ${item.tier} }${idx < mergedDb.length - 1 ? ',' : ''}\n`;
    });
    formattedDb += '];';

    // Replace in app.js
    const newAppCode = appCode.replace(/const WORD_DATABASE = \[[\s\S]*?\n\];/, `const WORD_DATABASE = ${formattedDb}`);
    fs.writeFileSync('app.js', newAppCode, 'utf8');
    console.log(`Merged database successfully. Total words in app.js: ${mergedDb.length}`);

    // Re-run kakaotalk bot builder if present
    if (fs.existsSync('build_kakaotalk_bot.js')) {
        const { execSync } = require('child_process');
        execSync('node build_kakaotalk_bot.js');
        console.log('Re-built kakaotalk-bot.js with the updated database.');
    }

} catch (err) {
    console.error('Error merging words:', err);
}
