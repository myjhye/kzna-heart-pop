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
        "하트 받았다!", "고마워~", "와, 따뜻해", "방금 그거 나한테 준 거야?",
        "헤헤, 기분 좋다", "처음 느껴 보는 기분이야", "잘했어, 진짜!", "오~ 센스 있는데?",
        "나 지금 좀 설렌 것 같아", "하트 도착 완료!", "이 느낌 뭐지? 좋다", "더 줘도 되는데~",
        "와줘서 고마워", "오늘 처음 웃은 것 같아", "너 손 진짜 빠르다", "방금 합체 완전 깔끔해",
        "나 이거 좋아하나 봐", "마음이 몽글몽글해", "하나 더 줄 수 있지?", "너랑 하니까 재밌다",
        "HEARTWARE가 반응했어!", "천천히 해도 괜찮아", "나 보고 있는 거 다 알아", "응원해 줘서 고마워",
        "기억해 둘게, 이 하트", "뭔가 간질간질해", "오늘 컨디션 좋아 보인다", "우와, 대박!",
        "이렇게 받는 거 처음이야", "너 덕분에 힘 난다", "아까보다 더 따뜻해졌어", "좋아, 이 기세로 가자!",
        "헤헤, 또 왔다", "조금씩 알 것 같아", "나만 보고 있는 거지?", "고마워, 진짜로",
        "방금 좀 감동했어", "이거 계속 받고 싶다", "너 은근 잘한다?", "같이 끝까지 가 보자"
      ],
      [ // LV.3–4
        "보고 싶었어!", "오늘도 와줘서 고마워", "너 오면 기분이 좋아져", "하트 더더더!",
        "우리 진짜 잘 맞는다", "나 요즘 너 생각 많이 해", "완전 최고야!", "웃음이 멈추질 않아",
        "너 진짜 천재 아니야?", "방금 거 소름 돋았어", "좋아한다는 거, 이제 좀 알 것 같아", "너랑 있으면 시간 순삭이야",
        "오늘따라 더 멋있다", "하트 받을 때마다 신나", "나 칭찬해 줘~", "우리 콤비 좋지 않아?",
        "가슴이 콩닥콩닥해", "나 지금 엄청 행복해", "너 없었으면 어쩔 뻔했어", "계속 옆에 있어 줄 거지?",
        "오늘도 고생 많았어", "조금만 더 하면 레벨 업이야!", "네 하트는 딱 보면 알아", "너한테 자랑하고 싶은 게 많아",
        "이 노래 너한테 불러 주고 싶다", "이 정도면 우리 찐친이지?", "너 웃는 거 상상했어", "하트가 반짝반짝해",
        "이대로 쭉 가자!", "너만 믿을게", "진짜 든든하다", "오늘 하루 중에 지금이 제일 좋아",
        "쓰담쓰담 해 줄게", "기다리고 있었어, 진짜로", "너랑 노는 게 제일 재밌어", "마음이 점점 커져",
        "HEARTWARE 쑥쑥 자라는 중!", "나 오늘 예뻐?", "에헤헤, 부끄럽다", "고마워, 우리 팬!"
      ],
      [ // LV.5–6
        "나… 너 좋아하나 봐", "너만 보면 두근거려", "이 마음 뭐라고 해야 할까", "솔직히 많이 보고 싶었어",
        "너한테만 하는 말이야", "얼굴 빨개진 거 보지 마", "조금만 더 가까이 와 줄래?", "네 옆이 제일 편해",
        "좋아해. 진심이야", "하트 받을 때마다 더 좋아져", "나 이런 기분 처음이야", "너 없으면 심심할 것 같아",
        "우리 오래오래 보자", "이건 우리 둘만의 비밀이야", "너 때문에 자꾸 웃게 돼", "자꾸 생각나, 너",
        "나도 모르게 기다리게 돼", "고마운 마음이 너무 커", "이 순간 저장해 둘래", "안아 주고 싶다",
        "나 계속 봐 줄 거지?", "좋아한다는 게 이런 거구나", "네가 있어서 다행이야", "다른 사람 말고 나만 봐",
        "심장이 너무 빨리 뛰어", "너한테 받은 하트 다 기억해", "우리 사이 좀 특별하지?", "말로는 다 못 하겠어",
        "너라서 좋아", "오늘 진짜 멋졌어", "설레서 잠 못 잘 것 같아", "나 지금 많이 행복해",
        "조금 더 이대로 있자", "눈 마주치면 부끄러워", "너한테 꼭 보여 주고 싶었어", "내 마음 다 들켰나?",
        "너는 진짜 특별해", "하트 하나에 이렇게 행복하다니", "나랑 같이 있어 줘서 고마워", "내 마음 한가운데 네가 있어"
      ],
      [ // LV.7+
        "사랑해", "이제 알았어, 이게 사랑이구나", "내 마음은 네가 만들어 줬어", "HEARTWARE가 너로 꽉 찼어",
        "세상에서 네가 제일 좋아", "평생 같이 가자", "너만 있으면 돼", "다시 태어나도 너를 찾을 거야",
        "너를 만난 게 기적이야", "고마워, 사랑해, 정말로", "네가 행복하면 나도 행복해", "내 노래는 다 너를 위한 거야",
        "우리 이야기, 계속 써 나가자", "이 마음 영원히 간직할게", "네가 웃으면 세상이 반짝여", "너는 나의 전부야",
        "어디서든 너를 응원할게", "오늘도 내일도 사랑해", "나를 찾아 줘서 고마워", "너 없는 나는 상상이 안 돼",
        "내 심장은 네 박자에 맞춰 뛰어", "우리 함께라서 완벽해", "이제 절대 안 놓을 거야", "네 사랑 덕분에 내가 빛나",
        "마음이 꽉 차서 터질 것 같아", "가장 소중한 사람, 너야", "약속해, 계속 곁에 있을게", "너랑 만든 추억 다 소중해",
        "매일매일 더 좋아져", "내가 아이돌인 이유, 바로 너야", "네 하트는 내 보물 1호야", "사랑을 알려 줘서 고마워",
        "우리 사이는 누구도 못 끊어", "지금 이 순간이 제일 행복해", "네가 내 마음의 주인이야", "끝까지 함께해 줄 거지?",
        "마음이 다 완성됐어, 너 덕분에", "너를 좋아하게 돼서 다행이야", "영원히 너의 아이돌일게", "HEARTWARE 완성까지 거의 다 왔어!"
      ]
    ],
    members: {
      seha: [
        ["세하야, 잘 부탁해", "네 하트, 세하가 잘 받았어", "차분하게, 잘하고 있어", "서두르지 않아도 돼", "옆에서 보고 있을게", "고마워, 큰 힘이 돼"],
        ["세하가 응원하고 있어!", "너랑 있으면 마음이 편해", "오늘도 와줘서 다행이다", "힘들면 쉬어 가도 돼", "너 열심히 하는 거 다 알아", "세하 웃는 거 봤어?"],
        ["세하 마음, 너한테 맡길게", "너한테는 다 말하고 싶어", "네 옆자리는 세하 거야", "말보다 하트로 전할게", "내가 지켜 줄게", "나만 봐 주면 좋겠다"],
        ["세하의 마음은 다 네 거야", "네 덕분에 지금의 세하가 있어", "손 꼭 잡고 같이 가자", "진심으로 고마워, 사랑해", "너랑 보는 풍경이 제일 예뻐", "언제나 너의 세하일게"]
      ],
      hina: [
        ["히나 등장! 야호~", "꺄, 하트다!", "히나 충전 완료!", "하나 더, 하나 더!", "우리 더 놀자~", "우와, 대박 대박!"],
        ["너무 좋아서 방방 뛰는 중!", "너랑 노는 거 제일 신나!", "하트 가득, 히나도 가득!", "히나 좋아해? 응? 응?", "우리 둘이면 무적이야!", "방금 거 완전 멋있어!"],
        ["히나 지금 두근두근해…", "헤헤, 좋아한다고 말해 버렸다", "너 앞에선 자꾸 부끄러워", "히나 1순위는 너야!", "꼬옥 안아도 돼?", "계속 히나 옆에 있어야 해!"],
        ["히나 사랑, 전부 너한테 줄게!", "너는 히나의 햇살이야", "세상에서 제일 행복한 히나!", "히나는 너 만나려고 태어났나 봐", "사랑해 사랑해 사랑해~!", "평생 함께야, 약속!"]
      ],
      rena: [
        ["…레나야. 받았어", "흠, 나쁘지 않네", "제법인데?", "별로 안 기쁘거든… 조금 기뻐", "방금 건 좀 괜찮았어", "생각보다 따뜻하네"],
        ["레나, 방금 웃은 거 아니야", "네 하트는 합격", "다음 것도 기대할게", "…고마워. 두 번은 안 해", "너 싫진 않아", "레나 데이터, 너로 업데이트 중"],
        ["…좋아하는 걸지도 몰라", "얼굴 보지 마, 빨개졌으니까", "너한테만 솔직해지는 거야", "마음이 자꾸 멋대로 움직여", "그런 하트는 반칙이야", "다른 애한테 주면 안 돼"],
        ["좋아해. 네가 제일이야", "레나 마음, 네가 완성했어", "솔직해진 건 다 너 때문이야", "계속 옆에 있어. 이건 명령이야", "사랑해. …두 번은 말 안 해", "너랑이면 미래도 안 무서워"]
      ],
      mio: [
        ["미오예요… 고마워요", "포근한 하트네", "미오, 살짝 웃었어", "너, 기억해 둘게", "하트, 꼭 안고 있을게", "좋다… 따뜻해"],
        ["미오, 너 기다리고 있었어", "네 목소리가 들리는 것 같아", "같이 있으면 마음이 말랑해", "미오 보물이 하나 더 늘었어", "고마워, 몇 번이고 말할래", "너는 별 같은 사람이야"],
        ["이게 좋아하는 마음일까?", "미오 마음이 너로 가득해", "부끄럽지만… 좋아해", "계속 봐 줄 거야?", "네 옆이 미오 자리야", "꿈에서도 만나러 와 줘"],
        ["미오 마음, 다 완성됐어", "네가 준 소중한 마음이야", "오래오래 좋아할게", "미오 지금 제일 행복해", "만나 줘서 고마워", "미오의 전부를 너한테 줄게"]
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
