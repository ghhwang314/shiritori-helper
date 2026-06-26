const fs = require('fs');

try {
    // Read app.js
    const appCode = fs.readFileSync('app.js', 'utf8');

    // Extract ATTACK_RULES
    const rulesMatch = appCode.match(/const ATTACK_RULES = (\{[\s\S]*?\n\};)/);
    if (!rulesMatch) throw new Error('ATTACK_RULES not found');
    const attackRulesText = rulesMatch[1];

    // Extract WORD_DATABASE
    const dbMatch = appCode.match(/const WORD_DATABASE = (\[[\s\S]*?\n\];)/);
    if (!dbMatch) throw new Error('WORD_DATABASE not found');
    
    // Parse the database array to output clean JSON
    const wordDatabase = eval(dbMatch[1]);
    fs.writeFileSync('words.json', JSON.stringify(wordDatabase, null, 2), 'utf8');
    console.log('words.json generated successfully.');

    // Template for the bot script (Fully ES5 compatible with escaped backslashes)
    const template = `/*
 * 끝말잇기 한방단어 카카오톡 봇 스크립트 (메신저봇R 전용 - 초경량 네트워크 버전)
 * 
 * 제작/제공: 끝말잇기 필승 연구소
 * 설명: 1.4MB의 데이터베이스를 기기 내부에 저장하지 않고, 깃허브 웹 서버에서 실시간으로 불러와 작동합니다.
 *       구형 스마트폰(Rhino 엔진)과의 호환성을 위해 100% ES5 표준 문법으로 작성되었습니다.
 * 
 * 사용법: 카카오톡 채팅방에서 아래 명령어를 입력하세요.
 *   - /도움말 또는 !도움말 : 사용법 및 명령어 목록 확인
 *   - /검색 <자음/글자/단어> : 한방단어 검색 (예: !검색 ㄱ, !검색 가)
 *   - /분석 <단어> : 입력한 단어의 끝글자 공격력 분석 (예: !분석 가돌리늄)
 *   - /도감 [음절] : 한방 끝글자 도감 설명 확인 (예: !도감 늄)
 *   - /추천 : 강력한 추천 단어 3개 무작위 제시
 *   - /업데이트 : 웹 서버에서 단어 데이터베이스 강제 새로고침
 */

// 데이터베이스 URL (GitHub Pages에 배포된 JSON 파일)
var DB_URL = "https://ghhwang314.github.io/shiritori-helper/words.json";

// 1. 공격 끝글자 규칙 데이터베이스
var ATTACK_RULES = ${attackRulesText}

// 2. 전역 캐시 변수
var WORD_DATABASE = null;
var isDownloading = false;

// 3. 데이터베이스 웹 로드 함수
function loadDatabase() {
    if (WORD_DATABASE && WORD_DATABASE.length > 0) return true;
    if (isDownloading) return false;
    
    isDownloading = true;
    try {
        var jsonText = "";
        try {
            // 메신저봇R 내장 유틸리티 사용
            jsonText = Utils.getWebText(DB_URL);
        } catch (e) {
            // JSoup 라이브러리 사용 백업
            jsonText = org.jsoup.Jsoup.connect(DB_URL)
                .ignoreContentType(true)
                .maxBodySize(0)
                .timeout(10000)
                .execute()
                .body();
        }
        
        if (jsonText) {
            jsonText = jsonText.trim();
            WORD_DATABASE = JSON.parse(jsonText);
            isDownloading = false;
            return true;
        }
    } catch (err) {
        // 오류 처리
    }
    isDownloading = false;
    return false;
}

// 4. 메신저봇R 알림 이벤트 수신 함수
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    // 공백 제거 및 명령어 파싱
    msg = msg.trim();
    if (!msg.startsWith('/') && !msg.startsWith('!')) return;
    
    var prefix = msg.charAt(0);
    var commandLine = msg.substring(1).trim();
    var spaceIndex = commandLine.indexOf(' ');
    
    var command = commandLine;
    var parameter = '';
    if (spaceIndex !== -1) {
        command = commandLine.substring(0, spaceIndex).trim();
        parameter = commandLine.substring(spaceIndex + 1).trim();
    }
    
    // 전체보기 유니코드 문자열 (채팅방 도배 방지용 - ES5 루프로 생성)
    var readMore = (function() {
        var str = "";
        for (var i = 0; i < 500; i++) {
            str += "\\u200b";
        }
        return str;
    })();
    
    if (command === '도움말' || command === 'help') {
        var helpMsg = [
            "🏆 [끝말잇기 필승 봇 도움말]",
            "끝말잇기 방어 불가 한방단어를 알려주는 비법 비서봇입니다.",
            "",
            "📌 명령어 목록:",
            "1. " + prefix + "도움말 : 현재 도움말 확인",
            "2. " + prefix + "검색 <글자/자음> : 매칭되는 한방단어 검색",
            "   (예시: " + prefix + "검색 ㄱ, " + prefix + "검색 가)",
            "3. " + prefix + "분석 <단어> : 끝글자 공격력 정밀 분석",
            "   (예시: " + prefix + "분석 가돌리늄)",
            "4. " + prefix + "도감 [글자] : 한방 끝글자 도감 확인",
            "   (예시: " + prefix + "도감, " + prefix + "도감 늄)",
            "5. " + prefix + "추천 : 무작위 한방단어 3개 추천",
            "6. " + prefix + "업데이트 : 최신 단어 정보 웹 새로고침",
            "",
            "💡 모든 검색 및 도감 결과는 채팅방 도배 방지를 위해 '전체보기' 내부에 상세히 표시됩니다."
        ].join('\\n');
        replier.reply(helpMsg);
    }
    
    else if (command === '업데이트') {
        replier.reply("🔄 웹 서버에서 최신 단어 데이터베이스를 다운로드합니다...");
        WORD_DATABASE = null;
        if (loadDatabase()) {
            replier.reply("✅ 업데이트 완료! 총 " + WORD_DATABASE.length + "개의 단어가 성공적으로 로드되었습니다.");
        } else {
            replier.reply("❌ 업데이트 실패. 인터넷 연결 상태를 확인해 주세요.");
        }
    }
    
    else {
        // 단어 데이터베이스 로딩 시도
        if (!WORD_DATABASE || WORD_DATABASE.length === 0) {
            var success = loadDatabase();
            if (!success) {
                replier.reply("⚠️ 단어 데이터베이스를 불러오는 중입니다. 잠시 후 다시 명령어를 입력해 주세요. (혹은 " + prefix + "업데이트 입력)");
                return;
            }
        }
        
        if (command === '검색') {
            if (!parameter) {
                replier.reply("⚠️ 검색어를 입력해 주세요.\\n사용법: " + prefix + "검색 <자음/글자/단어> (예: " + prefix + "검색 ㄱ)");
                return;
            }
            
            var query = parameter.toLowerCase();
            var results = filterWords(query);
            
            if (results.length === 0) {
                replier.reply("❌ '" + parameter + "'에 매칭되는 한방단어를 찾지 못했습니다.");
                return;
            }
            
            // 정렬 (티어 내림차순, 그 다음 가나다순 - ES5)
            results.sort(function(a, b) {
                if (b.tier !== a.tier) return b.tier - a.tier;
                return a.word > b.word ? 1 : (a.word < b.word ? -1 : 0);
            });
            
            var title = "🔍 [한방단어 검색 결과]\\n";
            title += "'" + parameter + "' 검색 결과 (총 " + results.length + "개):";
            
            var body = "\\n" + readMore + "\\n";
            results.forEach(function(item, idx) {
                var tierStar = "";
                for (var s = 0; s < item.tier; s++) {
                    tierStar += "⭐";
                }
                body += (idx + 1) + ". " + item.word + " (" + getTierName(item.tier) + " " + tierStar + ")\\n";
                body += "   뜻: " + item.definition + "\\n\\n";
            });
            
            replier.reply(title + body.trim());
        }
        
        else if (command === '분석') {
            if (!parameter) {
                replier.reply("⚠️ 분석할 단어를 입력해 주세요.\\n사용법: " + prefix + "분석 <단어> (예: " + prefix + "분석 리튬)");
                return;
            }
            
            var word = parameter;
            var koreanRegex = /^[가-힣]+$/;
            if (!koreanRegex.test(word)) {
                replier.reply("⚠️ 한글로만 이루어진 단어를 입력해 주세요.");
                return;
            }
            
            var lastChar = word.slice(-1);
            var rule = ATTACK_RULES[lastChar];
            
            var replyMsg = "🧐 [" + word + "] 실시간 공격력 분석\\n\\n";
            if (rule) {
                var tierStar = "";
                for (var s = 0; s < rule.tier; s++) {
                    tierStar += "⭐";
                }
                replyMsg += "▶ 마지막 글자: [" + lastChar + "]\\n";
                replyMsg += "▶ 판정 등급: " + rule.name + " (" + tierStar + ")\\n";
                replyMsg += "▶ 상세 분석: " + rule.desc + "\\n\\n";
                replyMsg += "💡 추천 팁: 게임 중 이 단어를 구사하면 상대는 방어하지 못하고 게임이 오버될 확률이 극도로 높습니다.";
            } else {
                replyMsg += "▶ 마지막 글자: [" + lastChar + "]\\n";
                replyMsg += "▶ 판정 등급: 일반 단어 (방어 가능)\\n";
                replyMsg += "▶ 상세 분석: '" + lastChar + "'(으)로 시작하는 표준어가 존재하여 상대방이 받아칠 수 있습니다.\\n\\n";
                replyMsg += "💡 추천 팁: 늄, 륨, 튬, 녘, 슭, 팎 등 한방 끝글자로 끝나는 단어를 설계해 보세요!";
            }
            replier.reply(replyMsg);
        }
        
        else if (command === '도감') {
            if (parameter) {
                var char = parameter.trim();
                var rule = ATTACK_RULES[char];
                if (!rule) {
                    replier.reply("❌ '" + char + "'은(는) 등록된 한방 공격 끝글자가 아닙니다.");
                    return;
                }
                var tierStar = "";
                for (var s = 0; s < rule.tier; s++) {
                    tierStar += "⭐";
                }
                var msgOut = "📖 [한방 끝글자 도감 - " + char + "]\\n\\n";
                msgOut += "▶ 공격 등급: " + rule.name + " (" + tierStar + ")\\n";
                msgOut += "▶ 분석 설명: " + rule.desc + "\\n\\n";
                
                var examples = [];
                for (var e = 0; e < WORD_DATABASE.length; e++) {
                    if (WORD_DATABASE[e].endChar === char) {
                        examples.push(WORD_DATABASE[e].word);
                    }
                }
                if (examples.length > 0) {
                    msgOut += "💡 대표 예시 단어: " + examples.slice(0, 8).join(', ');
                }
                replier.reply(msgOut);
            } else {
                // 전체 도감 목록 출력
                var title = "📖 [끝글자 공격 도감 전체 목록]";
                var body = "\\n" + readMore + "\\n";
                
                var sortedRules = Object.keys(ATTACK_RULES).map(function(key) {
                    return { key: key, rule: ATTACK_RULES[key] };
                }).sort(function(a, b) {
                    if (b.rule.tier !== a.rule.tier) return b.rule.tier - a.rule.tier;
                    return a.key > b.key ? 1 : (a.key < b.key ? -1 : 0);
                });
                
                sortedRules.forEach(function(item) {
                    var tierStar = "";
                    for (var s = 0; s < item.rule.tier; s++) {
                        tierStar += "⭐";
                    }
                    body += "[" + item.key + "] - " + item.rule.name + " (" + tierStar + ")\\n";
                    body += "설명: " + item.rule.desc + "\\n\\n";
                });
                replier.reply(title + body.trim());
            }
        }
        
        else if (command === '추천') {
            // 랜덤으로 3개 단어 추출 (ES5)
            var shuffled = WORD_DATABASE.slice().sort(function() {
                return 0.5 - Math.random();
            });
            var selected = shuffled.slice(0, 3);
            
            var msgOut = "🎲 [오늘의 추천 필승 한방단어]\\n\\n";
            selected.forEach(function(item, idx) {
                var tierStar = "";
                for (var s = 0; s < item.tier; s++) {
                    tierStar += "⭐";
                }
                msgOut += (idx + 1) + ". " + item.word + " (" + getTierName(item.tier) + " " + tierStar + ")\\n";
                msgOut += "   뜻: " + item.definition + "\\n\\n";
            });
            replier.reply(msgOut.trim());
        }
    }
}

// --- 헬퍼 함수 및 데이터 추출 알고리즘 ---
var HANGUL_START = 0xAC00;
var HANGUL_END = 0xD7A3;
var CHOSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

function getChosung(char) {
    var code = char.charCodeAt(0);
    if (code >= HANGUL_START && code <= HANGUL_END) {
        var index = Math.floor((code - HANGUL_START) / 588);
        return CHOSUNG_LIST[index];
    }
    return char;
}

function filterWords(searchQuery) {
    return WORD_DATABASE.filter(function(item) {
        var firstChar = item.word.charAt(0);
        
        // 검색어가 초성 한 글자인 경우
        if (searchQuery.length === 1 && CHOSUNG_LIST.indexOf(searchQuery) !== -1) {
            return getChosung(firstChar) === searchQuery;
        }
        
        // 일반 텍스트 검색
        return item.word.indexOf(searchQuery) !== -1 || 
               item.startChar.indexOf(searchQuery) !== -1 ||
               item.endChar.indexOf(searchQuery) !== -1;
    });
}

function getTierName(tier) {
    if (tier === 5) return '전설';
    if (tier === 4) return '영웅';
    if (tier === 3) return '희귀';
    return '보통';
}
`;

    fs.writeFileSync('kakaotalk-bot.js', template, 'utf8');
    console.log('kakaotalk-bot.js (ES5 Fully Compatible Version - Escaped) generated successfully.');
} catch (err) {
    console.error('Error generating bot script:', err);
    process.exit(1);
}
