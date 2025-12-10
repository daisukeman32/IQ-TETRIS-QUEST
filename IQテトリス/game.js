// 1. DOM要素の取得
const titleScreen = document.getElementById('title-screen');
const gameWrapper = document.getElementById('game-wrapper');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const audienceSelector = document.getElementById('audience-selector');
const speedSelector = document.getElementById('speed-selector');
const startBtn = document.getElementById('start-btn');
const scoreElement = document.getElementById('score');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const helpBtn = document.getElementById('help-btn');
const backToTitleBtn = document.getElementById('back-to-title-btn');
const uiContainer = document.getElementById('ui-container');

// 2. オーディオ要素の作成
const sounds = {
    bgm: new Audio('BGM.mp3'),
    cursor: new Audio('カーソル移動11.mp3'),
    decision: new Audio('決定ボタンを押す.mp3'),
    correct: new Audio('クイズ正解1.mp3'),
    wrong: new Audio('クイズ不正解1.mp3'),
    help: new Audio('おたすけ.mp3'),
    clear: new Audio('大勢で拍手.mp3'),
    congrats: new Audio('「おめでとう」.mp3'),
    lineClear: new Audio('攻撃2.mp3')
};
sounds.bgm.loop = true;

// 3. ゲームの定数と設定
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;
const CLEAR_SCORE = 100;
const COLORS = [null, '#FFC0CB', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A', '#BA55D3', '#F08080'];
const SHAPES = [[], [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]]];
const speedSettings = { easy: 1200, normal: 800, hard: 500 };
const allQuizzes = {
    lowerElem: [
        // 算数
        { q: '10たす20は？', o: ['20', '30', '40'], a: '30' },
        { q: '5たす5は？', o: ['8', '10', '12'], a: '10' },
        { q: '3+4は？', o: ['6', '7', '8'], a: '7' },
        { q: '8ひく3は？', o: ['4', '5', '6'], a: '5' },
        { q: '2+6は？', o: ['7', '8', '9'], a: '8' },
        // 国語・漢字
        { q: '「口」という漢字の読み方は？', o: ['くち', 'め', 'みみ'], a: 'くち' },
        { q: '「犬」の読み方は？', o: ['いぬ', 'ねこ', 'とり'], a: 'いぬ' },
        { q: '「山」の読み方は？', o: ['かわ', 'やま', 'うみ'], a: 'やま' },
        { q: '「月」の読み方は？', o: ['ひ', 'つき', 'ほし'], a: 'つき' },
        // なぞなぞ
        { q: 'パンはパンでも食べられないパンは？', o: ['フライパン', 'メロンパン', 'あんパン'], a: 'フライパン' },
        { q: '逆立ちすると軽くなる動物は？', o: ['イヌ', 'ネコ', 'イルカ'], a: 'イルカ' },
        { q: '頭にかぶる「かさ」ってなーんだ？', o: ['かみのけ', 'ぼうし', 'かみなり'], a: 'かみのけ' },
        { q: 'いつも怒っている動物は？', o: ['ライオン', 'クマ', 'カンガルー'], a: 'カンガルー' },
        { q: '9999回まわると何になる？', o: ['まんかい', 'せんかい', 'ひゃっかい'], a: 'まんかい' },
        { q: '食べると安心するケーキは？', o: ['ホットケーキ', 'チーズケーキ', 'ショートケーキ'], a: 'ホットケーキ' },
        { q: '上からよんでも下からよんでも同じ野菜は？', o: ['トマト', 'キュウリ', 'ナス'], a: 'トマト' },
        // びっくり知識
        { q: 'キリンの睡眠時間は1日どれくらい？', o: ['30分', '3時間', '8時間'], a: '30分' },
        { q: 'イルカは寝るとき何をする？', o: ['目を開けたまま寝る', '逆立ちして寝る', '片目ずつ閉じて寝る'], a: '片目ずつ閉じて寝る' },
        { q: 'タコの心臓はいくつ？', o: ['1つ', '3つ', '5つ'], a: '3つ' },
        { q: 'カタツムリの歯は何本ある？', o: ['0本', '100本', '1万本以上'], a: '1万本以上' },
        { q: 'バナナは木になる？', o: ['木になる', '草になる', '土の中'], a: '草になる' },
        { q: 'ペンギンのひざはどこにある？', o: ['体の中', '足の下', 'ひざはない'], a: '体の中' },
        // 色・形
        { q: '赤と黄色をまぜると何色？', o: ['むらさき', 'オレンジ', 'みどり'], a: 'オレンジ' },
        { q: '信号の「とまれ」は何色？', o: ['あお', 'きいろ', 'あか'], a: 'あか' },
        { q: 'スイカの中は何色？', o: ['みどり', 'あか', 'きいろ'], a: 'あか' },
        // 生活・食べ物
        { q: 'チョコレートは何からできてる？', o: ['カカオ', 'コーヒー', 'くり'], a: 'カカオ' },
        { q: 'ポップコーンは何からできる？', o: ['お米', 'とうもろこし', '小麦'], a: 'とうもろこし' },
        { q: '納豆は何からできる？', o: ['大豆', '小麦', 'お米'], a: '大豆' },
        { q: 'パンはどこの国からきた？', o: ['日本', 'ポルトガル', 'アメリカ'], a: 'ポルトガル' },
        // 動物
        { q: 'ワンワンとなく動物は？', o: ['ねこ', 'いぬ', 'とり'], a: 'いぬ' },
        { q: 'ニャーとなく動物は？', o: ['いぬ', 'ねこ', 'うし'], a: 'ねこ' },
        { q: '卵からうまれる動物は？', o: ['いぬ', 'ねこ', 'にわとり'], a: 'にわとり' },
        { q: '長い首の動物は？', o: ['ゾウ', 'キリン', 'ライオン'], a: 'キリン' },
        { q: '鼻が長い動物は？', o: ['キリン', 'ゾウ', 'サル'], a: 'ゾウ' },
        { q: 'パンダが一番好きな食べ物は？', o: ['ささ', 'にんじん', 'りんご'], a: 'ささ' },
        { q: 'フラミンゴはなぜピンク色？', o: ['生まれつき', '食べ物のせい', '日焼け'], a: '食べ物のせい' },
        { q: 'ラクダのこぶの中身は？', o: ['水', 'しぼう', '空気'], a: 'しぼう' },
        // スポーツ・遊び
        { q: 'サッカーで使うボールはどっち？', o: ['まるい', 'だえん', 'しかく'], a: 'まるい' },
        { q: 'じゃんけんでチョキに勝つのは？', o: ['グー', 'パー', 'チョキ'], a: 'グー' },
        { q: 'おにごっこで逃げる人を何という？', o: ['おに', '子', 'あそびにん'], a: '子' },
    ],
    upperElem: [
        // 算数（4択）
        { q: '「123 + 456」の答えは？', o: ['569', '579', '589', '599'], a: '579' },
        { q: '「15 × 15」の答えは？', o: ['200', '215', '225', '235'], a: '225' },
        { q: '「1000 ÷ 8」の答えは？', o: ['115', '120', '125', '130'], a: '125' },
        { q: '正方形の内角の和は？', o: ['180度', '270度', '360度', '540度'], a: '360度' },
        { q: '円周率πの最初の3桁は？', o: ['3.12', '3.14', '3.16', '3.18'], a: '3.14' },
        // ことわざ（4択）
        { q: '「石の上にも〇〇」。〇〇は？', o: ['一年', '二年', '三年', '五年'], a: '三年' },
        { q: '「〇〇も積もれば山となる」。〇〇は？', o: ['砂', '塵', '雪', '土'], a: '塵' },
        { q: '「二階から〇〇」。〇〇は？', o: ['水', '目薬', '石', '砂'], a: '目薬' },
        { q: '「〇〇の川流れ」。〇〇は？', o: ['馬', '牛', '河童', '魚'], a: '河童' },
        // 理科（4択難問）
        { q: '光が1秒間に進む距離は約？', o: ['3万km', '30万km', '300万km', '3000万km'], a: '30万km' },
        { q: '人間の脳は体重の約何%？', o: ['1%', '2%', '5%', '10%'], a: '2%' },
        { q: '地球から月までの距離は約？', o: ['3800km', '38000km', '38万km', '380万km'], a: '38万km' },
        { q: '人間の心臓は1日に約何回拍動する？', o: ['1万回', '5万回', '10万回', '20万回'], a: '10万回' },
        { q: 'ダイヤモンドより硬い物質は？', o: ['サファイア', 'ルビー', 'ロンズデーライト', 'チタン'], a: 'ロンズデーライト' },
        { q: '太陽系で最も火山活動が活発な天体は？', o: ['金星', '火星', '木星の衛星イオ', '地球'], a: '木星の衛星イオ' },
        { q: '人間の血液型で最も珍しいのは？', o: ['A型', 'B型', 'O型', 'AB型'], a: 'AB型' },
        { q: 'DNAの二重らせん構造を発見したのは？', o: ['アインシュタイン', 'ワトソンとクリック', 'ダーウィン', 'メンデル'], a: 'ワトソンとクリック' },
        // 地理（4択）
        { q: '世界で2番目に大きい国は？', o: ['アメリカ', 'カナダ', '中国', 'ブラジル'], a: 'カナダ' },
        { q: '日本で2番目に高い山は？', o: ['北岳', '奥穂高岳', '間ノ岳', '槍ヶ岳'], a: '北岳' },
        { q: 'アマゾン川が流れる国の数は？', o: ['3カ国', '5カ国', '7カ国', '9カ国'], a: '9カ国' },
        { q: '世界で最も深い海溝は？', o: ['日本海溝', 'マリアナ海溝', 'フィリピン海溝', 'トンガ海溝'], a: 'マリアナ海溝' },
        // 英語（4択）
        { q: '「Restaurant」の意味は？', o: ['病院', 'レストラン', '図書館', '駅'], a: 'レストラン' },
        { q: '「Beautiful」の反対語は？', o: ['Handsome', 'Ugly', 'Pretty', 'Nice'], a: 'Ugly' },
        { q: '「Wednesday」は何曜日？', o: ['月曜', '火曜', '水曜', '木曜'], a: '水曜' },
        // 歴史（4択）
        { q: '鎌倉幕府を開いたのは？', o: ['源頼朝', '源義経', '平清盛', '足利尊氏'], a: '源頼朝' },
        { q: '本能寺の変で倒れた武将は？', o: ['豊臣秀吉', '徳川家康', '織田信長', '武田信玄'], a: '織田信長' },
        { q: '第二次世界大戦が終わった年は？', o: ['1943年', '1944年', '1945年', '1946年'], a: '1945年' },
        // トリビア（4択）
        { q: '世界で最も消費される果物は？', o: ['りんご', 'バナナ', 'オレンジ', 'ぶどう'], a: 'バナナ' },
        { q: 'サッカーのワールドカップ優勝回数最多の国は？', o: ['ドイツ', 'イタリア', 'アルゼンチン', 'ブラジル'], a: 'ブラジル' },
        { q: '世界で最も高いビルがある都市は？', o: ['ニューヨーク', '上海', 'ドバイ', '東京'], a: 'ドバイ' },
        { q: '1年で最も日が短い日を何という？', o: ['春分', '夏至', '秋分', '冬至'], a: '冬至' },
        { q: 'チェスの駒で最も価値が高いのは？', o: ['キング', 'クイーン', 'ルーク', 'ビショップ'], a: 'クイーン' },
    ],
    adult: [
        // 簡単な計算
        { q: '25 + 75 = ?', o: ['90', '100', '110', '95'], a: '100' },
        { q: '100 - 37 = ?', o: ['63', '73', '67', '57'], a: '63' },
        { q: '12 × 5 = ?', o: ['50', '60', '55', '65'], a: '60' },
        { q: '144 ÷ 12 = ?', o: ['11', '12', '13', '14'], a: '12' },
        { q: '1000円で850円の買い物。おつりは？', o: ['50円', '100円', '150円', '200円'], a: '150円' },
        { q: '3割引きで700円。元値は？', o: ['900円', '1000円', '1100円', '910円'], a: '1000円' },
        { q: '時速60kmで2時間走ると何km？', o: ['100km', '120km', '90km', '180km'], a: '120km' },
        { q: '500円の20%は？', o: ['50円', '100円', '150円', '80円'], a: '100円' },
        // 一般常識
        { q: '1年は何日？（平年）', o: ['364日', '365日', '366日', '360日'], a: '365日' },
        { q: '日本の都道府県はいくつ？', o: ['43', '47', '50', '45'], a: '47' },
        { q: '1時間は何秒？', o: ['360秒', '3600秒', '600秒', '6000秒'], a: '3600秒' },
        { q: '地球は太陽の周りを何日で1周？', o: ['365日', '30日', '7日', '100日'], a: '365日' },
        { q: '日本の祝日「建国記念の日」は何月？', o: ['1月', '2月', '3月', '4月'], a: '2月' },
        { q: '干支は全部で何種類？', o: ['10種類', '12種類', '14種類', '8種類'], a: '12種類' },
        // 漢字・言葉
        { q: '「山」の音読みは？', o: ['やま', 'サン', 'かわ', 'セン'], a: 'サン' },
        { q: '「魚」を英語で？', o: ['bird', 'fish', 'meat', 'egg'], a: 'fish' },
        { q: '「Thank you」の意味は？', o: ['さようなら', 'おはよう', 'ありがとう', 'すみません'], a: 'ありがとう' },
        { q: '「猫に小判」と同じ意味のことわざは？', o: ['豚に真珠', '犬も歩けば', '猿も木から', '鳥の目'], a: '豚に真珠' },
        { q: '「急がば回れ」の意味は？', o: ['急いで走れ', '遠回りが安全', 'まっすぐ行け', '止まれ'], a: '遠回りが安全' },
        // 生活の知識
        { q: '水が沸騰する温度は？', o: ['90度', '100度', '110度', '80度'], a: '100度' },
        { q: '人間の平熱は約何度？', o: ['35度', '36度', '37度', '38度'], a: '36度' },
        { q: '1週間は何日？', o: ['5日', '6日', '7日', '8日'], a: '7日' },
        { q: '日本で車は道路のどちら側を走る？', o: ['左側', '右側', '中央', '決まりなし'], a: '左側' },
        { q: 'お米を炊くときに使う家電は？', o: ['電子レンジ', '炊飯器', '冷蔵庫', 'トースター'], a: '炊飯器' },
        // 日本の常識
        { q: '日本の首都は？', o: ['大阪', '京都', '東京', '名古屋'], a: '東京' },
        { q: '日本で一番高い山は？', o: ['富士山', '北岳', '槍ヶ岳', '白山'], a: '富士山' },
        { q: '日本の国旗の真ん中は何色？', o: ['白', '赤', '青', '黄'], a: '赤' },
        { q: '日本の通貨単位は？', o: ['ドル', 'ユーロ', '円', 'ポンド'], a: '円' },
        { q: '富士山がある県は？（2つ）', o: ['東京と神奈川', '静岡と山梨', '長野と新潟', '愛知と岐阜'], a: '静岡と山梨' },
        // 簡単な雑学
        { q: '1ダースは何個？', o: ['10個', '12個', '6個', '24個'], a: '12個' },
        { q: '虹は何色？', o: ['5色', '6色', '7色', '8色'], a: '7色' },
        { q: 'サッカーは1チーム何人？', o: ['9人', '10人', '11人', '12人'], a: '11人' },
        { q: 'トランプのスートは何種類？', o: ['2種類', '3種類', '4種類', '5種類'], a: '4種類' },
        { q: '将棋の駒は全部で何枚？', o: ['20枚', '30枚', '40枚', '50枚'], a: '40枚' },
        // 身近な知識
        { q: '成人年齢は何歳から？（日本）', o: ['16歳', '18歳', '20歳', '21歳'], a: '18歳' },
        { q: '消費税は何%？（2024年時点）', o: ['5%', '8%', '10%', '15%'], a: '10%' },
        { q: '電話の緊急番号「警察」は？', o: ['110', '119', '118', '117'], a: '110' },
        { q: '電話の緊急番号「救急」は？', o: ['110', '119', '118', '117'], a: '119' },
        { q: 'お正月に食べる餅の料理は？', o: ['ぜんざい', '雑煮', '焼き餅', '大福'], a: '雑煮' },
    ],
    extra: [
        // 激ムズ科学
        { q: 'DNAの塩基でアデニンと対になるのは？', o: ['グアニン', 'シトシン', 'チミン', 'ウラシル'], a: 'チミン' },
        { q: 'プランク定数の単位は？', o: ['J・s', 'N・m', 'kg・m/s', 'W・s'], a: 'J・s' },
        { q: 'シュレディンガーの猫が示す概念は？', o: ['相対性理論', '量子重ね合わせ', 'エントロピー', '不確定性原理'], a: '量子重ね合わせ' },
        { q: 'ヒッグス粒子の別名は？', o: ['神の粒子', '悪魔の粒子', '宇宙の種', '時間の素'], a: '神の粒子' },
        { q: '宇宙の年齢は約何億年？', o: ['100億年', '138億年', '150億年', '200億年'], a: '138億年' },
        // 激ムズ歴史
        { q: 'ペロポネソス戦争の対立軸は？', o: ['ローマvsカルタゴ', 'アテネvsスパルタ', 'ペルシアvsギリシャ', 'マケドニアvsペルシア'], a: 'アテネvsスパルタ' },
        { q: '百年戦争の実際の期間は約何年？', o: ['100年', '106年', '116年', '126年'], a: '116年' },
        { q: 'ウェストファリア条約が確立した概念は？', o: ['民主主義', '主権国家体制', '資本主義', '共産主義'], a: '主権国家体制' },
        { q: 'ロゼッタストーンに刻まれている言語の数は？', o: ['2種類', '3種類', '4種類', '5種類'], a: '3種類' },
        // 激ムズ文学・芸術
        { q: 'シェイクスピアの四大悲劇に含まれないのは？', o: ['ハムレット', 'オセロ', 'マクベス', 'ロミオとジュリエット'], a: 'ロミオとジュリエット' },
        { q: 'ノーベル文学賞を辞退した作家は？', o: ['カミュ', 'サルトル', 'ヘミングウェイ', 'フォークナー'], a: 'サルトル' },
        { q: 'ダンテの「神曲」で地獄の最下層にいるのは？', o: ['ユダ', 'カイン', 'ネロ', 'ブルータス'], a: 'ユダ' },
        // 激ムズ哲学
        { q: 'ニーチェの「ツァラトゥストラ」の副題は？', o: ['永劫回帰', '神の死', 'すべての人のため誰のためでもない書', '超人の誕生'], a: 'すべての人のため誰のためでもない書' },
        { q: 'プラトンのイデア論で最高のイデアは？', o: ['美', '善', '真', '正義'], a: '善' },
        { q: 'ウィトゲンシュタインの主著は？', o: ['存在と時間', '論理哲学論考', '純粋理性批判', '精神現象学'], a: '論理哲学論考' },
        // 激ムズ音楽
        { q: 'マーラーの交響曲は何番まである？', o: ['8番', '9番', '10番(未完)', '11番'], a: '10番(未完)' },
        { q: 'ワーグナーの「ニーベルングの指環」は何部作？', o: ['2部作', '3部作', '4部作', '5部作'], a: '4部作' },
        // 激ムズ地理
        { q: 'マリアナ海溝の最深部の名前は？', o: ['チャレンジャー海淵', 'ビトヤズ海淵', 'シレーナ海淵', 'エムデン海淵'], a: 'チャレンジャー海淵' },
        { q: '世界で最も乾燥した場所は？', o: ['サハラ砂漠', 'アタカマ砂漠', '南極大陸', 'ゴビ砂漠'], a: 'アタカマ砂漠' },
        { q: 'プレートテクトニクスで日本は何プレートの上にある？', o: ['1つ', '2つ', '3つ', '4つ'], a: '4つ' },
        // 激ムズ計算
        { q: '√144 = ?', o: ['11', '12', '13', '14'], a: '12' },
        { q: '2の10乗は？', o: ['512', '1024', '2048', '256'], a: '1024' },
        { q: '17 × 19 = ?', o: ['313', '323', '333', '343'], a: '323' },
        { q: '円周率πの小数点以下3桁は？', o: ['3.141', '3.142', '3.143', '3.144'], a: '3.141' },
        // 激ムズ雑学
        { q: 'チェスで最初に動かせない駒は？', o: ['ポーン', 'ナイト', 'ビショップ', 'ルーク'], a: 'ビショップ' },
        { q: 'ナスダックの正式名称に含まれる単語は？', o: ['National', 'American', 'Atlantic', 'Association'], a: 'Association' },
        { q: 'GDPの「D」が意味するのは？', o: ['Development', 'Domestic', 'Demand', 'Distribution'], a: 'Domestic' },
    ]
};

// 4. ゲームの状態に関する変数
let board, score, currentPiece, currentQuiz, canControl, isGameOver, isGameCleared, feedbackElement, helpChances;
let dropCounter, dropInterval, lastTime, animationFrameId;
let selectedAudience = 'lowerElem';
let selectedSpeed = 'easy';
let currentQuizBank = [];
let usedQuizIndexes = []; // 使用済みクイズを追跡
let gameStartTime, wrongAnswerCount, helpUsed;
let correctAnswerCount, totalQuizCount; // 正解数と出題数
const quizContainer = document.getElementById('quiz-container');

// IQ計算関数（細かい計算）
function calculateIQ() {
    const elapsedTime = (Date.now() - gameStartTime) / 1000; // 秒

    // 基本IQ
    let iq = 100;

    // 難易度ボーナス（対象者）
    const audienceBonus = { lowerElem: 0, upperElem: 15, adult: 25, extra: 50 };
    iq += audienceBonus[selectedAudience];

    // スピードボーナス
    const speedBonus = { easy: 0, normal: 15, hard: 30 };
    iq += speedBonus[selectedSpeed];

    // 時間ボーナス（細かく計算）
    if (elapsedTime < 45) {
        iq += 40; // 45秒以内
    } else if (elapsedTime < 60) {
        iq += 35; // 1分以内
    } else if (elapsedTime < 90) {
        iq += 25; // 1.5分以内
    } else if (elapsedTime < 120) {
        iq += 15; // 2分以内
    } else if (elapsedTime < 180) {
        iq += 5; // 3分以内
    } else if (elapsedTime > 300) {
        iq -= 15; // 5分以上
    } else if (elapsedTime > 240) {
        iq -= 10; // 4分以上
    }

    // 正解率ボーナス（重要！）
    const accuracy = totalQuizCount > 0 ? (correctAnswerCount / totalQuizCount) : 0;
    if (accuracy >= 1.0) {
        iq += 25; // 全問正解
    } else if (accuracy >= 0.9) {
        iq += 15; // 90%以上
    } else if (accuracy >= 0.8) {
        iq += 10; // 80%以上
    } else if (accuracy >= 0.7) {
        iq += 5; // 70%以上
    } else if (accuracy < 0.5) {
        iq -= 10; // 50%未満
    }

    // お助け未使用ボーナス
    if (!helpUsed) {
        iq += 20;
    } else {
        iq -= 10;
    }

    // 間違い回数ペナルティ（1回ごとに3点減点）
    iq -= Math.min(wrongAnswerCount * 3, 30);

    // スコアボーナス（100点以上の余剰分）
    if (score > 100) {
        iq += Math.floor((score - 100) / 10) * 2;
    }

    // 最低50、最高200に制限
    return Math.max(50, Math.min(200, Math.round(iq)));
}

// IQに応じたコメント（20段階）
function getIQComment(iq) {
    if (iq >= 195) return '神降臨！人類の頂点に立つ知能！';
    if (iq >= 190) return '超越者！歴史に名を残すレベル！';
    if (iq >= 185) return '異次元の天才！アインシュタイン級！';
    if (iq >= 180) return '超天才！あなたは天才の中の天才！';
    if (iq >= 175) return '驚異的！メンサ会員確実！';
    if (iq >= 170) return '天才確定！世界が注目する知性！';
    if (iq >= 165) return '天才の可能性大！輝く未来が見える！';
    if (iq >= 160) return '秀才中の秀才！素晴らしい頭脳！';
    if (iq >= 155) return '非凡な才能！周りと差がつく実力！';
    if (iq >= 150) return '優秀！頭脳明晰ですね！';
    if (iq >= 145) return 'かなりの実力者！自信を持って！';
    if (iq >= 140) return '素晴らしい知性の持ち主！';
    if (iq >= 135) return '頭の回転が速い！センス抜群！';
    if (iq >= 130) return 'なかなかやるね！ポテンシャル高い！';
    if (iq >= 120) return '平均以上！いい感じです！';
    if (iq >= 110) return '標準的！コツコツ伸ばそう！';
    if (iq >= 100) return 'まずまず！伸びしろあり！';
    if (iq >= 90) return 'もう少し頑張ろう！次に期待！';
    if (iq >= 80) return '練習あるのみ！諦めないで！';
    if (iq >= 70) return 'ドンマイ！また挑戦しよう！';
    return '気にしない！楽しむことが大事！';
}

// 5. UIと画面管理
function showTitleScreen() {
    sounds.bgm.pause();
    sounds.bgm.currentTime = 0;
    titleScreen.classList.remove('hidden');
    gameWrapper.classList.add('hidden');
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function showGameScreen() {
    titleScreen.classList.add('hidden');
    gameWrapper.classList.remove('hidden');
}

function setupTitleScreen() {
    audienceSelector.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            playSound(sounds.cursor);
            audienceSelector.querySelector('.selected').classList.remove('selected');
            e.target.classList.add('selected');
            selectedAudience = e.target.dataset.value;
        }
    });
    speedSelector.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            playSound(sounds.cursor);
            speedSelector.querySelector('.selected').classList.remove('selected');
            e.target.classList.add('selected');
            selectedSpeed = e.target.dataset.value;
        }
    });
    startBtn.addEventListener('click', startGame);
    backToTitleBtn.addEventListener('click', showTitleScreen);
}

// 6. ゲームのメインロジック
function startGame() {
    playSound(sounds.decision);
    currentQuizBank = allQuizzes[selectedAudience];
    dropInterval = speedSettings[selectedSpeed];
    showGameScreen();
    newGame();
    playSound(sounds.bgm);
}

function init() {
    ctx.canvas.width = COLS * BLOCK_SIZE;
    ctx.canvas.height = ROWS * BLOCK_SIZE;
    setupTitleScreen();
    showTitleScreen();
}

function gameLoop(time = 0) {
    if (isGameOver || isGameCleared) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();
    // ゲームクリア/オーバー後は描画しない（結果画面が消えるのを防ぐ）
    if (isGameOver || isGameCleared) return;
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function newGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    scoreElement.textContent = score;
    isGameOver = false;
    isGameCleared = false;
    helpChances = 1;
    helpUsed = false;
    wrongAnswerCount = 0;
    correctAnswerCount = 0;
    totalQuizCount = 0;
    usedQuizIndexes = []; // 使用済みクイズをリセット
    gameStartTime = Date.now();
    helpBtn.disabled = false;
    helpBtn.textContent = `おたすけ (${helpChances}回)`;
    if (!feedbackElement) {
        feedbackElement = document.createElement('p');
        feedbackElement.id = 'feedback';
        answersElement.insertAdjacentElement('afterend', feedbackElement);
        feedbackElement.style.cssText = 'color: red; font-weight: bold; text-align: center; margin-top: 10px; min-height: 1em;';
    }
    lastTime = 0;
    newTurn();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function newTurn() {
    canControl = false;
    quizContainer.style.visibility = 'visible'; // クイズ部分だけ表示
    quizContainer.style.pointerEvents = 'auto';
    newPiece();
    newQuiz();
    if (isColliding(currentPiece)) {
        gameOver();
        return;
    }
    dropCounter = 0;
}

function newPiece() {
    const rand = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    currentPiece = { shape: SHAPES[rand], color: COLORS[rand], colorIndex: rand, x: Math.floor(COLS / 2) - 1, y: 0 };
}

function newQuiz() {
    feedbackElement.textContent = '';
    totalQuizCount++;

    // 重複しないクイズを選択
    let availableIndexes = [];
    for (let i = 0; i < currentQuizBank.length; i++) {
        if (!usedQuizIndexes.includes(i)) {
            availableIndexes.push(i);
        }
    }
    // 全て使い切ったらリセット
    if (availableIndexes.length === 0) {
        usedQuizIndexes = [];
        availableIndexes = currentQuizBank.map((_, i) => i);
    }

    const randIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    usedQuizIndexes.push(randIndex);
    currentQuiz = currentQuizBank[randIndex];

    questionElement.textContent = currentQuiz.q;
    answersElement.innerHTML = '';
    const options = [...currentQuiz.o].sort(() => Math.random() - 0.5);
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'answer-btn';
        button.onclick = () => handleAnswer(option);
        answersElement.appendChild(button);
    });
}

function handleAnswer(selectedOption) {
    if (canControl || isGameOver || isGameCleared) return;
    if (selectedOption === currentQuiz.a) {
        playSound(sounds.correct);
        canControl = true;
        correctAnswerCount++;
        quizContainer.style.visibility = 'hidden'; // クイズ部分だけ非表示
        quizContainer.style.pointerEvents = 'none';
        feedbackElement.textContent = '';
    } else {
        playSound(sounds.wrong);
        wrongAnswerCount++;
        feedbackElement.textContent = 'まちがい！もう一度！';
    }
}

function useHelp() {
    if (helpChances > 0 && !canControl) {
        playSound(sounds.help);
        helpChances--;
        helpUsed = true;
        canControl = true;
        quizContainer.style.visibility = 'hidden'; // クイズ部分だけ非表示
        quizContainer.style.pointerEvents = 'none';
        helpBtn.textContent = `おたすけ (${helpChances}回)`;
        if (helpChances === 0) helpBtn.disabled = true;
    }
}

function lockPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                if (currentPiece.y + y >= 0) board[currentPiece.y + y][currentPiece.x + x] = currentPiece.colorIndex;
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(value => value > 0)) {
            linesCleared++;
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            y++;
        }
    }
    if (linesCleared > 0) {
        playSound(sounds.lineClear);
        score += linesCleared * 10;
        scoreElement.textContent = score;
        if (score >= CLEAR_SCORE && !isGameCleared) {
            gameClear();
        }
    }
}

function gameClear() {
    isGameCleared = true;
    sounds.bgm.pause();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    playSound(sounds.clear);
    setTimeout(() => playSound(sounds.congrats), 1500);

    // IQ計算
    const iq = calculateIQ();
    const comment = getIQComment(iq);

    // クリア画面を描画
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.fillRect(0, canvas.height / 2 - 120, canvas.width, 240);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px "M PLUS Rounded 1c"';
    ctx.textAlign = 'center';
    ctx.fillText('ゲームクリア！', canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = 'bold 16px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#666';
    ctx.fillText('あなたのIQは...', canvas.width / 2, canvas.height / 2 - 45);

    // IQ数値を大きく表示
    ctx.font = 'bold 60px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#e74c3c';
    ctx.fillText(iq, canvas.width / 2, canvas.height / 2 + 25);

    // コメント
    ctx.font = 'bold 18px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#27ae60';
    ctx.fillText(comment, canvas.width / 2, canvas.height / 2 + 60);

    ctx.font = '14px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#888';
    ctx.fillText('クリックでタイトルへ', canvas.width / 2, canvas.height / 2 + 100);
}

function gameOver() {
    isGameOver = true;
    sounds.bgm.pause();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
    ctx.fillStyle = 'white';
    ctx.font = '30px "M PLUS Rounded 1c"';
    ctx.textAlign = 'center';
    ctx.fillText('ゲームオーバー', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '16px "M PLUS Rounded 1c"';
    ctx.fillText('クリックでタイトルへ', canvas.width / 2, canvas.height / 2 + 25);
}

function playSound(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(error => {
        console.error(`Audio playback failed: ${error.message}`);
    });
}

// 7. プレイヤー操作とイベントリスナー
document.addEventListener('keydown', e => {
    if (!canControl || isGameOver || isGameCleared) return;
    if (e.key === 'ArrowLeft') playerMove(-1);
    else if (e.key === 'ArrowRight') playerMove(1);
    else if (e.key === 'ArrowDown') playerDrop();
    else if (e.key === 'ArrowUp') playerRotate();
});
canvas.addEventListener('click', () => { if (isGameOver || isGameCleared) showTitleScreen(); });
helpBtn.addEventListener('click', useHelp);

// スワイプ・タップ操作（スマホ用）
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
const SWIPE_THRESHOLD = 30; // スワイプ判定の最小距離
const TAP_THRESHOLD = 10;   // タップ判定の最大移動距離

function handleTouchControl(action) {
    if (!canControl || isGameOver || isGameCleared) return;
    action();
}

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isGameOver || isGameCleared) {
        showTitleScreen();
        return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // タップ判定（移動距離が小さい場合）
    if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
        handleTouchControl(() => playerRotate());
        return;
    }

    // スワイプ判定
    if (absX > absY && absX > SWIPE_THRESHOLD) {
        // 横スワイプ
        if (deltaX > 0) {
            handleTouchControl(() => playerMove(1));  // 右
        } else {
            handleTouchControl(() => playerMove(-1)); // 左
        }
    } else if (absY > absX && absY > SWIPE_THRESHOLD) {
        // 縦スワイプ（下のみ反応）- ハードドロップ
        if (deltaY > 0) {
            handleTouchControl(() => hardDrop()); // 下
        }
    }
}, { passive: false });

// 連続スワイプ対応（指を動かしながら移動）
let lastMoveX = 0;
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!canControl || isGameOver || isGameCleared) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const moveStep = Math.floor(deltaX / 40); // 40px毎に1マス移動

    if (moveStep !== lastMoveX) {
        const diff = moveStep - lastMoveX;
        if (diff > 0) {
            handleTouchControl(() => playerMove(1));
        } else if (diff < 0) {
            handleTouchControl(() => playerMove(-1));
        }
        lastMoveX = moveStep;
    }
}, { passive: false });

canvas.addEventListener('touchstart', () => { lastMoveX = 0; }, { passive: true });

function playerMove(offset) {
    if (!isColliding(currentPiece, offset, 0)) currentPiece.x += offset;
}

function playerDrop() {
    if (!isColliding(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        lockPiece();
        clearLines();
        if (!isGameCleared) newTurn();
    }
    dropCounter = 0;
}

function hardDrop() {
    while (!isColliding(currentPiece, 0, 1)) {
        currentPiece.y++;
    }
    lockPiece();
    clearLines();
    if (!isGameCleared) newTurn();
    dropCounter = 0;
}

function playerRotate() {
    const shape = currentPiece.shape;
    const newShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
    if (!isColliding({ ...currentPiece, shape: newShape }, 0, 0)) currentPiece.shape = newShape;
}

// 8. 当たり判定
function isColliding(piece, offsetX = 0, offsetY = 0) {
    const shape = piece.shape || piece;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) return true;
            }
        }
    }
    return false;
}

// 9. 描画
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            ctx.strokeStyle = '#f0f0f0';
            ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    drawBoard();
    if (!isGameOver && !isGameCleared) drawPiece();
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function drawPiece() {
    if (!currentPiece) return;
    ctx.fillStyle = currentPiece.color;
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const pieceX = currentPiece.x + x;
                const pieceY = currentPiece.y + y;
                ctx.fillRect(pieceX * BLOCK_SIZE, pieceY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(pieceX * BLOCK_SIZE, pieceY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

// 10. ゲーム起動
document.addEventListener('DOMContentLoaded', init);