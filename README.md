# KZNA HEART POP

推しにハートを届けよう！ — 수박게임 합성 메커니즘에 "최애에게 하트 보내기"를 더한 KZNA 팬 참여형 모바일 웹 게임.

**MERGE → HEART → LOVE GAUGE → LEVEL UP → MEMBER REACTION**

## 세계관 · 다국어 · 사운드

- **HEARTWARE 누적**: 판마다 전달한 LOVE가 멤버별로 계속 쌓인다 (선택 화면 카드 · 게임 상단 · 결과 화면에 표시, 브라우저에 저장).
- **하트 도착 대사**: 하트가 닿을 때마다 레벨 구간(LV.1–2 / 3–4 / 5–6 / 7+)에 맞는 대사가 말풍선으로 랜덤 표시. 언어별 256개 (`js/lines.js`).
- **언어**: 한국어 / 日本語 / English. `?lang=` → 사용자가 고른 언어 → 접속 IP 국가(KR→ko, JP→ja, 그 외 en, `config.geoApi`) → 기기 시간대 순으로 결정. 화면 문구는 `js/i18n.js`.
- **공식 홈페이지 버튼**: 결과 화면 하단, 현재 언어 경로(`/ko` `/ja` `/en`)로 이동 (`config.homepage`).
- **BGM**: 코드로 연주하는 128 BPM 칩튠 신스팝 루프 (외부 음원 없음, `js/audio.js`).

## 배포 (Cloudflare Pages)

main 에 푸시하면 `.github/workflows/deploy-cloudflare.yml` 이 Cloudflare Pages 로 자동 배포한다 (빌드 없음).
최초 1회 GitHub 저장소 Settings → Secrets and variables → Actions 에 두 값을 등록한다.

| 이름 | 어디서 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" 템플릿 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Workers & Pages 화면 오른쪽 Account ID |

등록 후 Actions 탭에서 "Deploy to Cloudflare Pages" → Run workflow 로 바로 배포할 수 있다. 주소는 `https://kzna-heart-pop.pages.dev`.

## 실행

빌드 과정이 없는 순수 HTML/JS 입니다. 폴더를 정적 서버로 열면 바로 플레이할 수 있습니다.

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

GitHub Pages 등 정적 호스팅에 그대로 올리면 됩니다. (`index.html` 을 파일로 직접 열어도 동작합니다)

## 게임 진행

1. **멤버 선택** — SEHA / HINA / RENA / MIO 중 최애 선택 (`推しを選んでね！`)
2. **아이템 합성** — 같은 티어끼리 부딪히면 다음 티어 아이템이 생겨 게임판에 남음
3. **하트 생성** — 합성 지점에서 빛나는 젤리 하트가 별도로 튀어나옴
4. **하트 전달** — 하트가 베지어 곡선을 그리며 상단 멤버에게 날아감
5. **게이지 충전** — 멤버에게 닿는 순간 LOVE GAUGE 증가 (반짝임·펄스)
6. **레벨업** — 게이지가 가득 차면 LOVE LEVEL 상승, 초과분은 다음 레벨로 이월
7. **결과** — `SCORE 12,450 / SEHA LOVE LV.7` 형식으로 표시, X 공유

SCORE(수박게임 실력)와 LOVE LEVEL(최애에게 전달한 하트의 누적 성과)은 서로 독립된 값입니다.

## 화면 구성 (모바일 세로)

| 영역 | 내용 |
| --- | --- |
| TOP | 선택한 멤버 상반신 + 리액션, 말풍선 |
| TOP HUD | LOVE LEVEL + ハートゲージ (멤버 영역과 살짝 겹침) |
| MIDDLE | SCORE / BEST / NEXT |
| MAIN | 물리 합성 게임판 (가장 큰 영역) |
| BOTTOM | 사운드, 조작 안내, 리스타트 |

조작: 게임판을 드래그해 위치를 정하고 손을 떼면 드롭. PC는 마우스 또는 ← → / Space.

## 레벨별 멤버 반응

| LOVE LEVEL | 리액션 상태 | 연출 |
| --- | --- | --- |
| LV.1 | `idle` | 기본 표정, 눈 깜빡임 |
| LV.2 | `happy` | 밝은 미소 (이후 평상시 표정도 미소) |
| LV.3 | `cheer` | 손인사 + 응원 대사 |
| LV.4 | `heart` | 손하트 |
| LV.5 | `wink` | 윙크 + 반짝임 |
| LV.6 | `special` | 두 손 하트 + 특별 대사 |
| LV.7+ | `celebrate` | 배경 오라 연출 강화, 결과 화면 SPECIAL LOVE 배지 |

- 하트가 도착할 때마다 짧은 `happy` 반응과 스케일 펄스가 재생됩니다.
- 리액션에는 우선순위가 있어, 레벨업 리액션 중에는 일반 반응이 끼어들지 않습니다.
- 연속 레벨업은 겹치지 않고 하나씩 차례로 재생됩니다.

## 파일 구조

```
index.html
css/style.css
js/config.js        밸런스 설정 (LOVE 포인트, 레벨 임계값, 콤보, 타이밍)
js/members.js       멤버 데이터, 대사, 일러스트 경로
js/member-view.js   상단 멤버 표시 + 리액션 상태 머신 (임시 캐릭터 SVG 포함)
js/board.js         Matter.js 물리 게임판, 합성 판정, 아이템 그래픽
js/hearts.js        하트 비행 애니메이션 + 보상 장부
js/audio.js         WebAudio 효과음 (외부 파일 없음)
js/main.js          화면 흐름, HUD, 게임 루프
vendor/matter.min.js  Matter.js 0.20.0 (MIT)
```

## 설정 바꾸기 (`js/config.js`)

- `love.perMergeTier` — 합성한 티어별 하트 1개의 LOVE (기본: T0 10, T1 20, T2 35, T3 55, T4 85 …)
- `love.levelThresholds` — 레벨별 필요 게이지 (기본 300, 500, 750, 1000 …, 이후 `thresholdStepAfter` 씩 증가)
- `love.combo` — 연쇄 합성 보너스 (0.9초 안에 이어진 합성마다 +15%, 최대 +100%)
- `heart` — 하트 비행 시간, 크기, 동시 생성 시 출발 간격
- `reactions` — 리액션 지속 시간, 레벨별 리액션, 대사 출현 확률

## 멤버 일러스트 교체

일러스트가 없어도 임시 캐릭터(SVG)로 모든 기능이 동작합니다. PNG/WebP가 준비되면:

1. `assets/members/<id>/` 에 표정별 이미지를 넣습니다. (예: `assets/members/seha/idle.webp`)
2. `js/members.js` 의 해당 멤버 `images` 에 경로를 적습니다.

```js
images: {
  idle: 'assets/members/seha/idle.webp',
  happy: 'assets/members/seha/happy.webp',
  cheer: 'assets/members/seha/cheer.webp',
  heart: 'assets/members/seha/heart.webp',
  wink: 'assets/members/seha/wink.webp',
  special: 'assets/members/seha/special.webp',
  celebrate: 'assets/members/seha/celebrate.webp'
}
```

- 상반신 기준 정사각형(권장 600×600 이상), 투명 배경, 인물 하단 정렬.
- 비어 있는 상태는 `idle` 이미지로 대체됩니다. `idle` 이 없으면 임시 캐릭터가 나옵니다.
- 멤버 컬러(`color`)는 UI 포인트 색에 쓰이니 공식 컬러가 정해지면 함께 바꿔 주세요.

## 대사

`js/members.js` 의 멤버별 `lines` 에 상태별 대사 배열을 넣습니다. 비어 있는 상태는 `DEFAULT_LINES` 를 사용합니다. 현재 대사는 임시값이므로 캐릭터 성격이 확정되면 교체하세요.

## 보상 처리 보장

- 하트는 합성 좌표(게임판 논리 좌표)를 기억하고 매 프레임 화면 좌표로 다시 계산 → 화면 회전·크기 변경에도 경로가 맞습니다.
- 하트마다 지급 여부 플래그가 있어 중복 지급이 없습니다.
- 게임오버 후에도 비행 중인 하트는 끝까지 날아가 지급되고, 최대 3.2초를 넘기면 남은 하트를 즉시 지급한 뒤 결과를 보여줍니다.

검증한 시나리오: 연쇄 합성, 12쌍 동시 합성 + 비행 중 화면 크기 변경, 최고 티어 합성/소멸, 게임오버 직전 하트 10개 비행, 실제 터치 플레이로 자연 게임오버. 모든 경우 `생성된 LOVE = 지급된 LOVE` 확인.

디버그용으로 콘솔에서 `HP.debug.state()` 로 점수·LOVE·하트 장부를 볼 수 있습니다.

## 공유

결과 화면의 `結果をシェア` 는 X 작성 화면을 엽니다. 해시태그와 공유 URL은 `config.js` 의 `share` 에서 바꿀 수 있습니다 (URL을 비우면 현재 페이지 주소).
