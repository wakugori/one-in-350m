'use strict';

// ---------- 能力値 ----------
const STATS = { con: '保守', deb: '弁舌', net: '人脈・資金', fame: '知名度', faith: '信仰' };
const START = { con: 10, deb: 10, net: 10, fame: 0, faith: 20 };
const BIRTH = { y: 1993, m: 10, d: 14 };

// ---------- 死因 ----------
// text は「N歳のとき、」に続く文。reason は 2 回目の死から見せる。
// kind: unique = 選んだ出来事に結びついた最期 / fail = 能力不足 / collapse = 整合性 0
const DEATHS = {
  marx: { name: '倒れた本棚', text: 'あの本を返しに行った図書室で、本棚が倒れてきました。', reason: 'この人生の持ち主は、11歳でマルクスを読みません。読んだのは経済学者ミルトン・フリードマンです。' },
  potter: { name: 'フクロウ', text: '誕生日の夜、窓からフクロウが飛び込んできました。手紙は持っていませんでした。', reason: 'この人生に、魔法の入る余地はありません。' },
  musical: { name: 'スポットライト', text: '千秋楽のカーテンコールの最中に、舞台の照明が落ちてきました。', reason: 'この人生の持ち主は、舞台ではなく演台に立つ人です。' },
  giannoulias: { name: '低い空', text: '選挙事務所からの帰り道、空が少しずつ低くなり、やがて地面と見分けがつかなくなりました。', reason: '手伝う陣営が逆です。' },
  tiktok: { name: '時空の矛盾', text: 'TikTok を開こうとした指先から、少しずつ透けていきました。2011年に、TikTok はまだありません。', reason: 'TikTok が世界に広まるのは2017年以降です。' },
  subsidy: { name: '大きなクッキー', text: '補助金で安くなったクッキーを食べていると、学食の天井から直径2メートルのクッキーが落ちてきました。', reason: 'この人生の持ち主は、値段に政府の介入を求めません。' },
  baylor: { name: 'カウボーイハット', text: 'テキサスの大学の門の前で、巨大なカウボーイハットの看板が倒れてきました。', reason: 'この人生の持ち主は、合格した大学に行きません。学位を持たないまま、のちに大学を論じます。' },
  westpoint: { name: '校章', text: '二度目の合格通知を開いた瞬間、空から士官学校の校章が落ちてきました。', reason: '陸軍士官学校は、一度落ちるところまでが筋書きです。' },
  skip_speech: { name: '道路の穴', text: '催しを辞退して帰る途中、白髪の男性を乗せた車とすれ違いました。次の瞬間、道路に突然あいた穴に落ちました。', reason: 'この演説が、すべての始まりでした。' },
  healthcare: { name: '壇上の照明', text: '国民皆保険を訴え終えた直後、壇上の照明が落ちてきました。救急車の費用は自己負担でした。', reason: 'この人生の持ち主は、逆のことを訴えます。' },
  degree_first: { name: '卒業証書', text: '「まずは学位を」と答えた瞬間、老人の姿が消え、代わりに巨大な卒業証書が丸まりながら転がってきました。', reason: '大学に行かないことが、この人生の前提です。' },
  turning_left: { name: '左折', text: '団体の書類を出した帰り道、車で左折したところ、地図に無い道に入り、二度と戻りませんでした。', reason: '名前が逆です。正しくは Turning Point USA です。' },
  buffet: { name: '抜けた床', text: '7皿目のエビに手を伸ばしたとき、テーブルごと床が抜けました。', reason: '階段で投資家を捕まえないと、団体のお金がありません。' },
  dnc: { name: '風船', text: '民主党の大会の会場で、天井から落ちてきた風船の網に絡まりました。', reason: '党が違います。' },
  study: { name: '書架', text: '久しぶりの授業のあと、図書館の書架がドミノのように倒れてきました。', reason: '2年制大学は1学期で辞めるのが筋書きです。' },
  kings: { name: '紙飛行機', text: '受け取った卒業証書が紙飛行機のように舞い上がり、そのまま連れていかれました。', reason: 'この人生の持ち主は、生涯、学位を持ちません。' },
  hillary: { name: '青天の霹靂', text: '投票所を出たところで、雷が落ちました。雲ひとつない日でした。', reason: 'この人生の持ち主は、その一家の側近になります。' },
  johnson: { name: '三叉路', text: '投票の帰り、道が三つに分かれていました。どの道も行き止まりでした。', reason: '第三党を選ぶ人生ではありません。' },
  crowder: { name: '別人', text: '看板を立てた瞬間、「それは別の人のものです」という声が空から響き、画像ごと差し替えられました。', reason: '机に座って看板を出すミームの「Change My Mind」は、別の人物（スティーヴン・クラウダー、2018年）のものです。この人生の持ち主の看板は「Prove Me Wrong」です。' },
  marx_book: { name: '段ボールの山', text: '見本の本が届いた日、段ボールの山が崩れてきました。', reason: '逆の本です。' },
  single: { name: 'コピー機', text: 'ひとり残った夜の事務所で、コピー機が静かにこちらへ倒れてきました。', reason: 'この人生の持ち主は、結婚して2人の子どもを育てます。' },
  atheist: { name: '教会の鐘', text: '日曜の朝、教会の前を通りかかったとき、鐘が落ちてきました。', reason: 'この人生の後半は、信仰とともにあります。' },
  college_return: { name: '動く銅像', text: '入学式の日、創立者の銅像が台座から降りてきて、行く手に立ちはだかりました。', reason: '学位を持たない人が大学を論じる、という筋が成り立たなくなります。' },
  sitout: { name: '沈むソファ', text: '開票速報を見ていたソファが、床ごと地下へ沈んでいきました。', reason: 'この選挙の若者の動員は、この人生の山場のひとつです。' },
  cancel: { name: '日付だけは守られた', text: '家で休んでいた正午すぎ、自宅の庭に隕石が落ちました。', reason: '日付は合っていました。場所が違います。' },
  wrong_utah: { name: 'ユタ大学', text: 'ソルトレイクシティの大学の、誰もいない広場で、机に座った瞬間に地面が割れました。', reason: '会場はユタ大学ではありません。オレムのユタ・バレー大学です。よく間違えられます。' },

  fail_speech: { kind: 'fail', name: '沈黙', text: '壇上で言葉が出ず、沈黙が3分続いたところで、演台が床ごと抜けました。', reason: '弁舌が足りませんでした（30以上）。' },
  fail_montgomery: { kind: 'fail', name: 'ベッドごと', text: '団体を作ると決めた翌朝、ベッドごと消えていました。何を主張すればいいのか、まだ分かっていませんでした。', reason: '保守と弁舌が、どちらも35以上必要でした。' },
  fail_friess: { kind: 'fail', name: '下りの階段', text: '投資家の名前を言い間違えた瞬間、階段がエスカレーターのように下へ動き出し、止まりませんでした。', reason: '弁舌45以上か、人脈・資金35以上が必要でした。' },
  fail_trumpjr: { kind: 'fail', name: '保留音', text: '陣営にかけた電話の保留音が鳴りやまないまま、受話器に吸い込まれました。', reason: '人脈・資金が40以上必要でした。' },
  fail_pmw: { kind: 'fail', name: '切り抜き', text: '机に座って3人目の大学1年生に完璧に言い返され、その切り抜きが拡散した夜、画面の中に吸い込まれました。', reason: '弁舌が55以上必要でした。' },
  fail_election: { kind: 'fail', name: '透明人間', text: 'いくつ大学を回っても誰も気づいてくれず、最後のキャンパスで、本当に透明になりました。', reason: '知名度が70以上必要でした。' },

  c_fridge: { kind: 'collapse', name: '冷蔵庫', text: '空から落ちてきた冷蔵庫の下敷きになりました。中には何も入っていませんでした。' },
  c_bison: { kind: 'collapse', name: 'バイソンの群れ', text: 'このあたりにはいないはずのバイソンの群れが、まっすぐこちらへ向かってきました。' },
  c_meteor: { kind: 'collapse', name: '狙いすました隕石', text: '直径30センチの隕石が、ちょうど立っていた場所に落ちてきました。' },
  c_vending: { kind: 'collapse', name: '自動販売機', text: 'コーラを買おうとした自動販売機が、ゆっくりとこちらへ倒れてきました。' },
  c_eagle: { kind: 'collapse', name: '白頭鷲', text: '国鳥の白頭鷲が、まっすぐ急降下してきました。' },
  c_tornado: { kind: 'collapse', name: '晴天の竜巻', text: '雲ひとつない日に、直径2メートルの小さな竜巻に巻き上げられました。' },
  c_pigeons: { kind: 'collapse', name: '鳩の大群', text: '公園で、数千羽の鳩が一斉にこちらへ飛び立ちました。' },
  c_glitch: { kind: 'collapse', name: '鏡', text: '鏡に映る顔が少しずつ別の誰かに変わっていき、やがて何も映らなくなりました。' },
};
const DEATH_IDS = Object.keys(DEATHS);
const COLLAPSE_IDS = DEATH_IDS.filter(id => DEATHS[id].kind === 'collapse');

// ---------- 人生の出来事 ----------
// choice: t 文言 / fx 能力 / c 整合性 / d 整合性が尽きたときの最期 / death 即座の最期 / req 必要な能力（any: どれか1つ）/ fail 足りないときの最期 / res 結果 / bio 生涯の要約
// years: 出来事の前に流れる年の記録 / pause: ひと息の問い
const EVENTS = [
  { y: 1995, m: 4, title: 'はじめての言葉', text: '1歳半。家族が、あなたの最初の言葉を待っています。', choices: [
    { t: '「ノー」', fx: { con: 5, deb: 5 }, res: '最初の言葉は「ノー」でした。差し出されたスプーンに向かって、はっきりと。両親は顔を見合わせて、少しだけ笑いました。' },
    { t: '「ママ」', fx: { faith: 5 }, c: -10, res: '最初の言葉は「ママ」でした。その晩、母は祖母に三回電話をかけました。' },
    { t: '「わんわん」', c: -10, res: '最初の言葉は「わんわん」でした。家に犬はいません。窓の外の何を見ていたのかは、いまも分かりません。' },
  ] },
  { pause: true, y: 1999, m: 4, years: [[1998, '4歳。三輪車で家の前の坂を下り、初めて膝をすりむきました。']], q: '5歳。あなたが5歳のとき、いちばん欲しかったものは何でしたか。' },
  { y: 2005, m: 4, years: [[1999, '小学校に入りました。'], [2001, '7歳。大人たちがテレビの前で黙りこんだ朝がありました。その日のことは、ずっと覚えています。'], [2003, '9歳。サンタクロースの正体に気づきましたが、しばらく黙っていました。']], title: '図書室', text: '学校の図書室。背の届く棚から、一冊を選びます。', choices: [
    { t: '経済学者ミルトン・フリードマンの本', fx: { con: 15, deb: 5 }, res: '難しい言葉ばかりでしたが、最後まで読みました。「政府にできることは、思っているより少ない」。11歳のあなたには、それが世界の秘密のように思えました。', bio: '11歳で経済学の本を読みました。' },
    { t: '『ハリー・ポッター』', c: -25, d: 'potter', res: '11歳の誕生日に、ホグワーツからの手紙は届きませんでした。それからしばらく、夜になると少しだけ窓の外を気にしていました。' },
    { t: 'カール・マルクスの本', c: -45, d: 'marx', res: '表紙の髭のおじさんが、誰かに似ている気がしました。中身はひとつも分かりませんでしたが、なぜか最後まで読みました。' },
  ] },
  { y: 2007, m: 7, title: 'ボーイスカウト', text: '夏のキャンプ。焚き火の向こうで、隊長があなたに聞きます。「最高位のイーグルスカウトを目指してみるか」', choices: [
    { t: '目指す', fx: { net: 10, faith: 5 }, res: 'ロープの結び方を覚え、山を歩き、知らない家の雪かきをしました。何年もかけて、胸にいちばん重いバッジがつきました。', bio: 'イーグルスカウトになりました。' },
    { t: 'スカウトを辞めて、家でゲームをする', c: -25, res: 'その夏、あなたは画面の向こうで何度も世界を救いました。現実の世界は、特に救われませんでした。' },
    { t: '焚き火を囲んで、政治の話をする', fx: { con: 5, deb: 5 }, c: -5, res: 'マシュマロが焦げるまで、税金の話をしました。誰も聞いていませんでした。それでも、話すのは楽しいことでした。' },
  ] },
  { pause: true, y: 2009, m: 2, years: [[2008, '14歳。初めて大統領選挙を、テレビで最後まで見ました。']], q: '15歳。あなたが15歳のとき、何に腹を立てていましたか。' },
  { y: 2009, m: 9, title: '高校の放課後', text: '高校に入りました。放課後を何に使いますか。', choices: [
    { t: 'バスケットボール部に入る', fx: { net: 10 }, res: 'ベンチを温める日のほうが多い三年間でした。それでも、仲間をどう乗せればいいかは、ベンチからのほうがよく見えました。', bio: '高校ではバスケットボール部でした。' },
    { t: 'スピーチと討論の練習をする', fx: { deb: 15 }, res: '相手の言葉の端をつかむのが、驚くほど得意でした。勝つたびに、少しずつ友達が減りました。', bio: '高校で討論の腕を磨きました。' },
    { t: '演劇部でミュージカルに出る', c: -25, d: 'musical', res: 'どんなに練習しても、ソロの高い音は出ませんでした。カーテンコールで、母がいちばん大きな拍手をしていました。' },
  ] },
  { y: 2010, m: 9, title: '選挙のボランティア', text: '連邦上院議員の選挙。近所の選挙事務所が、高校生のボランティアを募集しています。共和党の候補は、たまたまあなたと同じ名字です（親戚ではありません）。', choices: [
    { t: '同じ名字の、共和党の候補を手伝う', fx: { net: 10, con: 5 }, res: 'チラシを配り、電話をかけ、知らない人に何度も切られました。候補は勝ちました。あなたの名字が、一晩だけ誇らしいものになりました。', bio: '16歳で選挙のボランティアをしました。' },
    { t: '民主党の候補を手伝う', c: -40, d: 'giannoulias', res: '事務所のピザはおいしく、仲間は親切でした。候補は負けました。帰り道、空がいつもより少しだけ低く見えました。' },
    { t: '手伝わない', c: -15, res: 'その秋は、選挙より大事なことがたくさんありました。たとえば、隣のクラスの誰かのことです。' },
  ] },
  { y: 2011, m: 3, title: '歴史の教科書', text: '歴史の教科書を読んでいて、中身がどこか片寄っていると感じました。', choices: [
    { t: '保守系のニュースサイトに意見を送る', fx: { fame: 15, con: 5, deb: 5 }, res: '送った意見は記事になりました。数日後、17歳のあなたはテレビの経済ニュースに出ていました。スタジオの照明は、思っていたよりずっと熱いものでした。', bio: '17歳でテレビに初めて出ました。' },
    { t: 'TikTok に告発の動画を上げる', death: 'tiktok' },
    { t: '先生に質問して、納得する', c: -25, res: '先生は授業のあと、30分かけて丁寧に答えてくれました。あなたは納得しました。教室を出るとき、なぜか少しだけ寂しい気がしました。' },
  ] },
  { y: 2011, m: 11, title: '学食のクッキー', text: '高校最後の年。学食のクッキーが値上げされました。', choices: [
    { t: '値上げに抗議して、ボイコットを呼びかける', fx: { deb: 10, net: 5, fame: 5 }, res: '一週間、誰もクッキーを買いませんでした。値段は元に戻りませんでした。それでもあなたは知りました。人は、正しさよりも怒りでよく動くのだと。', bio: '学食のクッキーのボイコットを率いました。' },
    { t: '黙って買う', c: -15, res: '少し高くなったクッキーは、前と同じ味がしました。' },
    { t: '学区に補助金を求める署名を集める', c: -40, d: 'subsidy', res: '署名は300筆集まりました。学区は補助金を出し、クッキーの値段は元に戻りました。みんなが喜びました。あなたも、少しだけ。' },
  ] },
  { y: 2012, m: 3, flag: '分岐点', title: '進路', text: '第一志望の陸軍士官学校から、不合格の通知が届きました。手元には、テキサスの私立大学の合格通知があります。', choices: [
    { t: '合格した大学には行かず、地元の2年制大学に行く', res: '家から通える2年制大学に決めました。……そこにも、長くはいないことになります。' },
    { t: 'テキサスの大学に進学する', c: -40, d: 'baylor', res: '寮の同室の相手は、生まれて初めて会う種類の人間でした。テキサスの空は広く、自分の町が少しだけ小さく見えました。' },
    { t: '浪人して、士官学校を受け直す', c: -40, d: 'westpoint', res: '一年間、毎朝走りました。二度目の封筒は、一度目より少しだけ厚く見えました。' },
  ] },
  { y: 2012, m: 5, flag: '分岐点', title: '大学の催し', text: '近くの大学で、高校生が政治について話す催しがあります。登壇の枠がひとつ空いています。', choices: [
    { t: '登壇する', req: { deb: 30 }, fail: 'fail_speech', fx: { fame: 5, deb: 5 }, res: '話し終えると、客席の後ろから白髪の男性が近づいてきました。「君、名前は」' },
    { t: '緊張するので、やめておく', death: 'skip_speech' },
    { t: '登壇して、国民皆保険の必要性を訴える', death: 'healthcare' },
  ] },
  { y: 2012, m: 5, flag: '分岐点', title: '白髪の男性', text: '白髪の男性は、引退した実業家だと名乗りました。「大学になんか行くな。団体を作れ」。初めて会った72歳が、18歳のあなたにそう言っています。', choices: [
    { t: '言われたとおりにする', req: { con: 35, deb: 35 }, fail: 'fail_montgomery', fx: { net: 10 }, res: '家に帰って、両親にどう切り出すかを一晩考えました。結局、何も言わずに始めることにしました。', bio: '18歳で団体を立ち上げました。' },
    { t: '「まずは学位を取ってから考えます」', death: 'degree_first' },
    { t: '名刺だけもらっておく', c: -30, res: '名刺は机の引き出しの奥にしまわれました。ときどき夢の中で、あの男性が何か言いかけて、そこで目が覚めました。' },
  ] },
  { y: 2012, m: 6, title: '団体の名前', text: '高校の卒業式の翌日。借りたガレージで、団体の名前を考えます。', choices: [
    { t: 'Turning Point USA', fx: { con: 5 }, res: '「転換点」。ガレージの壁に、マジックで大きく書きました。' },
    { t: 'Turning Left USA', c: -60, d: 'turning_left', res: '書類の受付の人が、一度だけ顔を上げてあなたを見ました。' },
    { t: '若者と考える未来の会', c: -20, res: '誰からも反対されない名前でした。誰からも覚えられない名前でもありました。' },
  ] },
  { y: 2012, m: 8, flag: '分岐点', title: '党大会', text: 'フロリダで開かれた共和党の全国大会に、どうにか潜り込みました。団体にはお金がありません。あなたは大口の献金者25人の顔と名前を暗記してきました。', choices: [
    { t: '階段で投資家を捕まえて、売り込む', req: { deb: 45, net: 35, any: true }, fail: 'fail_friess', fx: { net: 20 }, res: '階段の踊り場でつかまえた投資家と話せたのは、上の階に着くまでの数十秒でした。数週間後、実家の郵便受けに1万ドルの小切手が届きました。', bio: '献金者を階段でつかまえて、団体のお金を得ました。' },
    { t: 'ビュッフェで食べて帰る', c: -40, d: 'buffet', res: 'ビュッフェのエビは、人生でいちばんおいしいエビでした。名刺は一枚も減りませんでした。' },
    { t: '民主党の大会ものぞいてみる', c: -40, d: 'dnc', res: '向こうの会場も、風船の色が違うだけで、熱気は同じでした。あなたは少し混乱して帰りました。' },
  ] },
  { y: 2012, m: 11, title: '授業と団体', text: '2年制大学の授業と、団体の仕事。両方は無理になってきました。', choices: [
    { t: '授業をやめて、団体に専念する', fx: { net: 5 }, res: '1学期で辞めました。学位は、生涯持たないことになります。', bio: '2年制大学を1学期で辞めました。' },
    { t: '団体をたたんで、授業に専念する', c: -50, d: 'study', res: '久しぶりに出た授業で、教授が「いい質問だ」と言ってくれました。ガレージの看板は、雨で少しずつ読めなくなっていきました。' },
    { t: '授業中に、こっそり団体のメールを返す', fx: { net: 5 }, c: -10, res: 'どちらも中途半端になりました。' },
  ] },
  { y: 2014, m: 5, years: [[2013, '20歳。団体の最初の一年が終わりました。事務所はまだガレージです。']], title: '団体を大きくする', text: '団体はまだ小さなままです。何に力を入れますか。', choices: [
    { t: '大学を回って、学生と言い合いを重ねる', fx: { deb: 15, fame: 5 }, res: '知らない大学で、知らない学生と言い合いました。負けた夜は、帰りの車で何度も言い返しを練習しました。' },
    { t: '献金者を回る', fx: { net: 15 }, res: '笑顔で握手をして、同じ話を百回しました。百一回目に、小切手が出てきました。' },
    { t: 'テレビに出続ける', fx: { fame: 15 }, res: 'テレビ局の控え室に、自分用のネクタイを一本置かせてもらうようになりました。' },
    { t: 'ヨーロッパをバックパックで旅する', c: -20, res: 'パリのカフェで、知らない人と政治の話をしました。誰も怒りませんでした。それが、なぜか落ち着きませんでした。' },
  ] },
  { y: 2015, m: 9, title: 'オンライン授業', text: 'ニューヨークの小さな大学で、パートタイムのオンライン授業に登録しました。', choices: [
    { t: 'いつの間にか、やめている', res: 'ログインのパスワードを、いつの間にか忘れていました。' },
    { t: '最後までやり切って、学位を取る', c: -40, d: 'kings', res: '卒業の日、画面越しの拍手を聞きながら、あなたは少しだけ泣きました。' },
    { t: '授業中に、教授を言い負かす', fx: { deb: 5 }, c: -5, res: 'マイクはミュートのままでした。' },
  ] },
  { y: 2016, m: 7, flag: '分岐点', title: '大統領選挙', text: '共和党の候補は、不動産王でテレビの司会者だった男に決まりました。予備選のころ、あなたは彼をあまり好きではありませんでした。', choices: [
    { t: '候補の長男の、移動とメディアの手配を手伝う', req: { net: 40 }, fail: 'fail_trumpjr', fx: { net: 15, fame: 10 }, res: '空港から空港へ走り回り、カメラの位置を決め、コーヒーを買いました。気がつくと、一家の食卓に呼ばれるようになっていました。', bio: '大統領候補の一家の側近になりました。' },
    { t: '民主党の候補を支持する', c: -60, d: 'hillary', res: '投票日の夜、あなたは少しだけ誇らしい気持ちで眠りました。' },
    { t: '第三党の候補に投票する', c: -40, d: 'johnson', res: 'どちらも選ばない、という選び方もあります。開票速報を見ながら、あなたは誰にともなくそう言いました。' },
  ] },
  { y: 2016, m: 11, title: '一覧表', text: '保守的な学生を不当に扱っているとあなたが思う大学教員を、名前つきの一覧にしました。公開しますか。', choices: [
    { t: '公開する', fx: { fame: 10, con: 5 }, res: '一覧は大きな騒ぎになりました。抗議のために「私も載せてくれ」と申し出る教員が、1万人を超えました。', bio: '大学教員の一覧を公開しました。' },
    { t: '公開しない', c: -15, res: '一覧は、パソコンの中で静かに眠りました。' },
    { t: '「お世話になった先生」の一覧に作り変えて公開する', c: -30, res: '昔の先生から、長い手紙が届きました。あなたはそれを、何年も捨てられませんでした。' },
  ] },
  { y: 2018, m: 3, title: '机ひとつ', post: '経済誌の「30歳未満の30人」に選ばれました。', text: '大学のキャンパスの真ん中に、折りたたみの机をひとつ置きます。看板に書く言葉を決めます。', choices: [
    { t: '「Prove Me Wrong（間違っているなら証明してみろ）」', req: { deb: 55 }, fail: 'fail_pmw', fx: { fame: 15, deb: 5 }, res: '学生が列を作りました。何時間もの言い合いは数十秒に切り取られ、何百万回も再生されていきました。切り取られなかった時間がどこへ行ったのかは、誰も知りません。', bio: '大学のキャンパスに机を置き、学生と言い合いを続けました。' },
    { t: '「Change My Mind（考えを変えてみろ）」', death: 'crowder' },
    { t: '「お悩み聞きます」', c: -25, res: '列の三人目は、失恋したばかりの学生でした。あなたは言い合うかわりに、ただ話を聞きました。その日、動画は一本も撮れませんでした。' },
  ] },
  { y: 2020, m: 3, title: 'はじめての本', text: '初めての本を出すことになりました。', choices: [
    { t: '『The MAGA Doctrine』', fx: { fame: 10, con: 5 }, res: '表紙の自分の顔は、思っていたより少し年上に見えました。', bio: '本を何冊か書きました。' },
    { t: '『やさしい資本論』', c: -40, d: 'marx_book', res: '誰に向けた本なのか、編集者にも最後まで分かりませんでした。' },
    { t: '詩集', c: -30, res: '初版は300部でした。そのうちの一冊を、母がいまも枕元に置いています。' },
  ] },
  { y: 2020, m: 10, title: '番組', text: '毎日のトーク番組の話が来ています。', choices: [
    { t: '毎日3時間、話す', fx: { fame: 15, deb: 10 }, res: '聞いている人の顔は見えません。それでもあなたの声は、毎日どこかの車の中に届いていました。', bio: '毎日3時間の番組で話し続けました。' },
    { t: '週に1回、15分だけ話す', fx: { fame: 3 }, c: -10, res: '15分は、言いたいことの半分も言えない長さでした。' },
    { t: '断って、静かに暮らす', c: -35, res: '庭に小さな菜園を作りました。トマトは、テレビより正直でした。' },
  ] },
  { y: 2021, m: 5, flag: '分岐点', title: '結婚', text: '州のミスコンで代表になったことのある女性と、付き合って数年になります。', choices: [
    { t: '結婚する', fx: { faith: 10 }, res: '式では、二人とも神に誓いました。翌年に娘が、その二年後に息子が生まれます。', bio: '配偶者と4年連れ添い、2人の子どもを育てました。' },
    { t: '結婚せず、仕事に生きる', c: -60, d: 'single', res: '仕事は順調でした。夜、事務所の明かりを消すのは、いつもあなたが最後でした。' },
  ] },
  { y: 2021, m: 9, title: '信仰', text: '政治の話をしながら、あなたは少しずつ信仰の話をするようになりました。', choices: [
    { t: '牧師と一緒に、信仰の団体を作る', fx: { faith: 20, con: 5 }, res: '集会の最後に、みんなで祈るようになりました。政治の話と神の話の境目が、少しずつ見えなくなっていきました。', bio: '政治の話に、信仰の話が加わっていきました。' },
    { t: '神はいないと結論する', c: -60, d: 'atheist', res: '日曜の朝が、急に長くなりました。' },
    { t: '瞑想アプリで心を整える', c: -20, res: '毎朝10分、呼吸を数えました。怒りは少し減りました。視聴者も少し減りました。' },
  ] },
  { y: 2022, m: 8, pre: '娘が生まれました。', title: '大学についての本', text: '大学について、本を書くことにしました。', choices: [
    { t: '『The College Scam（大学は詐欺）』', fx: { con: 5, fame: 5 }, res: '大学にほとんど通わなかった人が書いた、大学の本でした。よく売れました。' },
    { t: '大学に入り直して、学び直す', c: -50, d: 'college_return', res: '新入生の中で、あなたはいちばん前の席に座りました。' },
  ] },
  { pause: true, y: 2023, m: 11, q: '30歳。あなたが30歳のとき、誰の隣にいましたか。' },
  { y: 2024, m: 4, pre: 'もうすぐ息子が生まれます。', title: '若い人たちのいる場所', text: '若い人たちは、みんな同じアプリの中にいるようです。', choices: [
    { t: 'TikTok を始める', fx: { fame: 20 }, res: '短く切った言い合いの動画が、政治に興味のない若者のスマートフォンにまで流れていきました。' },
    { t: '「中国のアプリは使わない」と断る', c: -15, res: '筋は通っていました。ただ、若者はみんなそこにいました。' },
    { t: 'TikTok で踊る', fx: { fame: 5 }, c: -15, res: '再生回数は伸びました。コメント欄は、少しだけ優しくありませんでした。' },
  ] },
  { y: 2024, m: 10, flag: '分岐点', title: '若い票', text: '大統領選挙。若い有権者を動かせるかどうかが、鍵になっています。', choices: [
    { t: '大学を回って、若者に投票を呼びかける', req: { fame: 70 }, fail: 'fail_election', fx: { fame: 10, net: 10 }, res: '候補は勝ちました。若い票を動かした一人として、あなたの名前が挙がりました。', bio: '大統領選挙で若者の票を動かしました。' },
    { t: '今回は静観する', death: 'sitout' },
  ] },
  { y: 2025, m: 9, d: 7, title: '東京', text: 'アジアを回っています。日本の新しい政党に招かれ、東京で話すことになりました。', choices: [
    { t: '東京で講演する', fx: { fame: 5 }, res: '千人を超える人が集まりました。日本の人の多くは、まだあなたの名前を知りません。それでも、あなたを撮る人はたくさんいました。', bio: '最後に訪れた外国は、日本でした。' },
    { t: '日本行きを断って、家で過ごす', c: -10, res: '子どもたちと過ごした週末でした。息子は、まだあなたのことを「パパ」としか知りません。' },
    { t: '秋葉原に行く', c: -5, res: 'オムライスに、ケチャップで何か書いてもらいました。何と書いてもらったのかは、誰にも言いませんでした。' },
  ] },
  { y: 2025, m: 9, d: 10, flag: '分岐点', title: 'ユタ州', text: '大学を回る講演ツアーが始まりました。今日はユタ州のキャンパスです。白いテントの下に、机とマイクが用意されています。', choices: [
    { t: 'オレムのユタ・バレー大学で、テントの下に座り、学生の質問に答える', clear: true },
    { t: '体調が悪いことにして、休む', death: 'cancel' },
    { t: 'ソルトレイクシティのユタ大学に向かう', death: 'wrong_utah' },
  ] },
];
const REAL_EVENTS = EVENTS.filter(e => !e.pause).length;

// ---------- 保存（ブラウザごと。消えても動く） ----------
const SAVE_KEY = 'one-in-350m-v2';
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; }
}
function writeSave(s) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* 保存できない環境 */ }
}
let save = Object.assign({ dex: {}, births: 0, deaths: 0, clears: 0 }, loadSave());
// 1 回でも死んだら、修正力の存在が見えるようになる
const revealed = () => save.deaths > 0;

// ---------- 道具 ----------
const $ = id => document.getElementById(id);
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const ageAt = (y, m, d = 15) => y - BIRTH.y - ((m < BIRTH.m || (m === BIRTH.m && d < BIRTH.d)) ? 1 : 0);
const clamp = v => Math.max(0, Math.min(100, v));
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}

// ---------- 状態 ----------
let st = null;
function newLife() {
  st = { stats: Object.assign({}, START), cons: 100, idx: 0, bio: [], notes: [], lastChoice: '', loop: save.deaths + save.clears + 1 };
}

// ---------- タイトル画面 ----------
function initTitle() {
  const states = [['カリフォルニア州', 11.6], ['テキサス州', 10.8], ['フロリダ州', 6.2], ['ニューヨーク州', 5.8], ['ペンシルベニア州', 3.5], ['オハイオ州', 3.5], ['ジョージア州', 3.4], ['イリノイ州', 3.4], ['その他42州', 51.8]];
  $('state-bars').innerHTML = states.map(([n, p]) =>
    `<div class="row"><span>${n}</span><div class="track"><div class="fill" style="width:${Math.min(100, p * 4)}%"></div></div><span class="pct">${p.toFixed(1)}%</span></div>`).join('');

  const feed = [
    { name: 'ブリトニー・ムーア', meta: '女性 · 84歳 · 8分前', body: 'オハイオ州の郊外の、暮らし向きがふつうの家庭に、女の子として生まれました。看護師として38年働いたのち、引退しました。配偶者と52年連れ添い、先に見送りました。3人の子どもを育てました。毎年の感謝祭には、家族全員の七面鳥をひとりで焼きました。84歳のとき、心不全で眠ったまま亡くなりました。', quote: '「七面鳥のレシピを、誰にも教えないまま来てしまった。ごめん」' },
    { name: 'チャーリー', meta: '男性 · 17歳 · 10分前', body: 'イリノイ州の暮らし向きのよい家庭に、男の子として生まれました。イーグルスカウトになりました。高校ではバスケットボール部でした。17歳のとき、空から落ちてきた冷蔵庫の下敷きになりました。中には何も入っていませんでした。', quote: '「冷蔵庫はどこから来たの」' },
    { name: 'ホセ・ラミレス', meta: '男性 · 67歳 · 11分前', body: 'テキサス州エルパソの暮らし向きの苦しい家庭に、男の子として生まれました。2年制大学で溶接を学びました。自分の工場を持ち、12人を雇いました。2人の子どもを大学に行かせました。67歳のとき、肺がんで亡くなりました。', quote: '「子どもを2人とも大学に行かせられた。それだけで100点」' },
  ];
  $('feed').innerHTML = feed.map(f => `<div class="feed-item"><div class="feed-head">${f.name}</div><div class="feed-meta">アメリカ · ${f.meta}</div><p>${f.body}</p><p class="feed-quote">${f.quote}</p></div>`).join('');

  const mem = [
    ['マーガレット・オコナー', '1950 – 2041', '町議会の議員を務めた人生'],
    ['ホセ・ラミレス', '1958 – 2025', '自分の工場を持った人生'],
    ['ジェニファー・パク', '1990 – 2077', '3つの州で暮らした人生'],
    ['チャーリー', '1993 – 2011', '冷蔵庫の下で眠りについた人生'],
    ['ケイレブ・スミス', '2002 – 2089', '消防士として30年働いた人生'],
    ['ブリトニー・ムーア', '1941 – 2025', '看護師として38年働いた人生'],
  ];
  $('memorial').innerHTML = mem.map(([n, y, s]) => `<div class="card"><b>${n}</b><span>${y} · アメリカ</span><br><span>${s}</span></div>`).join('');

  // 出生 362万8,934人/年 ≒ 8.69秒に1人、死亡 307万2,666人/年 ≒ 10.26秒に1人（CDC 2024年の確定値）
  const t0 = Date.now();
  let live = 21763;
  setInterval(() => {
    const s = (Date.now() - t0) / 1000;
    $('cnt-born').textContent = Math.floor(s / 8.69);
    $('cnt-died').textContent = Math.floor(s / 10.26);
    live += Math.round((Math.random() - 0.45) * 6);
    $('live-count').textContent = live.toLocaleString('ja-JP');
  }, 500);

  document.querySelectorAll('.seg[data-group]').forEach(seg => {
    seg.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
      seg.querySelectorAll('.seg-btn').forEach(x => x.classList.toggle('on', x === b));
      const note = document.querySelector(`[data-note-for="${seg.dataset.group}"]`);
      if (note && b.dataset.note) note.textContent = b.dataset.note;
    }));
  });
  updateDexCounts();
}

// ---------- ルーレット ----------
const NAMES = ['マイケル', 'マリア', 'ジェシカ', 'デヴィッド', 'エミリー', 'クリストファー', 'アシュリー', 'ダニエル', 'サラ', 'ケヴィン', 'ブリトニー', 'ホセ', 'ジャスティン', 'アマンダ', 'ブランドン', 'ステファニー', 'デショーン', 'メーガン', 'ルイス', 'ハンナ'];
const PLACES = ['カリフォルニア州', 'テキサス州', 'フロリダ州', 'ニューヨーク州', 'オハイオ州', 'ジョージア州', 'ワシントン州', 'アリゾナ州', 'ミシガン州', 'ペンシルベニア州', 'ルイジアナ州', 'コロラド州', 'テネシー州', 'ハワイ州', 'アラスカ州', 'メイン州'];
function roll() {
  show('screen-roll');
  save.births = (save.births || 0) + 1; writeSave(save);
  const nameEl = $('roll-name'), placeEl = $('roll-place');
  nameEl.classList.remove('final');
  $('roll-note').innerHTML = '&nbsp;';
  let delay = 50, n = 0;
  const step = () => {
    nameEl.textContent = NAMES[Math.floor(Math.random() * NAMES.length)];
    placeEl.textContent = PLACES[Math.floor(Math.random() * PLACES.length)] + ' · ' + (1940 + Math.floor(Math.random() * 86)) + '年';
    n++; delay *= 1.08;
    if (n < 28) setTimeout(step, delay);
    else setTimeout(land, delay + 200);
  };
  const land = () => {
    nameEl.textContent = 'チャーリー';
    nameEl.classList.add('final');
    placeEl.textContent = 'イリノイ州 · 1993年';
    const prev = save.deaths + save.clears;
    $('roll-note').textContent = prev === 0 ? '男の子として生まれます' : prev === 1 ? '……また、チャーリーでした' : `${prev + 1}回目の、チャーリーです`;
    setTimeout(startLife, 2200);
  };
  step();
}

// ---------- 人生 ----------
function startLife() {
  newLife();
  $('life-log').innerHTML = '';
  $('cons-panel').hidden = !revealed();
  addLog(1993, '10月、イリノイ州の暮らし向きのよい家庭に、男の子として生まれました。');
  if (save.deaths === 1 && save.clears === 0) addLog(1993, '生まれたばかりのあなたは、なぜか一度も泣きませんでした。前にも、ここに来たことがあるような顔をしていました。');
  show('screen-life');
  renderSide();
  renderEvent();
}
function addLog(y, text) {
  const li = document.createElement('li');
  li.innerHTML = `<span class="y">${y}</span>${text}`;
  $('life-log').appendChild(li);
  $('life-log').scrollTop = $('life-log').scrollHeight;
}
function renderSide() {
  $('stat-list').innerHTML = '<h3>能力</h3>' + Object.keys(STATS).map(k =>
    `<div class="stat"><span>${STATS[k]}</span><div class="track"><div class="fill" style="width:${clamp(st.stats[k])}%"></div></div><span class="num">${st.stats[k]}</span></div>`).join('');
  const m = $('m-cons');
  m.style.width = st.cons + '%';
  m.classList.toggle('low', st.cons <= 50 && st.cons > 25);
  m.classList.toggle('crit', st.cons <= 25);
  $('v-cons').textContent = st.cons;
}
function renderEvent() {
  const ev = EVENTS[st.idx];
  const age = ageAt(ev.y, ev.m, ev.d);
  (ev.years || []).forEach(([y, t]) => addLog(y, t));
  if (ev.pre) addLog(ev.y, ev.pre);
  $('life-year').textContent = ev.y;
  $('life-age').textContent = age;
  $('ev-when').textContent = `${ev.y}年${ev.m}月${ev.d ? ev.d + '日' : ''} · ${age}歳`;
  $('ev-flag').textContent = revealed() && ev.flag ? ev.flag : '';
  $('ev-result').innerHTML = '';
  const box = $('ev-choices');
  box.innerHTML = '';
  if (ev.pause) return renderPause(ev);
  $('ev-title').textContent = ev.title;
  $('ev-text').textContent = ev.text;
  shuffle(ev.choices).forEach((ch, i) => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = `${i + 1}. ${ch.t}`;
    b.addEventListener('click', () => choose(ch, b));
    box.appendChild(b);
  });
}
function renderPause(ev) {
  $('ev-title').textContent = 'ひと息';
  $('ev-text').innerHTML = `<p class="pause-q">${ev.q}</p><span class="small muted">この人の人生とあなたの人生を重ねて思い浮かべ、よければ一行残しておいてください。</span>`;
  const box = $('ev-choices');
  const ta = document.createElement('textarea');
  ta.rows = 2; ta.maxLength = 120; ta.placeholder = '（書かずに進んでもかまいません）';
  const go = document.createElement('button');
  go.className = 'btn-primary';
  go.textContent = '胸にしまって、続ける';
  go.addEventListener('click', () => {
    const v = ta.value.trim();
    if (v) st.notes.push({ q: ev.q, a: v });
    st.idx++; renderEvent();
  });
  box.append(ta, go);
}
function meets(req) {
  const keys = Object.keys(req).filter(k => k !== 'any');
  const ok = keys.map(k => st.stats[k] >= req[k]);
  return req.any ? ok.some(Boolean) : ok.every(Boolean);
}
function choose(ch, btn) {
  const ev = EVENTS[st.idx];
  document.querySelectorAll('.choice').forEach(b => { b.disabled = true; });
  btn.classList.add('picked');
  st.lastChoice = ch.t;
  if (ch.death) return die(ch.death);
  if (ch.req && !meets(ch.req)) return die(ch.fail);
  if (ch.clear) return clearGame();

  const fxText = [];
  if (ch.fx) for (const k in ch.fx) { st.stats[k] = clamp(st.stats[k] + ch.fx[k]); fxText.push(`${STATS[k]} ${ch.fx[k] > 0 ? '+' : ''}${ch.fx[k]}`); }
  if (ch.c) {
    st.cons = Math.max(0, st.cons + ch.c);
    if (revealed()) fxText.push(`歴史の整合性 ${ch.c}`);
  }
  if (ch.bio) st.bio.push(ch.bio);
  addLog(ev.y, ch.res);
  if (ev.post) addLog(ev.y, ev.post);
  renderSide();

  const r = $('ev-result');
  r.innerHTML = `<p>${ch.res}</p>${fxText.length ? `<p class="fx">${fxText.join(' · ')}</p>` : ''}`;
  const next = document.createElement('button');
  next.className = 'btn-primary';
  if (st.cons <= 0) {
    // 整合性が尽きた。最初の人生では、何の前触れもなく終わる
    next.textContent = '次の年へ';
    next.addEventListener('click', () => die(ch.d && !(ch.d in save.dex) ? ch.d : (ch.d && Math.random() < 0.5 ? ch.d : pickCollapse())));
  } else {
    next.textContent = '次の年へ';
    next.addEventListener('click', () => { st.idx++; renderEvent(); });
  }
  r.appendChild(next);
  next.focus();
}
function pickCollapse() {
  const fresh = COLLAPSE_IDS.filter(id => !save.dex[id]);
  const pool = fresh.length ? fresh : COLLAPSE_IDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- 終わり ----------
function updateDexCounts() {
  const n = Object.keys(save.dex).filter(id => DEATHS[id]).length;
  ['dex-count', 'dex-count2', 'dex-count-top'].forEach(i => { $(i).textContent = n; });
  document.querySelectorAll('.dex-total').forEach(e => { e.textContent = DEATH_IDS.length; });
  $('dex-top-wrap').hidden = !revealed();
  $('btn-dex').hidden = !revealed();
  return n;
}
function lifeSummary() {
  return 'イリノイ州の暮らし向きのよい家庭に、男の子として生まれました。' + st.bio.join('');
}
function renderNotes() {
  const box = $('end-notes');
  box.hidden = !st.notes.length;
  box.innerHTML = '<h3>ひと息で残した言葉</h3><ul class="notes">' + st.notes.map(n => `<li><span class="muted">${n.q}</span><br>${esc(n.a)}</li>`).join('') + '</ul>';
  $('last-word').value = '';
  $('word-note').textContent = '';
}
function statsHtml() {
  return '<h3>最後の能力</h3>' + Object.keys(STATS).map(k =>
    `<div class="stat"><span>${STATS[k]}</span><div class="track"><div class="fill" style="width:${clamp(st.stats[k])}%"></div></div><span class="num">${st.stats[k]}</span></div>`).join('') +
    (revealed() ? `<p class="small muted">歴史の整合性 ${st.cons} / 100</p>` : '');
}
function die(id) {
  const ev = EVENTS[st.idx];
  const age = ageAt(ev.y, ev.m, ev.d);
  const d = DEATHS[id];
  const firstDeath = !revealed();
  const isNew = !(id in save.dex);
  if (isNew) save.dex[id] = age;
  save.deaths++;
  writeSave(save);

  $('end-kicker').textContent = `1993 – ${ev.y} · アメリカ`;
  $('end-title').textContent = 'チャーリー';
  $('end-title').className = 'end-title dead';
  $('end-h-summary').textContent = 'この人生';
  $('end-summary').textContent = lifeSummary() + `${age}歳のとき、${d.text}`;
  if (firstDeath) {
    // 最初の死: 修正力のことはまだ言わない。違和感だけを残す
    $('end-sub').textContent = `${age}歳で、人生を終えました。`;
    $('end-reason').textContent = '……まるで、誰かが帳尻を合わせたかのような最期でした。';
  } else {
    $('end-sub').textContent = `${age}歳で、歴史に修正されました。` + (isNew ? '　死因図鑑に新しく載りました。' : '');
    const reason = d.kind === 'collapse' ? `この人生の持ち主らしくない選択が続き、歴史の整合性が尽きました。最後の選択は「${st.lastChoice}」でした。` : d.reason;
    $('end-reason').textContent = '修正の理由: ' + reason;
  }
  renderNotes();
  $('end-stats').innerHTML = statsHtml();
  setShare(`『3億5千万分の1』でアメリカに生まれ、${age}歳で亡くなりました（${d.name}）。`);
  updateDexCounts();
  setTimeout(() => show('screen-end'), 400);
}
function clearGame() {
  save.clears = (save.clears || 0) + 1;
  writeSave(save);
  const lines = ['2025年9月10日　午後0時23分', 'ユタ州オレム　ユタ・バレー大学', '銃声が一発、響きました。', '場面は描きません。'];
  const ov = document.createElement('div');
  ov.className = 'blackout';
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('show'));
  let i = 0, done = false;
  const finish = () => {
    if (done) return; done = true;
    renderClear();
    show('screen-end');
    ov.classList.remove('show');
    setTimeout(() => ov.remove(), 1300);
  };
  const tick = () => {
    if (done) return;
    if (i < lines.length) { ov.innerHTML = lines.slice(0, ++i).join('<br>'); setTimeout(tick, 1800); }
    else setTimeout(finish, 1600);
  };
  setTimeout(tick, 900);
  ov.addEventListener('click', finish);
}
function renderClear() {
  $('end-kicker').textContent = '1993 – 2025 · アメリカ';
  $('end-title').textContent = 'チャールズ・ジェームズ・カーク';
  $('end-title').className = 'end-title clear';
  $('end-sub').textContent = 'あなたが生きたのは、チャーリー・カークの人生でした。歴史は正しく保たれました。';
  $('end-h-summary').textContent = 'この人生';
  $('end-summary').textContent = lifeSummary() + '31歳のとき、ユタ州オレムのユタ・バレー大学で、学生の質問に答えている最中に撃たれ、亡くなりました。';
  $('end-reason').textContent = '';
  renderNotes();
  $('end-stats').innerHTML = statsHtml() + `<p class="small muted">死因図鑑 ${updateDexCounts()} / ${DEATH_IDS.length}</p>`;
  setShare('『3億5千万分の1』で、ランダムなアメリカ人の人生を最後まで生きました。誰の人生だったかは、遊んで確かめてください。');
}
let shareText = '';
function setShare(text) {
  shareText = text;
  const url = location.href.split('#')[0];
  $('btn-x').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(url);
  $('share-note').innerHTML = '&nbsp;';
}

// ---------- 図鑑 ----------
function renderDex() {
  const kindName = d => d.kind === 'collapse' ? '整合性の崩壊' : d.kind === 'fail' ? '能力不足' : '選択';
  $('dex-list').innerHTML = DEATH_IDS.map(id => {
    const d = DEATHS[id];
    return id in save.dex
      ? `<div class="dex-item"><b>${d.name}</b><span class="age">${save.dex[id]}歳</span><br>${kindName(d)}</div>`
      : `<div class="dex-item locked"><b>？？？</b>${kindName(d)}</div>`;
  }).join('');
  updateDexCounts();
}
let dexBack = 'screen-title';
function openDex(from) { dexBack = from; renderDex(); show('screen-dex'); }

// ---------- 配線 ----------
$('btn-born').addEventListener('click', roll);
$('btn-again').addEventListener('click', roll);
$('btn-dex-born').addEventListener('click', roll);
$('btn-dex').addEventListener('click', () => openDex('screen-end'));
$('btn-dex-top').addEventListener('click', () => openDex('screen-title'));
$('btn-dex-back').addEventListener('click', () => show(dexBack));
$('btn-word').addEventListener('click', () => {
  $('word-note').textContent = $('last-word').value.trim() ? '残しました。' : '';
});
$('btn-share').addEventListener('click', async () => {
  const text = shareText + ' ' + location.href.split('#')[0];
  try { await navigator.clipboard.writeText(text); $('share-note').textContent = 'コピーしました。'; }
  catch (e) { $('share-note').textContent = text; }
});
document.addEventListener('keydown', e => {
  if (!$('screen-life').classList.contains('active') || e.target.tagName === 'TEXTAREA') return;
  const n = parseInt(e.key, 10);
  const btns = [...document.querySelectorAll('.choice')];
  if (n >= 1 && n <= btns.length && !btns[n - 1].disabled) btns[n - 1].click();
});
initTitle();
