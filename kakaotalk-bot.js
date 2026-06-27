/*
 * 끝말잇기 한방단어 카카오톡 봇 스크립트 (메신저봇R 전용 - 초경량 네트워크 버전)
 * 
 * 제작/제공: H.⍢⃝❤️ ⍤⃝🍋⍥⃝🍰 ⍣⃝🧊
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
var ATTACK_RULES = {
    '늄': { tier: 5, name: '전설 (방어 불가)', desc: "'늄'으로 시작하는 표준어 단어는 국어사전에 전혀 존재하지 않습니다. 확실한 승리를 보장합니다.", tag: '늄' },
    '륨': { tier: 5, name: '전설 (방어 불가)', desc: "'륨'으로 시작하는 표준어 단어는 존재하지 않습니다. 주로 원소 이름 및 외래어 끝에 분포합니다.", tag: '륨' },
    '튬': { tier: 5, name: '전설 (방어 불가)', desc: "'튬'으로 시작하는 표준어 단어가 없습니다. 리튬, 루테튬 등 강력한 원소 단어입니다.", tag: '튬' },
    '뮴': { tier: 5, name: '전설 (방어 불가)', desc: "'뮴'으로 시작하는 단어가 없습니다. 카드뮴, 네오디뮴 등이 대표적입니다.", tag: '뮴' },
    '슘': { tier: 5, name: '전설 (방어 불가)', desc: "'슘'으로 시작하는 단어가 없습니다. 칼슘, 세슘, 마그네슘 등으로 한방에 끝냅니다.", tag: '슘' },
    '븀': { tier: 5, name: '전설 (방어 불가)', desc: "'븀'으로 시작하는 단어가 없습니다. 나이오븀, 이터븀, 어븀 등이 있습니다.", tag: '븀' },
    '듐': { tier: 5, name: '전설 (방어 불가)', desc: "'듐'으로 시작하는 단어가 없습니다. 바나듐, 로듐, 인듐, 이리듐 등 다양합니다.", tag: '듐' },
    '녘': { tier: 5, name: '전설 (방어 불가)', desc: "'녘'으로 시작하는 단어가 없습니다. 동녘, 서녘, 들녘 등 일상 단어로 강력한 한방을 꽂습니다.", tag: '녘' },
    '슭': { tier: 5, name: '전설 (방어 불가)', desc: "'슭'으로 시작하는 단어가 없습니다. 산슭, 강슭, 물슭 등 아름다운 우리말로 승리하세요.", tag: '슭' },
    '팎': { tier: 5, name: '전설 (방어 불가)', desc: "'팎'으로 시작하는 단어가 없습니다. 안팎, 문안팎 등으로 상대방을 막아섭니다.", tag: '팎' },
    '엌': { tier: 5, name: '전설 (방어 불가)', desc: "'엌'으로 시작하는 표준어 단어가 없습니다. '부엌'이 가장 대표적인 한방단어입니다.", tag: '엌' },
    '탉': { tier: 5, name: '전설 (방어 불가)', desc: "'탉'으로 시작하는 단어는 표준국어대사전에 전혀 등록되어 있지 않습니다. 수탉, 암탉, 씨암탉 등이 포함됩니다.", tag: '탉' },
    '쁨': { tier: 5, name: '전설 (방어 불가)', desc: "'쁨'으로 시작하는 단어는 사전에 존재하지 않습니다. 기쁨, 미쁨 등이 절대적인 공격력을 띱니다.", tag: '쁨' },
    '냑': { tier: 5, name: '전설 (방어 불가)', desc: "'냑'으로 시작하는 표준 한국어 단어는 존재하지 않습니다. '꼬냑' 등이 유일한 예시입니다.", tag: '냑' },
    '읓': { tier: 5, name: '전설 (방어 불가)', desc: "'치읓' 등 한글 자음 명칭에 붙는 받침 단어로, '읓'으로 시작하는 단어는 존재하지 않습니다.", tag: '읓' },
    '읔': { tier: 5, name: '전설 (방어 불가)', desc: "'키읔' 등으로 인해 '읔'으로 끝나는 자모 한방입니다. 시작 단어가 없습니다.", tag: '읔' },
    '읕': { tier: 5, name: '전설 (방어 불가)', desc: "'티읕' 등으로 인해 '읕'으로 끝나는 자모 한방입니다. 시작 단어가 없습니다.", tag: '읕' },
    '읖': { tier: 5, name: '전설 (방어 불가)', desc: "'피읖' 등으로 인해 '읖'으로 끝나는 자모 한방입니다. 시작 단어가 없습니다.", tag: '읖' },
    '읗': { tier: 5, name: '전설 (방어 불가)', desc: "'히읗' 등으로 인해 '읗'으로 끝나는 자모 한방입니다. 시작 단어가 없습니다.", tag: '읗' },
    
    '즙': { tier: 4, name: '영웅 (사실상 한방)', desc: "'즙'으로 시작하는 표준 단어가 없습니다. (다만 사투리 '즙(집)'이나 북한어 '즙물'을 인정하는 특수 룰에서는 방어될 수 있습니다.)", tag: '즙' },
    '릇': { tier: 4, name: '영웅 (사실상 한방)', desc: "'릇'으로 시작하는 단어는 고어 '릇다(느슨하다)' 외에 없어 일반적인 끝말잇기 게임에서는 완전히 막힙니다.", tag: '릇' },
    '듭': { tier: 4, name: '영웅 (사실상 한방)', desc: "'듭'으로 시작하는 단어는 사투리 '듭새(이불)'를 제외하면 표준어가 없어 확실한 방어가 어렵습니다.", tag: '듭' },
    '볕': { tier: 4, name: '영웅 (방어 까다로움)', desc: "'볕'으로 시작하는 단어로 '볕뉘', '볕누리' 등 극소수 단어만 있어 일반인 기준 사실상 한방입니다.", tag: '볕' },
    
    '값': { tier: 3, name: '희귀 (강력한 유도)', desc: "'값'으로 시작하는 단어로 '값어치', '값지다' 등이 있어 방어가 되지만, 상대의 단어를 '치'나 '다'로 강제 제한하여 턴을 압박합니다.", tag: '값' },
    '켓': { tier: 3, name: '희귀 (방어 까다로움)', desc: "'켓'으로 시작하는 단어로 사투리 외에 '켓(ket, 화학용어)' 등 극소수 전문용어만 있어 일반인 기준 한방입니다.", tag: '켓' },
    '틈': { tier: 3, name: '희귀 (방어 가능)', desc: "'틈새', '틈바구니' 등으로 방어는 가능하지만, 상대가 알고 있어야 하므로 기습 공격으로 좋습니다.", tag: '틈' },
    '둑': { tier: 3, name: '희귀 (방어 가능)', desc: "'둑길', '둑새' 등으로 방어할 수 있으나, 어휘력이 낮은 상대에게 매우 효과적입니다.", tag: '둑' },
    '름': { tier: 3, name: '희귀 (두음법칙 변수)', desc: "두음법칙이 없는 게임(예: 름->름)에서는 '름름하다(늠름하다의 옛말)' 외에 방어가 안 되므로 초강력 한방입니다. (두음법칙 적용 시 '임금', '늠름' 등으로 방어 가능)", tag: '름' },
    '즘': { tier: 3, name: '희귀 (방어 까다로움)', desc: "'즘'으로 시작하는 단어로 옛말 '즘게(즙)' 외에는 없어 방어가 매우 난해합니다.", tag: '즘' },
    '꾼': { tier: 3, name: '희귀 (방어 가능)', desc: "'꾼'으로 시작하는 표준 명사가 없어 사실상 방어가 어렵습니다. (상대의 어휘력을 테스트하기 좋습니다.)", tag: '꾼' },
    '턴': { tier: 3, name: '희귀 (방어 가능)', desc: "'턴'으로 시작하는 단어는 '턴테이블', '턴(turn)' 등이 있어 방어가 되나 외래어 표기 룰에 따라 한방이 될 수 있습니다.", tag: '턴' },
    '삯': { tier: 3, name: '희귀 (방어 가능)', desc: "'삯'으로 시작하는 단어는 '삯일', '삯바느질' 등이 있어 방어가 비교적 쉬우나, 상대 템포를 빼앗는 데 효과적입니다.", tag: '삯' }
};

// 2. 전역 캐시 변수
var WORD_DATABASE = null;
var isDownloading = false;

// 3. 웹 텍스트 다운로드 헬퍼 함수 (3중 백업 지원)
function fetchWebText(urlStr) {
    // 1단계 백업: Java 표준 URLConnection 사용 (엔진 종류 상관없이 100% 작동)
    try {
        var url = new java.net.URL(urlStr);
        var conn = url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(8000);
        
        var reader = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream(), "UTF-8"));
        var line;
        var result = "";
        while ((line = reader.readLine()) !== null) {
            result += line + "\n";
        }
        reader.close();
        if (result && result.trim()) {
            return result.trim();
        }
    } catch (e1) {
        // 실패 시 다음 단계로 진행
    }

    // 2단계 백업: Jsoup 라이브러리 사용 (org 패키지가 존재할 경우)
    try {
        if (typeof org !== 'undefined' && org.jsoup && org.jsoup.Jsoup) {
            var jsoupText = org.jsoup.Jsoup.connect(urlStr)
                .ignoreContentType(true)
                .maxBodySize(0)
                .timeout(8000)
                .execute()
                .body();
            if (jsoupText && jsoupText.trim()) {
                return jsoupText.trim();
            }
        }
    } catch (e2) {
        // 실패 시 다음 단계로 진행
    }

    // 3단계 백업: 메신저봇R 내장 Utils 사용
    try {
        if (typeof Utils !== 'undefined' && Utils.getWebText) {
            var utilsText = Utils.getWebText(urlStr);
            if (utilsText && utilsText.trim()) {
                return utilsText.trim();
            }
        }
    } catch (e3) {
        // 실패
    }

    return null;
}

// 4. 데이터베이스 웹 로드 함수
function loadDatabase() {
    if (WORD_DATABASE && WORD_DATABASE.length > 0) return true;
    if (isDownloading) return false;
    
    isDownloading = true;
    try {
        var jsonText = fetchWebText(DB_URL);
        if (jsonText) {
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
            str += "\u200b";
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
            "💡 모든 검색 및 도감 결과는 채팅방 도배 방지를 위해 '전체보기' 내부에 상세히 표시됩니다.",
            "",
            "copyright\u24b8 H.\u2362\u20dd\u2764\ufe0f \u2364\u20dd\ud83c\udf4b\u2365\u20dd\ud83c\udf70 \u2363\u20dd\ud83e\uddca All Right Reserved."
        ].join('\n');
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
                replier.reply("⚠️ 검색어를 입력해 주세요.\n사용법: " + prefix + "검색 <자음/글자/단어> (예: " + prefix + "검색 ㄱ)");
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
            
            var title = "🔍 [한방단어 검색 결과]\n";
            title += "'" + parameter + "' 검색 결과 (총 " + results.length + "개):";
            
            var body = "\n" + readMore + "\n";
            results.forEach(function(item, idx) {
                var tierStar = "";
                for (var s = 0; s < item.tier; s++) {
                    tierStar += "⭐";
                }
                body += (idx + 1) + ". " + item.word + " (" + getTierName(item.tier) + " " + tierStar + ")\n";
                body += "   뜻: " + item.definition + "\n\n";
            });
            
            replier.reply(title + body.trim());
        }
        
        else if (command === '분석') {
            if (!parameter) {
                replier.reply("⚠️ 분석할 단어를 입력해 주세요.\n사용법: " + prefix + "분석 <단어> (예: " + prefix + "분석 리튬)");
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
            
            var replyMsg = "🧐 [" + word + "] 실시간 공격력 분석\n\n";
            if (rule) {
                var tierStar = "";
                for (var s = 0; s < rule.tier; s++) {
                    tierStar += "⭐";
                }
                replyMsg += "▶ 마지막 글자: [" + lastChar + "]\n";
                replyMsg += "▶ 판정 등급: " + rule.name + " (" + tierStar + ")\n";
                replyMsg += "▶ 상세 분석: " + rule.desc + "\n\n";
                replyMsg += "💡 추천 팁: 게임 중 이 단어를 구사하면 상대는 방어하지 못하고 게임이 오버될 확률이 극도로 높습니다.";
            } else {
                replyMsg += "▶ 마지막 글자: [" + lastChar + "]\n";
                replyMsg += "▶ 판정 등급: 일반 단어 (방어 가능)\n";
                replyMsg += "▶ 상세 분석: '" + lastChar + "'(으)로 시작하는 표준어가 존재하여 상대방이 받아칠 수 있습니다.\n\n";
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
                var msgOut = "📖 [한방 끝글자 도감 - " + char + "]\n\n";
                msgOut += "▶ 공격 등급: " + rule.name + " (" + tierStar + ")\n";
                msgOut += "▶ 분석 설명: " + rule.desc + "\n\n";
                
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
                var body = "\n" + readMore + "\n";
                
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
                    body += "[" + item.key + "] - " + item.rule.name + " (" + tierStar + ")\n";
                    body += "설명: " + item.rule.desc + "\n\n";
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
            
            var msgOut = "🎲 [오늘의 추천 필승 한방단어]\n\n";
            selected.forEach(function(item, idx) {
                var tierStar = "";
                for (var s = 0; s < item.tier; s++) {
                    tierStar += "⭐";
                }
                msgOut += (idx + 1) + ". " + item.word + " (" + getTierName(item.tier) + " " + tierStar + ")\n";
                msgOut += "   뜻: " + item.definition + "\n\n";
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
    var query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    
    return WORD_DATABASE.filter(function(item) {
        var wordClean = item.word.trim().toLowerCase();
        var firstChar = wordClean.charAt(0);
        
        // 검색어가 초성 한 글자인 경우
        if (query.length === 1 && CHOSUNG_LIST.indexOf(query) !== -1) {
            return getChosung(firstChar) === query;
        }
        
        // 일반 텍스트 검색 (단어가 검색어로 시작하는 경우만 매칭)
        return wordClean.indexOf(query) === 0;
    });
}

function getTierName(tier) {
    if (tier === 5) return '전설';
    if (tier === 4) return '영웅';
    if (tier === 3) return '희귀';
    return '보통';
}
