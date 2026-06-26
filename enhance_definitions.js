const fs = require('fs');

const ATTACK_RULES = {
    '늄': '방어가 전혀 불가능한 전설급 한방단어입니다.',
    '륨': '상대방이 시작할 단어가 없는 강력한 전설급 공격 단어입니다.',
    '튬': '화학 원소 위주의 강력한 전설급 방어 불가 단어입니다.',
    '뮴': '상대가 단어를 잇지 못하고 즉사하는 전설급 공격 단어입니다.',
    '슘': '칼슘, 마그네슘 등 실생활 단어로 상대를 침묵시키는 전설급 단어입니다.',
    '븀': '이터븀, 나이오븀 등 희토류 금속 원소 위주의 전설급 공격 단어입니다.',
    '듐': '라듐, 이리듐 등 전설급 방어 불가 한방 단어입니다.',
    '녘': '동녘, 서녘 등 일상 어휘로 불시에 치명타를 가하는 전설급 단어입니다.',
    '슭': '산슭, 물슭 등 우리말 기슭으로 상대를 완패시키는 전설급 단어입니다.',
    '팎': '안팎, 문안팎 등 팎으로 끝나는 강력한 전설급 한방단어입니다.',
    '엌': '부엌 등으로 상대를 외통수에 몰아넣는 전설급 공격 단어입니다.',
    '탉': '수탉, 암탉 등 표준어 시작 단어가 없는 전설급 한방단어입니다.',
    '쁨': '기쁨, 미쁨 등 쁨으로 끝나는 절대적인 전설급 한방단어입니다.',
    '냑': '꼬냑 등 냑으로 끝나는 방어 불가 공격 단어입니다.',
    '읓': '읓으로 끝나는 한글 자모 명칭 기반의 전설급 공격 단어입니다.',
    '읔': '읔으로 끝나는 한글 자모 명칭 기반의 전설급 공격 단어입니다.',
    '읕': '읕으로 끝나는 한글 자모 명칭 기반의 전설급 공격 단어입니다.',
    '읖': '읖으로 끝나는 한글 자모 명칭 기반의 전설급 공격 단어입니다.',
    '읗': '읗으로 끝나는 한글 자모 명칭 기반의 전설급 공격 단어입니다.',
    '즙': '사과즙, 포도즙 등 영웅급 한방단어입니다. 사투리 외에는 방어가 불가능합니다.',
    '릇': '버릇, 그릇 등 릇으로 끝나는 영웅급 방어 불가 단어입니다.',
    '듭': '거듭, 매듭 등 듭으로 끝나는 영웅급 방어 불가 단어입니다.',
    '볕': '양볕, 뙤약볕 등 볕으로 끝나는 영웅급 공격 단어입니다.',
    '값': '기름값, 땅값 등 값으로 끝나는 희귀 등급 유도 압박 단어입니다.',
    '켓': '라켓, 티켓 등 켓으로 끝나는 희귀 등급 공격 단어입니다.',
    '틈': '문틈, 바위틈 등 틈으로 끝나는 희귀 등급 공격 단어입니다.',
    '둑': '논둑, 밭둑 등 둑으로 끝나는 희귀 등급 공격 단어입니다.',
    '름': '두음법칙이 적용되지 않는 게임에서 아주 강력한 성능을 발휘하는 희귀 단어입니다.',
    '즘': '로맨티시즘 등 즘으로 끝나는 희귀 등급 공격 단어입니다.',
    '꾼': '사냥꾼, 나무꾼 등 꾼으로 끝나는 희귀 등급 유도 압박 단어입니다.',
    '턴': '랜턴, 패턴 등 턴으로 끝나는 외래어 기반의 희귀 공격 단어입니다.',
    '삯': '삯일, 방삯 등 삯으로 끝나는 희귀 등급 유도 압박 단어입니다.'
};

try {
    // Read app.js
    let appCode = fs.readFileSync('app.js', 'utf8');

    // Extract current WORD_DATABASE
    const dbMatch = appCode.match(/const WORD_DATABASE = (\[[\s\S]*?\n\];)/);
    if (!dbMatch) throw new Error('WORD_DATABASE not found in app.js');
    
    // Evaluate the database array
    const db = eval(dbMatch[1]);

    // Create a map of start characters to winning words (tier > 1) starting with that character
    const winningWordsMap = new Map();
    db.forEach(item => {
        if (item.tier > 1) {
            const start = item.startChar;
            if (!winningWordsMap.has(start)) {
                winningWordsMap.set(start, []);
            }
            winningWordsMap.get(start).push(item.word);
        }
    });

    console.log('Beginning description enhancement process...');

    // Enhance definitions
    const enhancedDb = db.map(item => {
        const isGeneric = item.definition.startsWith('끝말잇기 필승') || 
                           item.definition.startsWith('상대를 한방단어로') ||
                           item.definition === '';
                           
        if (!isGeneric) {
            return item; // Keep existing detailed dictionary definition
        }

        let newDef = '';
        if (item.tier > 1) {
            // Winning word
            const ruleDesc = ATTACK_RULES[item.endChar];
            if (ruleDesc) {
                newDef = `'${item.endChar}'(으)로 끝나는 ${ruleDesc}`;
            } else {
                newDef = `'${item.endChar}'(으)로 끝나는 강력한 필승 한방단어입니다. 상대방의 다음 턴 공격로를 차단합니다.`;
            }
        } else {
            // Lure word
            const nextAttackWords = winningWordsMap.get(item.endChar) || [];
            if (nextAttackWords.length > 0) {
                // Get first 3 representative words
                const samples = nextAttackWords.slice(0, 3);
                newDef = `'${item.endChar}'(으)로 끝나는 전략적 유도단어입니다. 상대방이 '${item.endChar}'(으)로 시작하도록 유인한 뒤, 다음 턴에 필승 한방단어(예: ${samples.join(', ')})를 구사해 승리하세요!`;
            } else {
                newDef = `'${item.endChar}'(으)로 끝나는 유도단어입니다. 상대방의 선택지를 '${item.endChar}'(으)로 제한하여 턴 압박을 가하고 한방 공격 구도를 설계하세요.`;
            }
        }

        return {
            ...item,
            definition: newDef
        };
    });

    // Format database back to JS string
    let formattedDb = '[\n';
    enhancedDb.forEach((item, idx) => {
        formattedDb += `    { word: "${item.word}", startChar: "${item.startChar}", endChar: "${item.endChar}", definition: "${item.definition}", tier: ${item.tier} }${idx < enhancedDb.length - 1 ? ',' : ''}\n`;
    });
    formattedDb += '];';

    // Replace in app.js
    const newAppCode = appCode.replace(/const WORD_DATABASE = \[[\s\S]*?\n\];/, `const WORD_DATABASE = ${formattedDb}`);
    fs.writeFileSync('app.js', newAppCode, 'utf8');
    console.log('app.js definitions enhanced successfully.');

    // Re-run kakaotalk bot builder
    const { execSync } = require('child_process');
    execSync('node build_kakaotalk_bot.js');
    console.log('kakaotalk-bot.js generated with enhanced definitions.');

} catch (err) {
    console.error('Error enhancing definitions:', err);
    process.exit(1);
}
