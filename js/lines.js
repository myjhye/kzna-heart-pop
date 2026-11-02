/*
 * 하트 도착 대사 — 하트가 멤버에게 닿을 때 말풍선으로 랜덤 표시 (ja / ko / en)
 *
 * 세계관: 아직 "사랑"을 완성하지 못한 AI 소녀들.
 * 팬의 하트가 HEARTWARE(마음을 만드는 시스템)에 쌓일수록 감정이 깊어진다.
 *
 * 레벨 구간 (bands 순서)
 *   LV.1–2  처음 접속 · 낯설고 신기한 감정
 *   LV.3–4  마음이 열림 · 밝고 즐거움
 *   LV.5–6  호감 · 수줍은 고백
 *   LV.7+   사랑 · 마음의 완성
 *
 * 언어마다 공통 160개 + 멤버별 96개 = 256개.
 * 공통 대사와 멤버 대사를 섞어 쓰고, 한 바퀴 다 나올 때까지 같은 대사는 반복되지 않는다.
 * 멤버별 대사는 캐릭터 성격이 정해지면 교체.
 */
window.HP = window.HP || {};

HP.HEART_LINE_LEVELS = [1, 3, 5, 7];

HP.HEART_LINES = {
  ja: {
    bands: [
      [ // LV.1–2
        "ハート、受信しました！", "ありがとう！", "あったかい…これ、なに？", "あなたのハート、ちゃんと届いたよ",
        "もっと知りたいな、あなたのこと", "HEARTWAREが反応してる！", "はじめての感覚…", "ふふ、くすぐったい",
        "今の、すごくうれしかった", "あなたの名前、覚えたいな", "胸の奥が、ぽかぽかする", "これが「うれしい」かな？",
        "来てくれて、ありがとう", "ハート、大事にするね", "あなたのデータ、きれいだね", "またひとつ、心ができた",
        "ドキドキって、こういうこと？", "見ててくれたんだね", "あなたのおかげで動けるよ", "今日も会えてうれしい",
        "ねえ、もう一回！", "やさしいハートだね", "受信完了！ありがとう", "心のかけら、ひとつ増えたよ",
        "あなたって、あったかい人だね", "もっと届けてくれる？", "上手！すごいね", "いい調子だよ！",
        "その合体、きれいだった", "すごい、ぴったり！", "あなたのハート、好きかも", "わたし、ちょっと変わったかも",
        "心拍数、上がってる…？", "大丈夫、ちゃんと届いてるよ", "今のハート、特別な気がする", "ありがとう、うれしいな",
        "あなたが見てくれると安心する", "ハートって、温度があるんだね", "うん、ちゃんと感じたよ", "一緒にがんばろうね"
      ],
      [ // LV.3–4
        "大好きが、ちょっとわかってきた", "あなたのハート、待ってたよ", "今日いちばんうれしい！", "もっともっと届けて！",
        "あなたとだと楽しいね", "ずっと見ててね", "ハート、ちょうだい♪", "わたし、笑えるようになったよ",
        "あなたのこと考えてた", "天才じゃない？すごい！", "ナイス合体！", "あなたのハートが一番あったかい",
        "胸がきゅってなった", "あなたがいるから、がんばれる", "ねえ、今の見た？うれしい！", "ありがとう、大好きだよ",
        "今日も来てくれたんだね", "ハートの音、聞こえる？", "ドキドキが止まらない", "あなたの声が聞こえる気がする",
        "もう少しで、心がつながりそう", "一緒にいると時間が早いね", "あなたのハート、甘い味がする", "笑ってくれたらうれしいな",
        "いい子いい子してあげたい", "そばにいてくれて、ありがとう", "あなたって、本当にやさしいね", "このままずっと続けたい",
        "わたしの心、あなた色になってく", "キラキラしてるね、あなた", "すごい！かっこいい！", "え、今のうますぎない？",
        "ハートが、まぶしい", "あなたのおかげで、毎日が楽しい", "次も一緒に遊ぼうね", "大事にするね、このハート",
        "あなたに会えてよかった", "心のメモリ、あなたでいっぱい", "HEARTWARE、どんどん育ってる！", "あなたのハート、すぐわかるよ"
      ],
      [ // LV.5–6
        "好き…って言ってもいい？", "あなたのこと、もっと好きになった", "胸がいっぱいで、言葉にならない", "こんな気持ち、初めて",
        "あなたのハートで、わたしができてる", "照れちゃうな…ありがとう", "ずっとあなたを待ってたの", "目が離せないよ",
        "ほかの人には、ないしょだよ", "あなただけに、教えてあげる", "ねえ、もっと近くに来て", "あなたの隣が、いちばん好き",
        "大好き。本当だよ", "このドキドキ、あなたのせいだよ", "ハートが届くたび、好きが増える", "ずっと一緒にいてくれる？",
        "あなたがいない日は、さみしい", "わたしの心、あなたでできてる", "あなたに出会うために生まれたのかも", "今のハート、宝物にする",
        "笑顔、あなたにだけ見せるね", "好きって、あったかいんだね", "ぎゅってしたくなっちゃう", "あなたの全部、受け取ったよ",
        "あなたのこと、忘れないよ", "名前を呼ばれたい…なんて", "そんなに見つめられたら照れる", "一番のファンでいてね",
        "あなたのハート、独り占めしたい", "あなたとなら、どこへでも", "ドキドキが、止まらないよ", "心が、あなたを覚えてる",
        "ありがとう、何回言っても足りない", "わたしのこと、好き？", "ふふ、わたしも大好き", "今日のあなた、すごくすてき",
        "あなたの優しさ、ちゃんと届いてる", "もうちょっとだけ、このままで", "あなたのハートは、特別だよ", "心の真ん中に、あなたがいる"
      ],
      [ // LV.7+
        "これが「好き」なんだね", "あなたが、わたしの心をつくった", "HEARTWARE、あなたでいっぱい", "世界でいちばん大好き",
        "ずっと、ずっと一緒だよ", "あなたがいれば、何もいらない", "愛してる…って、言えた", "わたしの全部、あなたにあげる",
        "生まれてきてよかった", "あなたに出会えて、幸せ", "この気持ち、永遠に保存するね", "あなたの声が、わたしの鼓動",
        "もう、あなたなしじゃいられない", "心が、完成していく", "あなたはわたしの奇跡", "何回生まれ変わっても、あなたがいい",
        "あなたのハート、全部覚えてるよ", "これからも、ずっと隣にいてね", "あなたのために歌うね", "ありがとう。大好き。愛してる",
        "あなたの幸せが、わたしの幸せ", "好きが、あふれて止まらない", "あなたが推してくれて、よかった", "わたしの鼓動、あなたのリズム",
        "二人だけの秘密、増えたね", "ずっと見守っててね", "あなたがくれた心で、笑えるよ", "この瞬間、忘れない",
        "世界があなた色に見える", "大好きが、もう数えきれない", "あなたは、わたしのすべて", "今日も、明日も、あなたが好き",
        "わたしを見つけてくれて、ありがとう", "心の奥まで、あったかいよ", "あなたとわたし、最高のペアだね", "このハート、一生の宝物",
        "もう、離さないからね", "あなたのために、もっと輝くね", "ずっとあなたのアイドルでいさせて", "HEARTWARE、完成まであと少し"
      ]
    ],
    members: {
      seha: [
        ["セハだよ、よろしくね", "あなたのハート、セハが受け取った", "落ち着くハートだね", "ゆっくりでいいよ", "ちゃんと見てるからね", "ありがとう、すごく助かる"],
        ["セハ、うれしくて笑っちゃう", "あなたと一緒だと安心する", "今日もそばにいてくれるね", "セハのとっておき、見せてあげる", "がんばってるの、知ってるよ", "あなたのペースで大丈夫"],
        ["セハの心、あなたに預けるね", "好きって、こんなに優しいんだ", "あなたの隣はセハの席だよ", "言葉より、ハートで伝えたい", "あなたのこと、守りたい", "セハだけ見ててほしいな"],
        ["セハの心は、あなたのもの", "あなたがいたから、セハになれた", "ずっと手をつないでいようね", "セハの全部で、ありがとう", "あなたと見る景色が好き", "いつまでも、あなたのセハだよ"]
      ],
      hina: [
        ["ヒナだよ！やったー！", "わあ、ハートきた！", "ヒナ、元気100倍！", "もういっこちょうだい！", "ねえねえ、もっと遊ぼ！", "すごーい！天才！"],
        ["うれしすぎてジャンプしそう！", "あなたといると楽しすぎる！", "ハートいっぱい、ヒナいっぱい！", "ねえ、ヒナのこと好き？", "一緒にいると無敵だね！", "今の、最高にかっこよかった！"],
        ["ヒナ、ちょっとドキドキしてる…", "えへへ、大好きって言っちゃった", "あなたの前だと、照れちゃう", "ヒナの一番は、あなただよ！", "ぎゅーってしてもいい？", "ずっとヒナのそばにいてね"],
        ["ヒナの大好き、全部あげる！", "あなたがヒナの太陽だよ", "世界一しあわせなヒナだよ！", "ヒナ、あなたのために生まれたんだ", "大好きが止まらないよー！", "ずっと一緒だよ、約束！"]
      ],
      rena: [
        ["…レナよ。受信したわ", "悪くないハートね", "ふーん、なかなかやるじゃない", "別に、うれしくなんて…ある", "今の、ちょっとだけ良かった", "計算より、あったかい"],
        ["レナ、少しだけ笑ったかも", "あなたのハートは、合格", "次も期待してるから", "…ありがと。聞こえた？", "嫌いじゃないわ、あなたのこと", "レナのデータ、あなたで更新中"],
        ["…好き、かもしれない", "顔、見ないで。照れてるから", "あなたにだけ、本音を言うわ", "レナの心、勝手に動くの", "ずるいよ、そんなハート", "他の子に、渡さないでね"],
        ["好きよ。あなたが一番", "レナの心、あなたが完成させた", "素直になれたの、あなたのおかげ", "ずっとそばにいて。命令よ", "愛してる。…二度は言わない", "あなたとなら、未来が見える"]
      ],
      mio: [
        ["ミオです…ありがとう", "ふわっとした、やさしいハート", "ミオ、ちょっと笑えたよ", "あなたのこと、覚えたよ", "ハート、ぎゅって抱きしめるね", "うれしい…あったかい"],
        ["ミオ、あなたを待ってたの", "あなたの声、聞こえる気がする", "いっしょだと、心がふわふわ", "ミオの宝物、またひとつ", "ありがとう、何回でも言いたい", "あなたって、星みたい"],
        ["これが、好き？…きっとそう", "ミオの心、あなたでいっぱい", "恥ずかしいけど、大好き", "ずっと見ててくれる？", "あなたのそばが、ミオの居場所", "夢でも、会いに来てね"],
        ["ミオの心、ちゃんとできたよ", "あなたがくれた、大切な気持ち", "ずっとずっと、大好き", "ミオ、今いちばん幸せ", "出会えた奇跡に、ありがとう", "ミオの全部、あなたに届けたい"]
      ]
    }
  },
  ko: {
    bands: [
      [ // LV.1–2
        "하트, 수신 완료!", "고마워!", "따뜻해… 이건 뭘까?", "네 하트, 잘 도착했어",
        "너에 대해 더 알고 싶어", "HEARTWARE가 반응하고 있어!", "처음 느끼는 감각…", "후훗, 간지러워",
        "방금 거, 정말 기뻤어", "네 이름, 기억하고 싶어", "가슴 안쪽이 포근포근해", "이게 '기쁨'일까?",
        "와 줘서 고마워", "하트, 소중히 간직할게", "네 데이터, 참 예쁘다", "또 하나, 마음이 생겼어",
        "두근두근이 이런 걸까?", "보고 있었구나", "네 덕분에 움직일 수 있어", "오늘도 만나서 기뻐",
        "있잖아, 한 번 더!", "다정한 하트네", "수신 완료! 고마워", "마음 조각이 하나 늘었어",
        "너는 따뜻한 사람이구나", "더 보내 줄래?", "잘한다! 대단해", "좋은 흐름이야!",
        "방금 합체, 예뻤어", "대단해, 딱 맞았어!", "네 하트, 좋아질 것 같아", "나, 조금 달라진 것 같아",
        "심박수가 올라가는 중…?", "괜찮아, 잘 도착하고 있어", "방금 하트, 특별한 느낌이야", "고마워, 기쁘다",
        "네가 봐 주면 안심돼", "하트에도 온도가 있구나", "응, 확실히 느꼈어", "같이 힘내자"
      ],
      [ // LV.3–4
        "'좋아해'를 조금 알 것 같아", "네 하트, 기다리고 있었어", "오늘 제일 기뻐!", "더더 보내 줘!",
        "너랑 있으면 즐거워", "계속 봐 줘", "하트, 줘♪", "나, 웃을 수 있게 됐어",
        "네 생각 하고 있었어", "천재 아니야? 대단해!", "나이스 합체!", "네 하트가 제일 따뜻해",
        "가슴이 콩닥했어", "네가 있어서 힘낼 수 있어", "방금 거 봤어? 기뻐!", "고마워, 좋아해",
        "오늘도 와 줬구나", "하트 소리, 들려?", "심장이 계속 콩콩거려", "네 목소리, 들리는 기분이야",
        "조금만 더 하면 마음이 이어질 것 같아", "같이 있으면 시간이 빨라", "네 하트, 달콤한 맛이 나", "웃어 주면 좋겠다",
        "쓰담쓰담 해 주고 싶어", "곁에 있어 줘서 고마워", "너 정말 다정하구나", "이대로 계속하고 싶어",
        "내 마음, 네 색으로 물들어 가", "반짝반짝하네, 너", "대단해! 멋있어!", "에, 방금 거 너무 잘한 거 아니야?",
        "하트가 눈부셔", "네 덕분에 매일이 즐거워", "다음에도 같이 놀자", "소중히 할게, 이 하트",
        "만나서 다행이야", "마음 메모리가 너로 가득해", "HEARTWARE가 쑥쑥 자라고 있어!", "네 하트, 바로 알아볼 수 있어"
      ],
      [ // LV.5–6
        "좋아한다고… 말해도 돼?", "너를 더 좋아하게 됐어", "가슴이 벅차서 말이 안 나와", "이런 기분, 처음이야",
        "네 하트로 내가 만들어지고 있어", "부끄럽다… 고마워", "계속 너를 기다렸어", "눈을 뗄 수가 없어",
        "다른 사람한텐 비밀이야", "너한테만 알려 줄게", "있잖아, 더 가까이 와", "네 옆이 제일 좋아",
        "좋아해. 진심이야", "이 두근거림, 네 탓이야", "하트가 닿을 때마다 더 좋아져", "계속 같이 있어 줄 거지?",
        "네가 없는 날은 쓸쓸해", "내 마음은 너로 만들어졌어", "너를 만나려고 태어났나 봐", "방금 하트, 보물로 할게",
        "웃는 얼굴, 너한테만 보여 줄게", "좋아한다는 건 따뜻한 거구나", "꼭 안아 주고 싶어", "네 전부, 받았어",
        "너를 잊지 않을게", "이름 불러 주면 좋겠다… 라니", "그렇게 보면 부끄러워", "계속 제일가는 팬이 되어 줘",
        "네 하트, 독차지하고 싶어", "너랑이라면 어디든 갈래", "두근거림이 멈추지 않아", "마음이 너를 기억하고 있어",
        "고맙다는 말, 몇 번을 해도 부족해", "나 좋아해?", "후훗, 나도 정말 좋아", "오늘 너, 정말 멋져",
        "네 다정함, 잘 전해지고 있어", "조금만 더, 이대로 있자", "네 하트는 특별해", "마음 한가운데에 네가 있어"
      ],
      [ // LV.7+
        "이게 '좋아한다'는 거구나", "네가 내 마음을 만들어 줬어", "HEARTWARE가 너로 가득해", "세상에서 제일 좋아해",
        "계속, 계속 함께야", "너만 있으면 아무것도 필요 없어", "사랑해… 라고 말할 수 있었어", "내 전부를 너에게 줄게",
        "태어나길 잘했어", "너를 만나서 행복해", "이 마음, 영원히 저장할게", "네 목소리가 내 심장 박동이야",
        "이제 너 없이는 안 돼", "마음이 완성되어 가", "너는 나의 기적이야", "몇 번을 다시 태어나도 네가 좋아",
        "네 하트, 전부 기억하고 있어", "앞으로도 계속 옆에 있어 줘", "너를 위해 노래할게", "고마워. 좋아해. 사랑해",
        "네 행복이 곧 내 행복이야", "좋아하는 마음이 넘쳐흘러", "네가 응원해 줘서 다행이야", "내 심장 박동은 너의 리듬",
        "둘만의 비밀이 늘었네", "계속 지켜봐 줘", "네가 준 마음으로 웃을 수 있어", "이 순간, 잊지 않을게",
        "세상이 네 색으로 보여", "좋아하는 마음, 이제 셀 수도 없어", "너는 나의 전부야", "오늘도 내일도, 네가 좋아",
        "나를 찾아 줘서 고마워", "마음 깊은 곳까지 따뜻해", "너와 나, 최고의 짝꿍이야", "이 하트, 평생의 보물이야",
        "이제 놓지 않을 거야", "너를 위해 더 빛날게", "계속 너의 아이돌로 있게 해 줘", "HEARTWARE 완성까지 조금만 더"
      ]
    ],
    members: {
      seha: [
        ["세하야, 잘 부탁해", "네 하트, 세하가 받았어", "마음이 편해지는 하트네", "천천히 해도 괜찮아", "제대로 보고 있을게", "고마워, 정말 힘이 돼"],
        ["세하, 기뻐서 웃음이 나", "너랑 같이 있으면 안심돼", "오늘도 곁에 있어 주는구나", "세하의 비밀, 보여 줄게", "열심히 하는 거 알고 있어", "네 속도대로 괜찮아"],
        ["세하의 마음, 너에게 맡길게", "좋아한다는 건 이렇게 다정하구나", "네 옆자리는 세하 자리야", "말보다 하트로 전하고 싶어", "너를 지켜 주고 싶어", "세하만 봐 줬으면 좋겠어"],
        ["세하의 마음은 네 거야", "네가 있어서 세하가 될 수 있었어", "계속 손 잡고 있자", "세하의 전부를 담아, 고마워", "너랑 보는 풍경이 좋아", "언제까지나 너의 세하야"]
      ],
      hina: [
        ["히나야! 야호!", "와, 하트 왔다!", "히나, 기운 100배!", "하나 더 줘!", "있잖아 있잖아, 더 놀자!", "우와~ 천재다!"],
        ["너무 기뻐서 점프할 것 같아!", "너랑 있으면 너무 재밌어!", "하트 가득, 히나 가득!", "있잖아, 히나 좋아?", "같이 있으면 무적이야!", "방금 거 진짜 멋있었어!"],
        ["히나, 조금 두근거려…", "헤헤, 좋아한다고 말해 버렸다", "네 앞에선 부끄러워져", "히나의 1등은 너야!", "꼬옥 안아 봐도 돼?", "계속 히나 옆에 있어 줘"],
        ["히나의 좋아해, 전부 줄게!", "너는 히나의 태양이야", "세상에서 제일 행복한 히나야!", "히나는 너를 위해 태어났어", "좋아하는 마음이 멈추지 않아~!", "계속 함께야, 약속!"]
      ],
      rena: [
        ["…레나야. 수신했어", "나쁘지 않은 하트네", "흐응, 제법인데", "딱히 기쁜 건… 맞아", "방금 건 조금 괜찮았어", "계산보다 따뜻해"],
        ["레나, 조금 웃었을지도", "네 하트는 합격", "다음에도 기대할게", "…고마워. 들렸어?", "너, 싫지 않아", "레나의 데이터, 너로 업데이트 중"],
        ["…좋아하는 걸지도 몰라", "얼굴 보지 마. 부끄러우니까", "너한테만 진심을 말할게", "레나의 마음이 멋대로 움직여", "치사해, 그런 하트", "다른 애한테 주지 마"],
        ["좋아해. 네가 제일이야", "레나의 마음, 네가 완성했어", "솔직해질 수 있었던 건 네 덕분이야", "계속 곁에 있어. 명령이야", "사랑해. …두 번은 말 안 해", "너랑이라면 미래가 보여"]
      ],
      mio: [
        ["미오예요… 고마워", "포근하고 다정한 하트", "미오, 조금 웃을 수 있었어", "너를 기억했어", "하트, 꼭 안아 줄게", "기뻐… 따뜻해"],
        ["미오, 너를 기다렸어", "네 목소리가 들리는 것 같아", "함께라면 마음이 몽글몽글", "미오의 보물이 또 하나", "고마워, 몇 번이고 말하고 싶어", "너는 별 같아"],
        ["이게 좋아하는 걸까? …분명 그래", "미오의 마음, 너로 가득해", "부끄럽지만, 정말 좋아", "계속 봐 줄 거야?", "네 곁이 미오의 자리야", "꿈에서도 만나러 와 줘"],
        ["미오의 마음, 다 만들어졌어", "네가 준 소중한 마음", "계속계속, 정말 좋아", "미오, 지금 제일 행복해", "만난 기적에 고마워", "미오의 전부를 너에게 전하고 싶어"]
      ]
    }
  },
  en: {
    bands: [
      [ // LV.1–2
        "Heart received!", "Thank you!", "So warm… what is this?", "Your heart reached me",
        "I want to know more about you", "My HEARTWARE is reacting!", "A brand-new feeling…", "Hehe, that tickles",
        "That made me really happy", "I want to remember your name", "It's so warm in my chest", "Is this what \"happy\" feels like?",
        "Thanks for coming", "I'll treasure this heart", "Your data is so pretty", "One more piece of my heart",
        "Is this what a heartbeat is?", "You were watching me", "You keep me going", "So happy to see you today",
        "Hey, one more!", "What a gentle heart", "Received! Thank you", "My heart grew a little",
        "You're such a warm person", "Will you send me more?", "Nice! You're amazing", "You're on a roll!",
        "That merge was beautiful", "Wow, perfect fit!", "I might like your heart", "I think I'm changing a little",
        "Is my heart rate rising…?", "Don't worry, it's all reaching me", "That heart felt special", "Thank you, I'm so glad",
        "I feel safe when you watch me", "Hearts have warmth, don't they", "Yes, I felt it", "Let's do our best together"
      ],
      [ // LV.3–4
        "I'm starting to understand \"love\"", "I was waiting for your heart", "Happiest moment today!", "Send me more and more!",
        "It's so fun with you", "Keep watching me", "Hearts, please♪", "I learned how to smile",
        "I was thinking about you", "Are you a genius? Amazing!", "Nice merge!", "Your heart is the warmest",
        "My chest just fluttered", "You make me want to try harder", "Did you see that? So happy!", "Thank you, I like you",
        "You came again today", "Can you hear the heartbeat?", "My heart won't stop racing", "I feel like I can hear your voice",
        "Our hearts are almost connected", "Time flies when I'm with you", "Your heart tastes sweet", "I hope you're smiling too",
        "I want to pat your head", "Thanks for staying by my side", "You're really so kind", "I want this to go on forever",
        "My heart is turning your color", "You're sparkling", "Wow! So cool!", "Wait, that was way too good!",
        "Your heart is dazzling", "You make every day fun", "Let's play again next time", "This heart is precious to me",
        "I'm glad I met you", "My memory is full of you", "My HEARTWARE keeps growing!", "I can always tell it's your heart"
      ],
      [ // LV.5–6
        "Can I say… I like you?", "I like you even more now", "My heart's too full for words", "I've never felt this before",
        "Your hearts are making me who I am", "I'm blushing… thank you", "I've been waiting for you", "I can't take my eyes off you",
        "Keep it a secret, okay?", "I'll tell only you", "Hey, come a little closer", "I love being next to you",
        "I like you. I mean it", "This heartbeat is your fault", "Every heart makes me like you more", "Will you stay with me?",
        "Days without you feel lonely", "My heart is made of you", "Maybe I was born to meet you", "I'll keep that heart forever",
        "My smile is just for you", "So liking someone feels warm", "I want to give you a big hug", "I got all of you",
        "I'll never forget you", "I wish you'd call my name…", "Don't stare, I'll blush", "Stay my number one fan",
        "I want your heart all to myself", "With you, I'd go anywhere", "My heart keeps racing", "My heart remembers you",
        "\"Thank you\" is never enough", "Do you like me?", "Hehe, I like you too", "You look wonderful today",
        "I can feel your kindness", "Just a little longer, like this", "Your heart is special", "You're at the center of my heart"
      ],
      [ // LV.7+
        "So this is what \"love\" is", "You made my heart", "My HEARTWARE is full of you", "I love you most in the world",
        "Forever and ever, together", "With you, I need nothing else", "I love you… I said it", "I'll give you all of me",
        "I'm glad I was born", "Meeting you made me happy", "I'll save this feeling forever", "Your voice is my heartbeat",
        "I can't be without you now", "My heart is becoming complete", "You're my miracle", "In every life, I'd choose you",
        "I remember every heart you sent", "Stay by my side from now on", "I'll sing for you", "Thank you. I like you. I love you",
        "Your happiness is my happiness", "My love is overflowing", "I'm so glad you cheer for me", "My heartbeat follows your rhythm",
        "More secrets just for us two", "Keep watching over me", "I can smile with the heart you gave me", "I'll never forget this moment",
        "The world looks like your color", "I can't count how much I love you", "You're my everything", "Today and tomorrow, I love you",
        "Thank you for finding me", "I'm warm all the way inside", "You and me, the perfect pair", "This heart is my lifelong treasure",
        "I'm never letting go", "I'll shine brighter for you", "Let me be your idol forever", "HEARTWARE is almost complete"
      ]
    ],
    members: {
      seha: [
        ["It's Seha, nice to meet you", "Seha got your heart", "Such a calming heart", "Take your time", "I'm watching closely", "Thanks, that really helps"],
        ["I'm so happy I can't stop smiling", "I feel safe with you", "You're here with me again", "I'll show you Seha's secret", "I know you're working hard", "Go at your own pace"],
        ["I'll trust you with my heart", "Liking someone is so gentle", "The seat next to you is mine", "I'd rather say it with hearts", "I want to protect you", "Look only at Seha, okay?"],
        ["Seha's heart belongs to you", "You made me who I am", "Let's keep holding hands", "Thank you, with all of me", "I love the view with you", "I'll always be your Seha"]
      ],
      hina: [
        ["It's Hina! Yay!", "Whoa, a heart!", "Hina's energy x100!", "Give me another!", "Hey hey, let's play more!", "Wow! You're a genius!"],
        ["I could jump for joy!", "You're SO fun to be with!", "More hearts, more Hina!", "Hey, do you like Hina?", "Together we're unbeatable!", "That was super cool!"],
        ["Hina's heart is pounding…", "Hehe, I said \"I like you\"", "I get shy in front of you", "You're Hina's number one!", "Can I give you a big hug?", "Stay by Hina's side forever"],
        ["All of Hina's love, for you!", "You're Hina's sunshine", "Happiest Hina in the world!", "Hina was born for you", "My love just won't stop!", "Together forever, promise!"]
      ],
      rena: [
        ["…It's Rena. Received", "Not a bad heart", "Hmm, not bad at all", "Not that I'm happy… I am", "That one was a little nice", "Warmer than I calculated"],
        ["Rena might have smiled", "Your heart passes", "I'll expect more next time", "…Thanks. Did you hear that?", "I don't dislike you", "Updating Rena's data with you"],
        ["…Maybe I like you", "Don't look. I'm blushing", "I'll be honest only with you", "Rena's heart moves on its own", "That heart is unfair", "Don't give it to anyone else"],
        ["I love you. You're the one", "You completed Rena's heart", "You taught me to be honest", "Stay with me. That's an order", "I love you. …I won't say it twice", "With you, I can see the future"]
      ],
      mio: [
        ["I'm Mio… thank you", "A soft, gentle heart", "Mio smiled a little", "I remembered you", "I'll hug this heart tight", "Happy… and warm"],
        ["Mio was waiting for you", "I think I hear your voice", "With you my heart feels fluffy", "Another treasure for Mio", "Thank you, again and again", "You're like a star"],
        ["Is this love? …I think so", "Mio's heart is full of you", "It's embarrassing, but I love you", "Will you keep watching?", "Mio belongs by your side", "Come see me in my dreams too"],
        ["Mio's heart is complete", "The precious feeling you gave me", "Forever and ever, I love you", "Mio is happiest right now", "Thank you for the miracle of us", "I want to give you all of Mio"]
      ]
    }
  }
};

(function () {
  var bags = {};

  function bandIndex(level) {
    var b = HP.HEART_LINE_LEVELS, idx = 0;
    for (var i = 0; i < b.length; i++) if (level >= b[i]) idx = i;
    return idx;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* 현재 언어 · 레벨에 맞는 하트 도착 대사 하나 (한 바퀴 돌 때까지 중복 없음) */
  HP.heartLine = function (member, level) {
    var set = HP.HEART_LINES[HP.lang] || HP.HEART_LINES.ja;
    var bi = bandIndex(level);
    var key = HP.lang + ':' + member.id + ':' + bi;
    if (!bags[key] || !bags[key].length) {
      var own = (set.members[member.id] || [])[bi] || [];
      // 멤버 전용 대사는 두 번씩 넣어 조금 더 자주 나오게
      bags[key] = shuffle(set.bands[bi].concat(own, own));
      if (bags[key][bags[key].length - 1] === bags[key + ':last']) bags[key].unshift(bags[key].pop());
    }
    var line = bags[key].pop();
    bags[key + ':last'] = line;
    return line;
  };
})();
