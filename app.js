/* --- 끝말잇기 한방단어 검색기 어플리케이션 로직 --- */

// 1. 한방단어 공격 규칙 데이터베이스 (공격 끝글자 도감 및 분석용)
const ATTACK_RULES = {
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

// 2. 225+개의 정교한 한방단어 데이터베이스
const WORD_DATABASE = [
    // ㄱ
    { word: "가돌리늄", startChar: "가", endChar: "늄", definition: "원자 번호 64의 희토류 금속 원소. 은백색의 광택이 있고 연성과 전성이 강함.", tier: 5 },
    { word: "가녘", startChar: "가", endChar: "녘", definition: "가장자리나 끝을 뜻하는 우리말.", tier: 5 },
    { word: "가마솥안팎", startChar: "가", endChar: "팎", definition: "가마솥의 안쪽과 바깥쪽 전체 공간을 두루 일컫는 낱말.", tier: 5 },
    { word: "가스뷰렛", startChar: "가", endChar: "켓", definition: "기체의 부피를 측정하는 데 쓰는 눈금이 새겨진 유리관 모양의 실험 기구.", tier: 3 },
    { word: "갈륨", startChar: "가", endChar: "륨", definition: "원자 번호 31의 금속 원소. 상온 근처에서 녹는 액체가 되며, 반도체 제조에 널리 쓰임.", tier: 5 },
    { word: "강슭", startChar: "강", endChar: "슭", definition: "강물이 닿아 흐르는 강가의 가장자리 언덕 기슭.", tier: 5 },
    { word: "감자즙", startChar: "감", endChar: "즙", definition: "생감자를 갈아서 짜낸 생즙으로 위장 건강에 유효함.", tier: 4 },
    { word: "개울슭", startChar: "개", endChar: "슭", definition: "개울물의 가장자리 기슭.", tier: 5 },
    { word: "개울녘", startChar: "개", endChar: "녘", definition: "개울물이 흐르는 주변이나 가장자리.", tier: 5 },
    { word: "겨울녘", startChar: "겨", endChar: "녘", definition: "겨울철에 들어선 무렵이나 겨울철 시기.", tier: 5 },
    { word: "거듭", startChar: "거", endChar: "듭", definition: "어떤 일을 자꾸 되풀이하여. 또는 다시 한번.", tier: 4 },
    { word: "고윳값", startChar: "고", endChar: "값", definition: "수학 선형대수학에서 행렬과 관련된 특정한 스칼라 값.", tier: 3 },
    { word: "구연산나트륨", startChar: "구", endChar: "륨", definition: "식품 첨가물이나 혈액 응고 저지제로 쓰이는 구연산의 나트륨염.", tier: 5 },
    { word: "구녘", startChar: "구", endChar: "녘", definition: "'구멍'을 비속하게 이르는 말 또는 일부 지방의 방언.", tier: 5 },
    { word: "구름틈", startChar: "구", endChar: "틈", definition: "하늘에 뜬 구름과 구름 사이에 생기는 열린 빈틈.", tier: 3 },
    { word: "규산나트륨", startChar: "규", endChar: "륨", definition: "물유리라고도 불리며 접착제, 내화 재료 등에 쓰이는 규산과 나트륨의 화합물.", tier: 5 },
    { word: "규산칼륨", startChar: "규", endChar: "륨", definition: "칼륨의 규산염 화합물로, 내화 페인트나 접착제에 널리 쓰임.", tier: 5 },
    { word: "기쁨", startChar: "기", endChar: "쁨", definition: "마음에 기쁜 느낌이나 감정. '쁨'으로 끝나 상대를 절대적으로 격파할 수 있음.", tier: 5 },
    { word: "기름값", startChar: "기", endChar: "값", definition: "석유나 기름 등의 판매 가격.", tier: 3 },
    { word: "기댓값", startChar: "기", endChar: "값", definition: "어떤 확률 변수의 수학적 평균치.", tier: 3 },
    { word: "꼬냑", startChar: "꼬", endChar: "냑", definition: "프랑스 코냐크 지방에서 생산되는 세계적인 고급 브랜디 제품.", tier: 5 },
    { word: "꽃그릇", startChar: "꽃", endChar: "릇", definition: "꽃을 심거나 꽂아 두는 데 쓰는 그릇(화분 등).", tier: 4 },
    { word: "끝녘", startChar: "끝", endChar: "녘", definition: "어떤 길이나 대상의 맨 끝이 되는 구역.", tier: 5 },
    { word: "골짜기슭", startChar: "골", endChar: "슭", definition: "골짜기의 옆으로 뻗은 비탈진 언덕의 기슭.", tier: 5 },
    { word: "그릇", startChar: "그", endChar: "릇", definition: "음식이나 물건을 담는 도구의 총칭.", tier: 4 },
    { word: "국그릇", startChar: "국", endChar: "릇", definition: "국을 담아 먹는 데 쓰는 그릇.", tier: 4 },
    
    // ㄴ
    { word: "나트륨", startChar: "나", endChar: "륨", definition: "원자 번호 11의 알칼리 금속 원소. 일상에서는 소금의 구성 성분으로 매우 친숙함.", tier: 5 },
    { word: "나이오븀", startChar: "나", endChar: "븀", definition: "원자 번호 41의 전이 금속 원소. 주로 초전도 자석이나 합금의 강도를 높이는 데 쓰임.", tier: 5 },
    { word: "나무꾼", startChar: "나", endChar: "꾼", definition: "숲에서 나무를 베어 땔감으로 파는 일을 직업으로 하는 사람.", tier: 3 },
    { word: "나물꾼", startChar: "나", endChar: "꾼", definition: "산이나 들을 다니며 나물을 전문적으로 채취하여 파는 사람.", tier: 3 },
    { word: "남녘", startChar: "남", endChar: "녘", definition: "남쪽 방향이나 남쪽 지방을 이르는 말.", tier: 5 },
    { word: "남녘안팎", startChar: "남", endChar: "팎", definition: "남쪽 지역이나 대상의 안쪽과 바깥쪽 전체 지경.", tier: 5 },
    { word: "네오디뮴", startChar: "네", endChar: "뮴", definition: "원자 번호 60의 희토류 원소. 매우 강력한 영구자석인 네오디뮴 자석을 만드는 데 쓰임.", tier: 5 },
    { word: "넵투늄", startChar: "넵", endChar: "늄", definition: "원자 번호 93의 인공 방사성 원소. 플루토늄 생산의 중간체 역할을 함.", tier: 5 },
    { word: "노듈", startChar: "노", endChar: "듈", definition: "지질학 등에서 퇴적암 속에 둥글게 뭉쳐진 광물 덩어리(결핵체)를 의미함.", tier: 5 },
    { word: "노을녘", startChar: "노", endChar: "녘", definition: "하늘에 저녁 노을이 붉게 붉어지는 해 질 무렵의 시간대.", tier: 5 },
    { word: "논둑", startChar: "논", endChar: "둑", definition: "논의 물을 가두기 위해 흙을 쌓아 경계를 만든 둑길.", tier: 3 },
    { word: "나잇값", startChar: "나", endChar: "값", definition: "나이에 걸맞게 어울리는 행동이나 처신을 의미함.", tier: 3 },
    { word: "녹즙", startChar: "녹", endChar: "즙", definition: "신선한 채소 잎을 갈거나 짜서 만든 즙액.", tier: 4 },
    { word: "녹차즙", startChar: "녹", endChar: "즙", definition: "녹차 잎을 압착하여 고농축으로 추출해 낸 녹색 즙액.", tier: 4 },
    { word: "논녘", startChar: "논", endChar: "녘", definition: "논이 넓게 펼쳐져 있는 구역이나 방향.", tier: 5 },
    { word: "놋그릇", startChar: "놋", endChar: "릇", definition: "놋쇠(구리와 아연의 합금)로 만든 전통적인 식기 그릇.", tier: 4 },
    { word: "네티켓", startChar: "네", endChar: "켓", definition: "네티즌들이 인터넷상에서 지켜야 할 예의와 규범(에티켓).", tier: 3 },
    
    // ㄷ
    { word: "다이디뮴", startChar: "다", endChar: "뮴", definition: "네오디뮴과 프라세오디뮴의 혼합물로 이루어진 희토류 물질.", tier: 5 },
    { word: "다단식로켓", startChar: "다", endChar: "켓", definition: "우주선 등을 궤도에 올리기 위해 여러 개의 엔진 단계를 겹쳐 쌓아 만든 로켓.", tier: 3 },
    { word: "담즙", startChar: "담", endChar: "즙", definition: "간에서 분비되어 쓸개에 저장되었다가 십이지장으로 분비되는 소화액(쓸개즙).", tier: 4 },
    { word: "도라지즙", startChar: "도", endChar: "즙", definition: "도라지를 달이거나 다려 짜낸 즙으로 호흡기 건강에 도움을 줌.", tier: 4 },
    { word: "데스모포듐", startChar: "데", endChar: "듐", definition: "콩과의 다년생 풀 또는 약용 식물 속의 한 종류.", tier: 5 },
    { word: "덴드로븀", startChar: "덴", endChar: "븀", definition: "화려한 꽃을 피우는 서양란의 대표적인 난초 식물 품종.", tier: 5 },
    { word: "디스프로슘", startChar: "디", endChar: "슘", definition: "원자 번호 66의 희토류 금속 원소. 원자로 제어봉이나 특수 램프에 사용됨.", tier: 5 },
    { word: "디읃", startChar: "디", endChar: "읃", definition: "'ㄷ'을 북한식으로 일컫는 말이거나 옛 한글 사전의 옛말 표기. '읃'으로 시작하는 단어 없음.", tier: 5 },
    { word: "동녘", startChar: "동", endChar: "녘", definition: "동쪽 방향이나 동쪽 하늘 구역.", tier: 5 },
    { word: "들녘", startChar: "들", endChar: "녘", definition: "들판이 넓게 펼쳐진 지역이나 그 방향.", tier: 5 },
    { word: "덧거듭", startChar: "덧", endChar: "듭", definition: "하고 또 거듭하여 자꾸 되풀이하는 모양.", tier: 4 },
    { word: "도데실벤젠술폰산나트륨", startChar: "도", endChar: "륨", definition: "세탁 세제나 공업용 계면활성제에 널리 쓰이는 음이온 계면활성제 종류.", tier: 5 },
    { word: "돌솥안팎", startChar: "돌", endChar: "팎", definition: "돌솥의 안쪽 내벽과 바깥쪽 외벽 전체 공간.", tier: 5 },
    { word: "대표값", startChar: "대", endChar: "값", definition: "통계학에서 자료 전체의 특징을 하나의 수로 나타낸 값(평균, 중앙값 등).", tier: 3 },
    { word: "닻", startChar: "닻", endChar: "닻", definition: "배를 한곳에 멈추어 고정하기 위해 쇠줄에 매어 물밑으로 가라앉히는 무거운 도구.", tier: 3 },
    { word: "땅값", startChar: "땅", endChar: "값", definition: "토지의 매매 및 평가 거래 가격.", tier: 3 },
    { word: "땀값", startChar: "땀", endChar: "값", definition: "자신의 노력이나 노동을 통해 정당하게 얻은 대가나 보상.", tier: 3 },
    { word: "뜰녘", startChar: "뜰", endChar: "녘", definition: "집안의 마당이나 뜰 주변 구역.", tier: 5 },
    { word: "돔그릇", startChar: "돔", endChar: "릇", definition: "반구형 돔 모양으로 위가 볼록하게 덮인 형태의 뚜껑 그릇.", tier: 4 },
    
    // ㄹ
    { word: "라듐", startChar: "라", endChar: "듐", definition: "원자 번호 88의 방사성 금속 원소. 마리 퀴리가 발견하여 핵물리학에 지대한 공헌을 함.", tier: 5 },
    { word: "라켓", startChar: "라", endChar: "켓", definition: "테니스, 배드민턴, 탁구 등에서 공을 치기 위해 사용하는 타구판 도구.", tier: 3 },
    { word: "랜턴", startChar: "랜", endChar: "턴", definition: "휴대용 야외 조명 기구로 등산이나 캠핑 시 널리 쓰임.", tier: 3 },
    { word: "로켓", startChar: "로", endChar: "켓", definition: "가스 배출 반작용으로 날아가는 로켓 추진 기관이나 우주선 발사체.", tier: 3 },
    { word: "루테늄", startChar: "루", endChar: "늄", definition: "원자 번호 44의 백금족 전이 금속. 전기 접점이나 합금의 경화제 등에 쓰임.", tier: 5 },
    { word: "루테튬", startChar: "루", endChar: "튬", definition: "원자 번호 71의 희토류 원소. 밀도가 높고 융점이 높아 특수 합금 연구에 쓰임.", tier: 5 },
    { word: "루비듐", startChar: "루", endChar: "듐", definition: "원자 번호 37의 은백색 가벼운 알칼리 금속 원소. 물과 격렬히 반응함.", tier: 5 },
    { word: "리튬", startChar: "리", endChar: "튬", definition: "원자 번호 3의 가장 가벼운 알칼리 금속 원소. 이차전지(배터리)의 핵심 원료.", tier: 5 },
    { word: "리놀륨", startChar: "리", endChar: "륨", definition: "아마인유 등을 주원료로 하여 만든 바닥재 덮개용 시트 판.", tier: 5 },
    { word: "리듬", startChar: "리", endChar: "듬", definition: "음악이나 언어에서 음의 장단, 강약이 주기적으로 반복되는 흐름.", tier: 3 },
    { word: "리버모륨", startChar: "리", endChar: "륨", definition: "원자 번호 116의 초중량 인공 합성 원소. 반감기가 매우 짧음.", tier: 5 },
    { word: "로듐", startChar: "로", endChar: "듐", definition: "원자 번호 45의 백금족 원소. 귀금속의 도금이나 자동차 배기가스 촉매제에 쓰임.", tier: 5 },
    { word: "로맨티시즘", startChar: "로", endChar: "즘", definition: "18-19세기 유럽에서 성행한 개성과 감성을 중요시한 낭만주의 문예 사상.", tier: 3 },
    { word: "러더포듐", startChar: "러", endChar: "듐", definition: "원자 번호 104의 인공 합성 초우라늄 원소.", tier: 5 },
    { word: "뢴트게늄", startChar: "뢴", endChar: "늄", definition: "원자 번호 111의 인공 합성 방사성 원소.", tier: 5 },
    
    // ㅁ
    { word: "마그네슘", startChar: "마", endChar: "슘", definition: "원자 번호 12의 은백색 가벼운 금속 원소. 생명체 대사에 필수적이며 가벼운 기계 합금에 쓰임.", tier: 5 },
    { word: "마이크로모듈", startChar: "마", endChar: "듈", definition: "초소형 전자 회로 부품을 집적화하여 만든 소형 기능 블록 단위.", tier: 5 },
    { word: "모더니즘", startChar: "모", endChar: "즘", definition: "20세기 초 전통 예술 형식을 거부하고 혁신을 추구한 근대주의 사조.", tier: 3 },
    { word: "무릎", startChar: "무", endChar: "릎", definition: "넙적다리와 정강이 마디의 앞쪽 튀어나온 관절 부분. '릎'으로 시작하는 단어는 없음.", tier: 5 },
    { word: "무화과즙", startChar: "무", endChar: "즙", definition: "무화과 열매를 짜내어 만드는 달콤한 건강 과일 음료즙.", tier: 4 },
    { word: "무덤슭", startChar: "무", endChar: "슭", definition: "무덤이나 묘역 주변의 비탈진 흙 기슭 가장자리.", tier: 5 },
    { word: "매듭", startChar: "매", endChar: "듭", definition: "실, 줄 등을 매어 묶어서 맺은 마디. '듭'으로 끝나 게임을 매듭지을 수 있음.", tier: 4 },
    { word: "매염나트륨", startChar: "매", endChar: "륨", definition: "염색 공정에서 염료의 고착을 돕는 역할을 하는 나트륨염 물질.", tier: 5 },
    { word: "마늘즙", startChar: "마", endChar: "즙", definition: "마늘을 으깨거나 짓눌러서 짜낸 강한 향의 즙액.", tier: 4 },
    { word: "물그릇", startChar: "물", endChar: "릇", definition: "물을 담아 두는 둥글고 넓적한 그릇.", tier: 4 },
    { word: "물슭", startChar: "물", endChar: "슭", definition: "바다나 강, 호수 등의 물과 닿아 있는 기슭의 가장자리.", tier: 5 },
    { word: "문안팎", startChar: "문", endChar: "팎", definition: "문안과 문밖을 통틀어 이르는 말.", tier: 5 },
    { word: "문틈", startChar: "문", endChar: "틈", definition: "문이 닫혔을 때 문짝과 문설주 사이에 생기는 미세한 틈새.", tier: 3 },
    { word: "모래둑", startChar: "모", endChar: "둑", definition: "바람이나 파도에 의해 모래가 쌓여 제방처럼 둑을 이룬 지형.", tier: 3 },
    { word: "미쁨", startChar: "미", endChar: "쁨", definition: "남에게 신뢰를 줄 만한 정직함과 미더운 태도.", tier: 5 },
    { word: "물값", startChar: "물", endChar: "값", definition: "사용량에 따라 청구되는 수도 요금 또는 물의 가치 단가.", tier: 3 },
    
    // ㅂ
    { word: "바나듐", startChar: "바", endChar: "듐", definition: "원자 번호 23의 금속 원소. 철강 합금에 첨가하면 강도를 획기적으로 증가시킴.", tier: 5 },
    { word: "바륨", startChar: "바", endChar: "륨", definition: "원자 번호 56의 알칼리 토금속 원소. 의학용 방사선 촬영(위장 조영 검사)의 조영제로 유명함.", tier: 5 },
    { word: "바깥안팎", startChar: "바", endChar: "팎", definition: "바깥쪽의 안쪽과 바깥쪽 전체 구역을 두루 일컫는 말.", tier: 5 },
    { word: "바위틈", startChar: "바", endChar: "틈", definition: "바위와 바위 사이에 좁게 갈라진 틈새 공간.", tier: 3 },
    { word: "밥값", startChar: "밥", endChar: "값", definition: "식사 비용을 뜻하는 말. 또는 자신의 역할이나 몫을 온전히 해냄을 비유함.", tier: 3 },
    { word: "벼랑슭", startChar: "벼", endChar: "슭", definition: "깎아지른 듯한 벼랑의 아랫부분에 비탈진 기슭 가장자리.", tier: 5 },
    { word: "보리즙", startChar: "보", endChar: "즙", definition: "보리의 어린 싹을 갈거나 짓눌러 짜낸 초록빛 즙액.", tier: 4 },
    { word: "복분자즙", startChar: "복", endChar: "즙", definition: "복분자 열매를 짜내어 만든 신맛과 단맛이 도는 붉은 건강 즙.", tier: 4 },
    { word: "버릇", startChar: "버", endChar: "릇", definition: "오랫동안 되풀이하여 몸에 깊이 굳어진 행동 양식이나 습관.", tier: 4 },
    { word: "부엌", startChar: "부", endChar: "엌", definition: "음식을 만들고 설거지를 하는 취사 공간. '엌'으로 시작하는 표준 단어는 없음.", tier: 5 },
    { word: "비듬", startChar: "비", endChar: "듬", definition: "두피에서 떨어져 나가는 표피 각질 부스러기.", tier: 3 },
    { word: "밥그릇", startChar: "밥", endChar: "릇", definition: "밥을 담아 식사할 때 쓰는 개인용 밥그릇.", tier: 4 },
    { word: "볼륨", startChar: "볼", endChar: "륨", definition: "소리의 음량 크기 또는 물체의 부피, 책의 권수를 일컫는 외래어.", tier: 5 },
    { word: "북녘", startChar: "북", endChar: "녘", definition: "북쪽 방향 또는 북한 지역을 통틀어 부르는 말.", tier: 5 },
    { word: "베릴륨", startChar: "베", endChar: "륨", definition: "원자 번호 4의 가벼우면서도 매우 단단한 금속 원소. 우주 망원경 거울 등에 쓰임.", tier: 5 },
    { word: "밭둑", startChar: "밭", endChar: "둑", definition: "밭의 가장자리에 흙을 길게 쌓아서 경계를 만든 둑.", tier: 3 },
    { word: "밭녘", startChar: "밭", endChar: "녘", definition: "밭이 위치하고 있는 구역이나 들판 쪽 방향.", tier: 5 },
    { word: "배즙", startChar: "배", endChar: "즙", definition: "배를 으깨어 즙으로 짜낸 마시는 음료.", tier: 4 },
    { word: "발뺌", startChar: "발", endChar: "뺌", definition: "자신이 저지른 잘못이나 일에서 쏙 빠져나가 책임을 피하려 변명함.", tier: 5 },
    { word: "방둑", startChar: "방", endChar: "둑", definition: "하천이나 바다의 범람을 막기 위해 흙이나 돌로 길게 쌓아 만든 방조제 둑.", tier: 3 },
    { word: "바다슭", startChar: "바", endChar: "슭", definition: "바다와 육지가 맞닿아 있는 바닷가의 언덕 기슭.", tier: 5 },
    { word: "바다녘", startChar: "바", endChar: "녘", definition: "바다가 넓게 펼쳐져 보이는 방향이나 부근 구역.", tier: 5 },
    
    // ㅅ
    { word: "사마륨", startChar: "사", endChar: "륨", definition: "원자 번호 62의 희토류 원소. 매우 높은 온도에서도 자력을 유지하는 특수 자석 합금에 쓰임.", tier: 5 },
    { word: "사냥꾼", startChar: "사", endChar: "꾼", definition: "총이나 활을 이용해 야생 동물을 전문적으로 사냥하는 직업인.", tier: 3 },
    { word: "산기슭", startChar: "산", endChar: "슭", definition: "산자락 아래에 완만하게 경사진 기슭 지대.", tier: 5 },
    { word: "석류즙", startChar: "석", endChar: "즙", definition: "석류 열매의 붉은 씨앗을 압착해 만든 새콤달콤한 즙액.", tier: 4 },
    { word: "수박즙", startChar: "수", endChar: "즙", definition: "수박 과육의 즙을 내어 시원하게 마시는 수분이 풍부한 음료.", tier: 4 },
    { word: "세슘", startChar: "세", endChar: "슘", definition: "원자 번호 55의 반응성이 매우 큰 알칼리 금속 원소. 원자시계의 기준 진동수로 쓰임.", tier: 5 },
    { word: "세이셸", startChar: "세", endChar: "셸", definition: "아프리카 인도양 서부에 있는 아름다운 섬나라. '셸'로 시작하는 방어 단어가 매우 드묾.", tier: 4 },
    { word: "수산화나트륨", startChar: "수", endChar: "륨", definition: "가성소다라고도 불리는 강염기성 대표 물질. 비누 제조나 청소용 세제에 쓰임.", tier: 5 },
    { word: "서녘", startChar: "서", endChar: "녘", definition: "서쪽 방향 또는 해가 저무는 하늘 방향.", tier: 5 },
    { word: "새벽녘", startChar: "새", endChar: "녘", definition: "날이 밝아 올 무렵인 새벽 한때를 뜻함.", tier: 5 },
    { word: "스트론튬", startChar: "스", endChar: "튬", definition: "원자 번호 38의 알칼리 토금속 원소. 불꽃반응에서 붉은색을 띠어 폭죽에 쓰임.", tier: 5 },
    { word: "산슭", startChar: "산", endChar: "슭", definition: "산자락 아래의 완만한 비탈이나 언덕의 아래 가장자리.", tier: 5 },
    { word: "산녘", startChar: "산", endChar: "녘", definition: "산이 있는 근방이나 산이 보이는 방향 구역.", tier: 5 },
    { word: "손버릇", startChar: "손", endChar: "릇", definition: "남의 물건을 훔치거나 때리는 등 손으로 행하는 나쁜 버릇.", tier: 4 },
    { word: "사과즙", startChar: "사", endChar: "즙", definition: "사과를 갈거나 짜서 얻은 달콤한 과일 즙액.", tier: 4 },
    { word: "생강즙", startChar: "생", endChar: "즙", definition: "식용 생강을 곱게 갈아 물기를 걸러 낸 즙.", tier: 4 },
    { word: "손가락틈", startChar: "손", endChar: "틈", definition: "손가락과 손가락 사이의 갈라져 벌어진 틈.", tier: 3 },
    { word: "시보귬", startChar: "시", endChar: "늄", definition: "원자 번호 106의 초중량 합성 원소. 미국의 과학자 시보그의 이름을 땀.", tier: 5 },
    { word: "쇠그릇", startChar: "쇠", endChar: "릇", definition: "쇠나 철로 견고하게 만든 그릇 식기류.", tier: 4 },
    { word: "세살버릇", startChar: "세", endChar: "릇", definition: "어릴 때 버릇이 여든까지 간다는 속담에 등장하는 평생의 습관.", tier: 4 },
    { word: "쑥즙", startChar: "쑥", endChar: "즙", definition: "쑥을 즙을 내어 섭취하는 건강 음료용 즙액.", tier: 4 },
    { word: "쌀값", startChar: "쌀", endChar: "값", definition: "시장에서 쌀이 거래되는 유통 가격.", tier: 3 },
    { word: "셔틀콕", startChar: "셔", endChar: "콕", definition: "배드민턴 경기에서 라켓으로 쳐서 넘기는 깃털 달린 공.", tier: 4 },
    
    // ㅇ
    { word: "이리듐", startChar: "이", endChar: "듐", definition: "원자 번호 77의 매우 단단하고 부식되지 않는 백금족 원소. 우주 성진 분석의 지표.", tier: 5 },
    { word: "이터븀", startChar: "이", endChar: "븀", definition: "원자 번호 70의 전성이 좋은 희토류 원소. 야금용 합금과 레이저에 쓰임.", tier: 5 },
    { word: "이트륨", startChar: "이", endChar: "륨", definition: "원자 번호 39의 희토류 금속 원소. LED 형광체나 초전도체 합금에 쓰임.", tier: 5 },
    { word: "우라늄", startChar: "우", endChar: "늄", definition: "원자 번호 92의 은백색 무거운 방사성 원소. 원자력 발전 및 핵분열 원료.", tier: 5 },
    { word: "알루미늄", startChar: "알", endChar: "늄", definition: "원자 번호 13의 은백색 가벼운 금속 원소. 가공이 쉬워 캔, 쿠킹호일 등에 흔히 쓰임.", tier: 5 },
    { word: "유로퓸", startChar: "유", endChar: "늄", definition: "원자 번호 63의 희토류 금속 원소. 디스플레이의 적색 형광체로 활용됨.", tier: 5 },
    { word: "어븀", startChar: "어", endChar: "븀", definition: "원자 번호 68의 희토류 원소. 광섬유 통신 증폭기 및 치과용 레이저에 유용함.", tier: 5 },
    { word: "오스뮴", startChar: "오", endChar: "뮴", definition: "원자 번호 76의 금속 원소. 밀도가 매우 높고 단단하여 만년필 촉 끝부분에 쓰임.", tier: 5 },
    { word: "안팎", startChar: "안", endChar: "팎", definition: "안쪽과 바깥쪽을 아우르는 말. 대략적인 수량을 나타내는 의존 명사로도 쓰임.", tier: 5 },
    { word: "아침녘", startChar: "아", endChar: "녘", definition: "날이 밝아 아침이 시작되는 무렵의 때.", tier: 5 },
    { word: "아랫녘", startChar: "아", endChar: "녘", definition: "아래쪽 방향이나 남부 지방을 정답게 일컫는 말.", tier: 5 },
    { word: "아침햇볕", startChar: "아", endChar: "볕", definition: "이른 아침에 눈부시게 내리쬐는 맑고 부드러운 해의 빛.", tier: 4 },
    { word: "알칼리나트륨", startChar: "알", endChar: "륨", definition: "화학 반응성이 극도로 강한 알칼리 계열의 나트륨염 물질.", tier: 5 },
    { word: "아세트산나트륨", startChar: "아", endChar: "륨", definition: "아세트산과 나트륨의 염 화합물로 핫팩의 발열체나 초산나트륨으로 쓰임.", tier: 5 },
    { word: "양파즙", startChar: "양", endChar: "즙", definition: "자양 강장을 목적으로 양파를 끓이거나 짜서 추출한 농축 즙액.", tier: 4 },
    { word: "양배추즙", startChar: "양", endChar: "즙", definition: "양배추를 다려 짜낸 즙으로 위 건강에 탁월한 효과가 있음.", tier: 4 },
    { word: "옥수수즙", startChar: "옥", endChar: "즙", definition: "옥수수를 압착하여 전분과 단맛의 엑기스를 짜낸 즙액.", tier: 4 },
    { word: "요산나트륨", startChar: "요", endChar: "륨", definition: "체내 요산 수치가 높아져 관절에 쌓이는 요산의 나트륨 결정체.", tier: 5 },
    { word: "유턴", startChar: "유", endChar: "턴", definition: "도로 주행 중 차량을 180도 역방향으로 회전하여 되돌아가는 행동.", tier: 3 },
    { word: "워싱턴", startChar: "워", endChar: "턴", definition: "미국의 수도인 워싱턴 D.C. 또는 미국의 초대 대통령 조지 워싱턴.", tier: 3 },
    { word: "입버릇", startChar: "입", endChar: "릇", definition: "말할 때마다 습관적으로 자꾸 입 밖으로 내뱉는 독특한 말버릇.", tier: 4 },
    { word: "이름값", startChar: "이", endChar: "값", definition: "명성이나 유명세에 어울리도록 행동으로 보여주는 격식.", tier: 3 },
    { word: "옹스트룀", startChar: "옹", endChar: "룀", definition: "빛의 파장이나 분자 크기를 나타내는 미세 길이 단위(10억분의 1미터).", tier: 5 },
    { word: "외닻", startChar: "외", endChar: "닻", definition: "한 줄로만 바닥에 내리는 하나뿐인 닻.", tier: 3 },
    { word: "아인슈타늄", startChar: "아", endChar: "늄", definition: "원자 번호 99의 인공 합성 방사성 원소. 알베르트 아인슈타인의 이름을 명명함.", tier: 5 },
    { word: "악티늄", startChar: "악", endChar: "늄", definition: "원자 번호 89의 은백색 방사성 금속 원소. 열전도율이 강해 우주선 전원에 쓰임.", tier: 5 },
    { word: "아메리슘", startChar: "아", endChar: "슘", definition: "원자 번호 95의 인공 합성 초우라늄 원소. 연기 감지기 센서에 쓰임.", tier: 5 },
    { word: "오렌지즙", startChar: "오", endChar: "즙", definition: "오렌지 과육을 짓눌러서 짠 상큼한 즙액.", tier: 4 },
    { word: "윗녘", startChar: "윗", endChar: "녘", definition: "위쪽 방향이나 상류 구역을 이르는 말.", tier: 5 },
    { word: "왼녘", startChar: "왼", endChar: "녘", definition: "왼쪽 방향이나 공간 구역.", tier: 5 },
    { word: "인듐", startChar: "인", endChar: "듐", definition: "원자 번호 49의 금속 원소. LCD 화면이나 터치패널 전극(ITO) 원료로 필수적임.", tier: 5 },
    { word: "이산화티타늄", startChar: "이", endChar: "늄", definition: "자외선 차단제(선크림)나 백색 도료에 널리 쓰이는 백색 분말 화합물.", tier: 5 },
    { word: "임금값", startChar: "임", endChar: "값", definition: "노동력의 대가로 지급받는 임금의 수준 가치.", tier: 3 },
    { word: "암탉", startChar: "암", endChar: "탉", definition: "알을 낳을 수 있는 암컷 닭. '탉'으로 시작하는 단어는 전혀 없어 완벽한 피니셔 카드.", tier: 5 },
    
    // ㅈ
    { word: "지르코늄", startChar: "지", endChar: "늄", definition: "원자 번호 40의 전이 금속. 부식에 강해 원자로 피복관 재료나 보석 대용(큐빅)에 쓰임.", tier: 5 },
    { word: "제라늄", startChar: "제", endChar: "늄", definition: "쥐손이풀과의 아름다운 원예용 꽃 식물. 향이 강하고 개화 기간이 김.", tier: 5 },
    { word: "자궁안팎", startChar: "자", endChar: "팎", definition: "의학 생물학에서 여성 자궁기관의 내부와 외부 전체 구역.", tier: 5 },
    { word: "장꾼", startChar: "장", endChar: "꾼", definition: "시골 5일장 등 시장을 따라다니며 장사하는 전문 장사꾼.", tier: 3 },
    { word: "주스즙", startChar: "주", endChar: "즙", definition: "각종 과일이나 과채류의 엑기스를 착즙해 낸 즙액 주스.", tier: 4 },
    { word: "조개즙", startChar: "조", endChar: "즙", definition: "조개를 끓이거나 압착해 낸 맑고 뽀얀 감칠맛 도는 즙액.", tier: 4 },
    { word: "주방부엌", startChar: "주", endChar: "엌", definition: "식사를 조리하기 위해 각종 가재도구를 갖춘 부엌 공간.", tier: 5 },
    { word: "질그릇", startChar: "질", endChar: "릇", definition: "유약을 바르지 않고 진흙으로 구워 만든 서민적인 전통 그릇.", tier: 4 },
    { word: "질산나트륨", startChar: "질", endChar: "륨", definition: "비료, 화약, 초유 등의 공업용 원료로 쓰이는 화학 물질.", tier: 5 },
    { word: "저녁녘", startChar: "저", endChar: "녘", definition: "해가 지고 밤이 찾아오려고 하는 저녁 무렵의 시간대.", tier: 5 },
    { word: "잠버릇", startChar: "잠", endChar: "릇", definition: "잠자는 도중에 무의식적으로 뒤척이거나 소리를 지르는 등 고약한 버릇.", tier: 4 },
    { word: "자켓", startChar: "자", endChar: "켓", definition: "재킷의 흔한 외래어 표기(표준어는 재킷이나 끝말잇기 게임 사전에 빈번히 등재).", tier: 3 },
    { word: "주름", startChar: "주", endChar: "름", definition: "피부나 천 등이 접히거나 구겨져서 생기는 선 모양의 흔적.", tier: 3 },
    { word: "진릿값", startChar: "진", endChar: "값", definition: "논리학과 수학에서 어떤 명제가 참(T) 또는 거짓(F)인지 나타내는 판정 값.", tier: 3 },
    { word: "절댓값", startChar: "절", endChar: "값", definition: "수학에서 음과 양의 부호를 고려하지 않은 원점으로부터의 절대적인 거리 수치.", tier: 3 },
    { word: "집안팎", startChar: "집", endChar: "팎", definition: "집안의 내부와 집 바깥마당 등 외부를 아우르는 말.", tier: 5 },
    
    // ㅊ
    { word: "치읓", startChar: "치", endChar: "읓", definition: "한글 자음의 열번째 글자 명칭. '읓'으로 시작하는 단어는 국어사전에 없음.", tier: 5 },
    { word: "차아염소산나트륨", startChar: "차", endChar: "륨", definition: "주로 락스라고 불리는 살균 소독제 및 표백제의 주성분 화학 물질.", tier: 5 },
    { word: "찻그릇", startChar: "찻", endChar: "릇", definition: "차를 우려내어 담아 마실 때 사용하는 다도용 식기.", tier: 4 },
    { word: "책값", startChar: "책", endChar: "값", definition: "서적을 구매할 때 지불하는 정가 가격.", tier: 3 },
    { word: "참기름값", startChar: "참", endChar: "값", definition: "참깨를 짜서 만든 전통 참기름의 소매 판매 가격.", tier: 3 },
    { word: "처가녘", startChar: "처", endChar: "녘", definition: "처가 식구들이 모여 사는 친척 근방 구역.", tier: 5 },
    { word: "친가녘", startChar: "친", endChar: "녘", definition: "친가 집안이 모여 사는 친척 구역이나 친가 방향.", tier: 5 },
    { word: "칡즙", startChar: "칡", endChar: "즙", definition: "칡뿌리를 강하게 으깨어 짜낸 짙고 쓴 갈색의 즙액.", tier: 4 },
    { word: "채소즙", startChar: "채", endChar: "즙", definition: "각종 건강 야채와 채소류를 함께 섞어 짜낸 즙.", tier: 4 },
    { word: "천지안팎", startChar: "천", endChar: "팎", definition: "온 세상의 온 구석과 구역을 전부 아우르는 옛 표기식 낱말.", tier: 5 },
    { word: "첫새벽녘", startChar: "첫", endChar: "녘", definition: "새벽이 완전히 열려 동이 트는 아주 이른 시점.", tier: 5 },
    
    // ㅋ
    { word: "카드뮴", startChar: "카", endChar: "뮴", definition: "원자 번호 48의 유독성 청백색 전이 금속 원소. 배터리나 도료에 쓰이며 이타이이타이병의 원인.", tier: 5 },
    { word: "칼륨", startChar: "카", endChar: "륨", definition: "원자 번호 19의 알칼리 금속 원소. 포타슘이라고도 하며 체내 이온 농도 유지에 필수적임.", tier: 5 },
    { word: "칼슘", startChar: "카", endChar: "슘", definition: "원자 번호 20의 원소. 뼈와 이의 구성 성분으로 신체 지지에 핵심적인 미네랄.", tier: 5 },
    { word: "코코넛즙", startChar: "코", endChar: "즙", definition: "코코넛 야자 열매 내부에 고여 있는 천연 단맛의 즙액 주스.", tier: 4 },
    { word: "캘리포늄", startChar: "캘", endChar: "늄", definition: "원자 번호 98의 인공 합성 방사성 원소. 강력한 중성자를 방출해 암 치료나 분석에 쓰임.", tier: 5 },
    { word: "켐벨포도즙", startChar: "켐", endChar: "즙", definition: "켐벨 얼리 품종의 국산 포도를 그대로 짜내어 농축한 포도즙.", tier: 4 },
    { word: "퀴륨", startChar: "퀴", endChar: "륨", definition: "원자 번호 96의 인공 합성 방사성 초우라늄 원소. 마리 퀴리 부부의 공헌을 기림.", tier: 5 },
    { word: "코페르니슘", startChar: "코", endChar: "슘", definition: "원자 번호 112의 매우 무거운 합성 원소. 천문학자 코페르니쿠스의 이름을 명명함.", tier: 5 },
    { word: "크로뮴", startChar: "크", endChar: "뮴", definition: "원자 번호 24의 단단하고 은색 광택이 나는 금속 원소. 녹이 슬지 않게 도금하는 데 쓰임.", tier: 5 },
    { word: "캐비닛", startChar: "캐", endChar: "닛", definition: "서류나 공구 등을 수납하여 잠글 수 있는 철제 보관함 상자.", tier: 4 },
    { word: "키읔", startChar: "키", endChar: "읔", definition: "한글 자음의 열한번째 자모 이름. '읔'으로 시작하는 단어는 전혀 없음.", tier: 5 },
    
    // ㅌ
    { word: "티타늄", startChar: "티", endChar: "늄", definition: "원자 번호 22의 매우 가볍고 강하며 인체 무해한 강철급 금속. 인공관절, 임플란트, 항공기 등에 필수.", tier: 5 },
    { word: "티켓", startChar: "티", endChar: "켓", definition: "공연, 기차, 영화 등을 관람하거나 탑승하기 위한 승차권 및 표.", tier: 3 },
    { word: "터븀", startChar: "터", endChar: "븀", definition: "원자 번호 65의 희토류 금속 원소. 디스플레이 녹색 형광체나 합금 제조에 기여함.", tier: 5 },
    { word: "테크네튬", startChar: "테", endChar: "튬", definition: "원자 번호 43의 최초로 인공 합성된 원소. 의학용 방사선 진단 촬영의 추적자로 대량 활용.", tier: 5 },
    { word: "툴륨", startChar: "툴", endChar: "륨", definition: "원자 번호 69의 은백색 부드러운 희토류 원소. 고가이며 특수 방사선 X선 장치에 응용.", tier: 5 },
    { word: "탄산나트륨", startChar: "탄", endChar: "륨", definition: "소다라고도 불리는 공업용 백색 고체 화합물. 유리의 제조나 연수화제 등에 쓰임.", tier: 5 },
    { word: "토륨", startChar: "토", endChar: "륨", definition: "원자 번호 90의 방사성 금속 원소. 우라늄을 대체할 청정 차세대 원자로 연료 후보.", tier: 5 },
    { word: "티읕", startChar: "티", endChar: "읕", definition: "한글 자모의 열두번째 자모 명칭. '읕'으로 시작하는 표준 단어 없음.", tier: 5 },
    { word: "탄탈럼", startChar: "탄", endChar: "럼", definition: "원자 번호 73의 희귀하고 부식에 매우 강한 전이 금속. 스마트폰 콘덴서 부품에 쓰임.", tier: 3 },
    { word: "토마토즙", startChar: "토", endChar: "즙", definition: "붉게 익은 토마토를 갈아 과즙만 모아 마시는 웰빙 주스 음료.", tier: 4 },
    { word: "토마토값", startChar: "토", endChar: "값", definition: "시장에서 신선한 토마토가 도소매 거래되는 유통 가격.", tier: 3 },
    { word: "택시값", startChar: "택", endChar: "값", definition: "택시 탑승 후 이동 거리에 따라 미터기에 찍힌 지불 요금값.", tier: 3 },
    
    // ㅍ
    { word: "파라듐", startChar: "파", endChar: "듐", definition: "원자 번호 46의 백금족 원소. 수소를 흡수하는 특이 성질이 있으며 치과 충전재나 정제용 촉매제에 쓰임.", tier: 5 },
    { word: "패턴", startChar: "패", endChar: "턴", definition: "어떤 일정한 형태나 양식이 반복되는 구조 및 무늬 패턴.", tier: 3 },
    { word: "표면틈", startChar: "표", endChar: "틈", definition: "재료나 벽체 등 물체의 표면층에 미세하게 생긴 갈라진 틈.", tier: 3 },
    { word: "프라세오디뮴", startChar: "프", endChar: "뮴", definition: "원자 번호 59의 전성이 큰 노란 희토류 원소. 자석 합금에 강도 보조.", tier: 5 },
    { word: "프로메튬", startChar: "프", endChar: "튬", definition: "원자 번호 61의 인공 방사성 원소. 야광 도료나 배터리에 제한적 활용.", tier: 5 },
    { word: "프리즘", startChar: "프", endChar: "즘", definition: "빛을 굴절시켜 무지개색 분광을 만드는 삼각 유리 기둥 광학 장치.", tier: 3 },
    { word: "페미니즘", startChar: "페", endChar: "즘", definition: "여성의 사회적 기회와 권리 신장을 옹호하는 사회적 사상 사조.", tier: 3 },
    { word: "포켓", startChar: "포", endChar: "켓", definition: "옷의 주머니를 일컫는 외래어. 소형 크기를 칭하는 데도 쓰임.", tier: 3 },
    { word: "플루토늄", startChar: "플", endChar: "늄", definition: "원자 번호 94의 무겁고 극독성인 방사성 인공 합성 원소. 원자폭탄이나 원자로 연료로 악명 높음.", tier: 5 },
    { word: "피읖", startChar: "피", endChar: "읖", definition: "한글 자음의 열세번째 글자 명칭. '읖'으로 시작하는 단어는 국어사전에 없음.", tier: 5 },
    { word: "포도즙", startChar: "포", endChar: "즙", definition: "신선한 포도 알맹이를 가압하여 짜내 숙성한 진한 건강 즙액.", tier: 4 },
    { word: "필름", startChar: "필", endChar: "름", definition: "사진이나 영화 촬영 시 빛을 기록하는 감광성 테이프 시트 필름.", tier: 3 },
    { word: "프랑슘", startChar: "프", endChar: "슘", definition: "원자 번호 87의 대단히 불안정하고 반응성 극단적인 희귀 천연 방사성 금속 원소.", tier: 5 },
    { word: "페르뮴", startChar: "페", endChar: "뮴", definition: "원자 번호 100의 수소폭탄 잔해에서 발견된 고방사성 인공 원소.", tier: 5 },
    { word: "플레로븀", startChar: "플", endChar: "븀", definition: "원자 번호 114의 초중량 방사성 붕괴 합성 화학 원소.", tier: 5 },
    { word: "피켓", startChar: "피", endChar: "켓", definition: "시위나 홍보 시 손에 들고 구호를 알리는 판자 카드.", tier: 3 },
    { word: "팥즙", startChar: "팥", endChar: "즙", definition: "붉은 팥을 삶아 으깨거나 짜내어 얻은 걸쭉한 즙액.", tier: 4 },
    
    // ㅎ
    { word: "헬륨", startChar: "헬", endChar: "륨", definition: "원자 번호 2의 우주에서 수소 다음으로 흔하며, 반응이 전혀 없는 비활성 기체. 파티 풍선 충전재.", tier: 5 },
    { word: "하프늄", startChar: "하", endChar: "늄", definition: "원자 번호 72의 광택 전이 금속. 중성자를 잘 흡수하여 원자로 제어봉에 다량 필수.", tier: 5 },
    { word: "호박즙", startChar: "호", endChar: "즙", definition: "늙은 호박을 푹 고아 즙을 낸 건강 보조 음료로 부기 제거에 도움.", tier: 4 },
    { word: "해질녘", startChar: "해", endChar: "녘", definition: "해가 지평선으로 지고 어둑해지는 어스름 무렵의 시간.", tier: 5 },
    { word: "홀뮴", startChar: "홀", endChar: "뮴", definition: "원자 번호 67의 강력한 영구 자석 합금에 첨가하는 희토류 원소.", tier: 5 },
    { word: "하슘", startChar: "하", endChar: "슘", definition: "원자 번호 108의 짧은 반감기를 가진 고합성 방사성 원소.", tier: 5 },
    { word: "황혼녘", startChar: "황", endChar: "녘", definition: "해가 지평선 아래로 넘어가 서서히 어두워지는 황혼의 시간 무렵.", tier: 5 },
    { word: "하늘녘", startChar: "하", endChar: "녘", definition: "하늘과 지평선이 맞닿는 아득한 변두리 구역.", tier: 5 },
    { word: "황산나트륨", startChar: "황", endChar: "륨", definition: "염료 합성이나 제지 공업, 세척 비누 원료 등에 유용한 나트륨염.", tier: 5 },
    { word: "히읗", startChar: "히", endChar: "읗", definition: "한글 14대 기본 자음의 마지막 자모 글자 이름. '읗'으로 시작하는 단어는 전혀 없음.", tier: 5 },
    { word: "흙슭", startChar: "흙", endChar: "슭", definition: "흙 언덕이 흘러내린 경계가 되는 흙 비탈의 가장자리 기슭.", tier: 5 },
    { word: "흙그릇", startChar: "흙", endChar: "릇", definition: "가장 기본적인 황토 흙이나 찰진 흙으로 구워 빚어 만든 토기 그릇.", tier: 4 },
    { word: "홍삼즙", startChar: "홍", endChar: "즙", definition: "인삼을 쪄서 말린 홍삼을 장시간 다려 고아 만든 진액 건강 즙액.", tier: 4 },
    { word: "화물삯", startChar: "화", endChar: "삯", definition: "화물을 목적지까지 적재하여 실어 나른 뒤 지불하는 운송삯 비용.", tier: 3 },
    { word: "휴머니즘", startChar: "휴", endChar: "즘", definition: "인간의 가치와 존엄성을 최우선으로 존중하는 인도주의 사상.", tier: 3 },
    { word: "해암탉", startChar: "해", endChar: "탉", definition: "그해에 태어난 어린 암탉을 지칭하는 순우리말 단어.", tier: 5 },
    
    // ㄲ
    { word: "깨밭녘", startChar: "깨", endChar: "녘", definition: "참깨나 들깨를 심어 가꾸는 밭의 가장자리 주변 구역.", tier: 5 },
    { word: "꽁보리즙", startChar: "꽁", endChar: "즙", definition: "꽁보리 싹을 건조하여 착즙해 짜내어 유통하는 영양 보조 즙.", tier: 4 },
    { word: "꽃그릇", startChar: "꽃", endChar: "릇", definition: "꽃을 심어 가꿀 수 있는 배수 구멍이 있는 전용 그릇.", tier: 4 },
    { word: "꼬냑", startChar: "꼬", endChar: "냑", definition: "프랑스의 유명 브랜디 지명 산지의 술 이름.", tier: 5 },
    { word: "끝녘", startChar: "끝", endChar: "녘", definition: "어떤 물건이나 행동 영역의 최남단/최전선 끝부분 지경.", tier: 5 },
    
    // ㄸ
    { word: "딸기즙", startChar: "딸", endChar: "즙", definition: "딸기 과육을 곱게 갈아 과즙만 걸러 낸 달콤한 분홍색 즙액.", tier: 4 },
    { word: "떡값", startChar: "떡", endChar: "값", definition: "명절 등을 맞이하여 직장에서 보조비로 지급되는 특별 수당 수납비.", tier: 3 },
    { word: "뜰녘", startChar: "뜰", endChar: "녘", definition: "집 앞마당이나 뜰마당이 향해 펼쳐진 바깥 공터 구역.", tier: 5 },
    { word: "땅값", startChar: "땅", endChar: "값", definition: "부동산 시장에서 필지 토지가 매매 거래되는 단가 가격.", tier: 3 },
    { word: "땀값", startChar: "땀", endChar: "값", definition: "성실하게 흘린 땀방울 노동에 상응하는 소중한 경제적 대가.", tier: 3 },
    
    // ㅃ
    { word: "빨간양배추즙", startChar: "빨", endChar: "즙", definition: "적양배추(적채)를 착즙하여 붉은색 안토시아닌을 농축한 즙액.", tier: 4 },
    { word: "뺨버릇", startChar: "뺨", endChar: "릇", definition: "화가 나거나 무의식적으로 자신의 뺨을 툭툭 때리는 안 좋은 습관.", tier: 4 },
    { word: "뽕나무즙", startChar: "뽕", endChar: "즙", definition: "뽕나무 열매(오디) 또는 잎을 이용해 추출한 영양 즙액.", tier: 4 },
    
    // ㅆ
    { word: "씨암탉", startChar: "씨", endChar: "탉", definition: "사위가 오면 잡아 대접하는 대가 닭으로, 대를 잇기 위해 기르는 우수 종자 암탉.", tier: 5 },
    { word: "쑥즙", startChar: "쑥", endChar: "즙", definition: "쑥 잎의 에센스를 착즙해 섭취하는 쓰고 진한 진액 음료.", tier: 4 },
    { word: "쌀값", startChar: "쌀", endChar: "값", definition: "국민 식생활의 기본이 되는 백미 쌀의 유통 판매 가격.", tier: 3 },
    
    // ㅉ
    { word: "짜장면값", startChar: "짜", endChar: "값", definition: "중국집에서 판매하는 대중적인 자장면 음식의 한 그릇 가격.", tier: 3 },
    { word: "짝버릇", startChar: "짝", endChar: "릇", definition: "물건을 짝짓거나 무의식적으로 균형을 고치려는 습관적인 고질 버릇.", tier: 4 }
];

// 3. 한글 초성 분해 헬퍼 함수
const HANGUL_START = 0xAC00;
const HANGUL_END = 0xD7A3;
const CHOSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

function getChosung(char) {
    const code = char.charCodeAt(0);
    if (code >= HANGUL_START && code <= HANGUL_END) {
        const index = Math.floor((code - HANGUL_START) / 588);
        return CHOSUNG_LIST[index];
    }
    // 초성 자음 문자 자체인 경우 그대로 반환
    if (CHOSUNG_LIST.includes(char)) {
        return char;
    }
    return null;
}

// 4. 상태 관리 변수
let currentTab = 'all'; // 'all' or 'favorites'
let currentConsonantFilter = 'ALL';
let searchQuery = '';
let currentSort = 'korean'; // 'korean', 'power-desc', 'power-asc'
let favorites = [];

// 로컬 스토리지에서 즐겨찾기 로드
function loadFavorites() {
    const saved = localStorage.getItem('shiritori_favorites');
    if (saved) {
        try {
            favorites = JSON.parse(saved);
        } catch (e) {
            favorites = [];
        }
    }
    updateFavBadgeCount();
}

// 로컬 스토리지에 즐겨찾기 저장
function saveFavorites() {
    localStorage.setItem('shiritori_favorites', JSON.stringify(favorites));
    updateFavBadgeCount();
}

function updateFavBadgeCount() {
    document.getElementById('fav-words-count').textContent = favorites.length;
}

// 5. 단어 리스트 렌더링 함수
function renderWordList() {
    const listContainer = document.getElementById('word-cards-list');
    const leftCol = document.getElementById('word-list-left');
    const rightCol = document.getElementById('word-list-right');

    // 컬럼 내용만 초기화 (컬럼 자체는 유지)
    leftCol.innerHTML = '';
    rightCol.innerHTML = '';
    
    // 기존에 존재하던 결과 없음 메시지가 있다면 제거
    const existingNoResults = listContainer.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }

    // 필터링 적용
    let filtered = WORD_DATABASE.filter(item => {
        // 1. 즐겨찾기 탭 필터
        if (currentTab === 'favorites' && !favorites.includes(item.word)) {
            return false;
        }

        // 2. 초성 퀵 필터
        if (currentConsonantFilter !== 'ALL') {
            const wordChosung = getChosung(item.word[0]);
            if (wordChosung !== currentConsonantFilter) {
                return false;
            }
        }

        // 3. 텍스트 검색 필터
        if (searchQuery) {
            // 자음만 입력했는지 판별
            const isQueryConsonantOnly = [...searchQuery].every(c => CHOSUNG_LIST.includes(c));
            
            if (isQueryConsonantOnly) {
                // 자음 매칭 (단어의 첫 자음이 검색어 자음 문자열로 시작하는지)
                const wordChosungs = [...item.word].map(c => getChosung(c)).join('');
                if (!wordChosungs.includes(searchQuery)) {
                    return false;
                }
            } else {
                // 텍스트 매칭
                const cleanQuery = searchQuery.trim().toLowerCase();
                const wordLower = item.word.toLowerCase();
                
                // 단어 전체 포함 여부 또는 첫글자 매칭
                if (!wordLower.includes(cleanQuery)) {
                    return false;
                }
            }
        }

        return true;
    });

    // 정렬 적용
    filtered.sort((a, b) => {
        if (currentSort === 'korean') {
            return a.word.localeCompare(b.word, 'ko');
        } else if (currentSort === 'power-desc') {
            if (b.tier !== a.tier) {
                return b.tier - a.tier; // 5 -> 4 -> 3
            }
            return a.word.localeCompare(b.word, 'ko');
        } else if (currentSort === 'power-asc') {
            if (a.tier !== b.tier) {
                return a.tier - b.tier; // 3 -> 4 -> 5
            }
            return a.word.localeCompare(b.word, 'ko');
        }
        return 0;
    });

    // 뱃지 업데이트
    document.getElementById('total-words-count').textContent = WORD_DATABASE.length;

    // 결과가 없는 경우 처리
    if (filtered.length === 0) {
        leftCol.style.display = 'none';
        rightCol.style.display = 'none';
        
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <svg class="no-results-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h4>검색된 한방단어가 없습니다.</h4>
            <p>다른 첫 글자를 검색하거나 초성 퀵 필터를 선택해 보세요.</p>
        `;
        listContainer.appendChild(noResults);
        return;
    } else {
        leftCol.style.display = 'flex';
        rightCol.style.display = 'flex';
    }

    // 카드 생성 및 주입
    filtered.forEach((item, index) => {
        const isFav = favorites.includes(item.word);
        const card = document.createElement('div');
        card.className = `word-card glass-panel tier-${item.tier}`;
        
        // 마지막 글자 강조
        const prefix = item.word.slice(0, -1);
        const suffix = item.word.slice(-1);
        
        // 별 아이콘 스트링 생성
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `
                <svg class="star-icon ${i <= item.tier ? 'filled' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${i <= item.tier ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
        }

        // 등급 이름 지정
        let tierName = '보통 공격';
        if (item.tier === 5) tierName = '전설 (방어불가)';
        else if (item.tier === 4) tierName = '영웅 (한방)';
        else if (item.tier === 3) tierName = '희귀 (공격)';

        card.innerHTML = `
            <div class="card-header">
                <div class="word-text-wrapper">
                    <div class="word-term">${prefix}<span class="highlight">${suffix}</span></div>
                    <div class="word-badges">
                        <span class="badge badge-tier-${item.tier}">${tierName}</span>
                        <span class="badge badge-tag">끝글자: ${item.endChar}</span>
                    </div>
                </div>
                <div class="card-actions-top">
                    <button class="icon-btn icon-copy-btn" data-word="${item.word}" title="단어 복사">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button class="icon-btn fav-btn ${isFav ? 'active' : ''}" data-word="${item.word}" title="즐겨찾기 토글">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                    <button class="icon-btn fold-toggle-btn" title="상세 보기 접기/펴기">
                        <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                </div>
            </div>
            <div class="card-details-collapsible">
                <p class="word-def">${item.definition}</p>
                <div class="card-footer">
                    <div class="power-stars" title="공격 위력 별점: ${item.tier}성">
                        ${starsHtml}
                    </div>
                </div>
            </div>
        `;
        
        // 홀수/짝수 인덱스 배분으로 Masonry 효과 생성
        if (index % 2 === 0) {
            leftCol.appendChild(card);
        } else {
            rightCol.appendChild(card);
        }
    });

    // 이벤트 리스너 재바인딩
    bindCardEvents();
}

// 6. 단어 카드 내부 버튼 이벤트 연결
function bindCardEvents() {
    // 카드 자체 클릭 시 접기/펴기 토글 (단, 버튼 클릭 시에는 제외)
    document.querySelectorAll('.word-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.icon-copy-btn') || e.target.closest('.fav-btn')) {
                return;
            }
            card.classList.toggle('expanded');
        });
    });

    // 즐겨찾기 버튼 클릭
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.getAttribute('data-word');
            const index = favorites.indexOf(word);
            if (index > -1) {
                favorites.splice(index, 1);
                btn.classList.remove('active');
                btn.querySelector('svg').setAttribute('fill', 'none');
            } else {
                favorites.push(word);
                btn.classList.add('active');
                btn.querySelector('svg').setAttribute('fill', 'currentColor');
            }
            saveFavorites();
            
            // 즐겨찾기 탭을 보고 있다면 화면 갱신
            if (currentTab === 'favorites') {
                renderWordList();
            }
        });
    });

    // 복사 버튼 클릭
    document.querySelectorAll('.icon-copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.getAttribute('data-word');
            copyToClipboard(word);
        });
    });
}

// 7. 클립보드 복사 유틸 함수
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`"${text}" 단어가 복사되었습니다!`);
    }).catch(err => {
        // 구형 브라우저 대체 기법
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(`"${text}" 단어가 복사되었습니다!`);
        } catch (e) {
            showToast('복사에 실패했습니다.', true);
        }
        document.body.removeChild(textarea);
    });
}

// 8. 토스트 알림창 팝업 함수
let toastTimeout;
function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification');
    const msgSpan = document.getElementById('toast-message');
    const checkIcon = toast.querySelector('.toast-check-icon');
    
    msgSpan.textContent = message;
    
    if (isError) {
        toast.style.borderColor = 'var(--tier-5)';
        checkIcon.style.color = 'var(--tier-5)';
    } else {
        toast.style.borderColor = 'var(--accent-purple)';
        checkIcon.style.color = 'var(--accent-cyan)';
    }
    
    toast.classList.remove('hidden');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// 9. 실시간 단어 분석기 판별기 로직
function analyzeWord() {
    const input = document.getElementById('analyzer-input');
    const resultBox = document.getElementById('analyzer-result-box');
    const word = input.value.trim();

    if (!word) {
        showToast('분석할 단어를 입력해 주세요.', true);
        return;
    }

    // 한글 단어 유효성 검사
    const koreanRegex = /^[가-힣]+$/;
    if (!koreanRegex.test(word)) {
        showToast('한글로만 이루어진 단어를 입력해 주세요.', true);
        return;
    }

    const lastChar = word.slice(-1);
    const rule = ATTACK_RULES[lastChar];

    resultBox.classList.remove('hidden');
    
    if (rule) {
        let badgeClass = 'normal';
        if (rule.tier === 5) badgeClass = 'legendary';
        else if (rule.tier === 4) badgeClass = 'epic';
        else if (rule.tier === 3) badgeClass = 'rare';

        resultBox.innerHTML = `
            <div class="result-card-header">
                <div class="result-word">${word}</div>
                <span class="analysis-badge ${badgeClass}">${rule.name}</span>
            </div>
            <div class="result-analysis-text">
                마지막 글자 <strong>[${lastChar}]</strong> 분석 결과:<br>
                ${rule.desc}
            </div>
            <div class="analysis-tip">
                💡 추천 팁: 게임 진행 중 <strong>${word}</strong>을(를) 던지면 상대가 다음 단어를 잇지 못해 치명타를 입힐 수 있습니다.
            </div>
        `;
    } else {
        // 일반 글자인 경우
        resultBox.innerHTML = `
            <div class="result-card-header">
                <div class="result-word">${word}</div>
                <span class="analysis-badge normal">보통 단어 (방어 가능)</span>
            </div>
            <div class="result-analysis-text">
                마지막 글자 <strong>[${lastChar}]</strong>은(는) 한방 글자가 아닙니다.<br>
                상대방이 [${lastChar}]로 시작하는 단어로 쉽게 맞대응하여 게임을 이어갈 수 있습니다.
            </div>
            <div class="analysis-tip" style="border-left-color: var(--text-muted)">
                💡 상대의 방어를 뚫고 싶다면 끝글자가 <strong>늄, 륨, 튬, 녘, 슭, 즙, 릇</strong> 등으로 끝나는 한방단어를 구사해 보세요!
            </div>
        `;
    }
}

// 10. 끝글자 공격 도감 (Accordion) 생성 함수
function renderRulesGuide() {
    const accordion = document.getElementById('rules-accordion');
    accordion.innerHTML = '';

    // 티어 높은 순, 한글 자모 가나다 순 정렬
    const sortedRules = Object.entries(ATTACK_RULES).sort((a, b) => {
        if (b[1].tier !== a[1].tier) {
            return b[1].tier - a[1].tier;
        }
        return a[0].localeCompare(b[0], 'ko');
    });

    sortedRules.forEach(([key, rule]) => {
        const item = document.createElement('div');
        item.className = 'rule-item';
        
        let tierColor = 'var(--text-secondary)';
        if (rule.tier === 5) tierColor = 'var(--tier-5)';
        else if (rule.tier === 4) tierColor = 'var(--tier-4)';
        else if (rule.tier === 3) tierColor = 'var(--tier-3)';

        item.innerHTML = `
            <div class="rule-header">
                <div class="rule-title">
                    <span class="letter-tag" style="background: rgba(${rule.tier === 5 ? '244,63,94' : rule.tier === 4 ? '251,146,60' : '56,189,248'}, 0.15); color: ${tierColor};">${key}</span>
                    <span style="color: ${tierColor}">${rule.name}</span>
                </div>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div class="rule-content">
                ${rule.desc}
                <div style="margin-top: 0.5rem; font-weight: 700; color: var(--text-primary);">
                    💡 해당 끝글자 단어 예시:
                    <span style="color: var(--accent-cyan); font-weight: 500; display: block; margin-top: 0.25rem;">
                        ${WORD_DATABASE.filter(w => w.endChar === key).map(w => w.word).slice(0, 5).join(', ')} ...
                    </span>
                </div>
            </div>
        `;

        // 헤더 클릭 이벤트 연결
        item.querySelector('.rule-header').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 모든 아코디언 접기
            document.querySelectorAll('.rule-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.rule-content').style.height = '0';
                el.querySelector('.rule-content').style.padding = '0';
            });

            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.rule-content');
                content.style.height = 'auto';
                content.style.padding = '1rem';
            }
        });

        accordion.appendChild(item);
    });
}

// 11. 이벤트 리스너 초기화 및 바인딩
function initEvents() {
    // 텍스트 검색 입력 이벤트
    const searchInput = document.getElementById('word-search-input');
    const clearBtn = document.getElementById('clear-search-btn');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        
        // 지우기 버튼 토글
        if (searchQuery) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
        
        renderWordList();
    });

    // 검색어 지우기 버튼 클릭
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.classList.remove('visible');
        searchInput.focus();
        renderWordList();
    });

    // 초성 퀵 필터 버튼 클릭
    const consonantButtons = document.getElementById('consonant-buttons');
    consonantButtons.addEventListener('click', (e) => {
        const btn = e.target.closest('.consonant-btn');
        if (!btn) return;

        // 액티브 클래스 해제 및 설정
        document.querySelectorAll('.consonant-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentConsonantFilter = btn.getAttribute('data-consonant');
        renderWordList();
    });

    // 정렬 드롭다운 선택
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderWordList();
    });

    // 탭 전환 이벤트
    const tabAll = document.getElementById('tab-all-words');
    const tabFav = document.getElementById('tab-fav-words');

    tabAll.addEventListener('click', () => {
        tabFav.classList.remove('active');
        tabAll.classList.add('active');
        currentTab = 'all';
        renderWordList();
    });

    tabFav.addEventListener('click', () => {
        tabAll.classList.remove('active');
        tabFav.classList.add('active');
        currentTab = 'favorites';
        renderWordList();
    });

    // 실시간 분석기 작동
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.addEventListener('click', analyzeWord);

    const analyzerInput = document.getElementById('analyzer-input');
    analyzerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeWord();
        }
    });
}

// 12. 초기 실행
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    initEvents();
    renderWordList();
    renderRulesGuide();
});
