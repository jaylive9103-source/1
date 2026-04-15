# 나노바나나용 홈쇼핑 인서트 이미지 프롬프트 생성기 (정성곳간 닭백숙/누룽지탕)

## 0) 프로젝트 목표
- 기존 **파불고기 인서트 영상의 컷 전개/톤앤매너**를 유지하면서, 제품을 **정성곳간 닭백숙(메인)** + **누룽지탕(보조)**으로 치환한다.
- **명인(판매자) 등장 중심**으로 제품 신뢰감과 식욕 자극을 동시에 강화한다.
- 장면별로 교체 가능한 방식으로 프롬프트를 작성해, 캡쳐 기반 반복 생성이 가능하도록 한다.

---

## 1) 사용 원칙 (Nano Banana 2 형식 반영)
Google Nano Banana 2 공개 예시에서 일관적으로 보이는 구조를 그대로 따른다.

### 1-1. 프롬프트 기본 골격
1. **핵심 장면 한 줄 요약**
2. **피사체 디테일(인물/제품/소품) 명시**
3. **카메라 구도/렌즈/시점**
4. **조명/색감/질감/분위기**
5. **텍스트/브랜딩/금지 요소/비율(AR) 같은 제약조건**

### 1-2. 권장 문장 패턴
- `Create an image of ...`
- `Keep identity consistent for ...`
- `Shot type: ... / Camera angle: ... / Lens feel: ...`
- `Lighting: ... / Mood: ... / Color palette: ...`
- `Must include ... / Must avoid ... / AR: 16:9`

### 1-3. 인서트 실무용 출력 규칙
- 모든 장면에 `AR: 16:9` 기본 적용(필요 시 9:16 추가 버전 병행)
- 식품 표현은 `hyper-real food texture`, `steam visibility`, `gloss control` 키워드 고정
- 명인 얼굴은 장면 간 `identity consistency`를 강하게 고정

---

## 2) 제작 파이프라인 (레퍼런스 영상 → 프롬프트)

### STEP A. 컷 전환 첫 프레임 수집
- 레퍼런스 영상(01~06 mp4)에서 컷 전환 지점의 첫 프레임을 추출
- 추출물 파일명 규칙: `S01_F001.jpg`, `S01_F002.jpg` ...

예시(ffmpeg):
```bash
# 장면 전환 감지 기반 추출 예시(임계값은 영상마다 조정)
ffmpeg -i input.mp4 -vf "select='gt(scene,0.35)',showinfo" -vsync vfr shots/%04d.jpg
```

### STEP B. 톤 분석용 중간 산출물 생성
각 프레임마다 아래 3종을 만든다.
1. **원본 캡쳐**
2. **그레이 심도맵 버전**(회색톤으로 공간/거리만 표현)
3. **엣지/구도 가이드 버전**(주요 라인/오브젝트 위치)

### STEP C. 대분류 시트 고정
- 인물/복장/손/안경/공간/도구/재료 시트를 먼저 확정
- 이후 장면 프롬프트는 반드시 시트 ID를 참조

### STEP D. 장면별 치환 프롬프트 생성
- 파불고기 관련 오브젝트는 아래 우선순위로 치환
  1) 닭백숙 완성 볼(메인 히어로)
  2) 누룽지탕 서브 컷
  3) 한약재/부재료/조리도구

---

## 3) 대분류 시트 템플릿 (필수)

아래 시트를 먼저 채우면 장면 치환이 훨씬 안정적이다.

## 3-1. 인물 시트 (Master Human Sheet)

### 공통 베이스 프롬프트
```text
Create a full-body and multi-angle character sheet for a Korean master food artisan host for home-shopping.
Identity must remain perfectly consistent across all views.
Include: full body, front face, left profile, right profile, 45-degree angle, back view, top view, low-angle view.
Age impression: trustworthy middle-aged artisan.
Expression: warm confidence, persuasive but humble.
Hand detail priority: visible knuckle structure, realistic hand thickness, clean fingernails, cooking-practical hands.
Accessory detail: traditional-style glasses (if used), subtle texture, no flashy reflection.
Wardrobe: modernized hanbok for premium food presentation.
Background: neutral studio gray for sheet readability.
Lighting: soft key + gentle fill, minimal harsh shadow.
AR: 16:9
```

### 한복 변경 변수
- 색상 팔레트: `deep navy + ivory`, `forest green + warm beige`, `burgundy + charcoal`
- 디자인 키워드: `minimal embroidery`, `premium textile weave`, `clean collar line`, `broadcast-safe pattern`

## 3-2. 복장 디테일 시트
```text
Create a wardrobe detail sheet for a premium modern hanbok used in TV home-shopping food sales.
Focus on fabric weave, sleeve edge, collar structure, waist silhouette, apron layering option.
Show front/back/close-up fabric macro.
Colorway: {COLORWAY_A}, {COLORWAY_B}.
Avoid overly festive costume look; keep luxury culinary professional tone.
AR: 16:9
```

## 3-3. 손/제스처 디테일 시트
```text
Create a hand gesture study sheet for a food-selling host.
Include gestures: ingredient pointing, bowl presentation, ladle holding, package opening, steam sensing, chopstick pickup.
Hands should look strong, warm, and experienced in cooking work.
Skin texture realistic, no plastic skin.
Neutral gray backdrop, studio soft light.
AR: 16:9
```

## 3-4. 안경/액세서리 디테일 시트
```text
Create an accessory sheet for a Korean artisan host.
Include 3 glasses options: thin metal rim, semi-rimless, classic dark frame.
Prioritize anti-glare lens behavior suitable for studio lights.
Also include optional lapel mic placement guide for broadcast realism.
AR: 16:9
```

## 3-5. 공간/세트 시트
```text
Create an environment sheet for premium Korean home-shopping kitchen studio.
Include table variants, prep station, hero product pedestal, background shelf, soft practical lights.
Props: wooden board, earthenware bowl, brass spoon, ladle, stone pot, garnish trays.
Look: clean, premium, warm-neutral color temperature.
No visual clutter.
AR: 16:9
```

## 3-6. 조리도구 시트
```text
Create a prop sheet for Korean chicken soup and scorched-rice soup cooking presentation.
Include: stone pot, brass bowl, ceramic serving bowl, ladle, tong, wooden spoon, garnish tweezers, steam cloth.
Show scale consistency and realistic material reflections.
AR: 16:9
```

## 3-7. 재료 시트 (닭백숙/누룽지탕 전용)
```text
Create an ingredient sheet for Korean whole chicken baeksuk and nurungji-tang.
Main ingredients: whole chicken cuts, broth, garlic, jujube, ginseng-like roots, spring onion, glutinous rice texture cues.
Secondary ingredients for nurungji-tang: scorched rice crust, clear broth pour shot, bubbling surface.
Food texture must be hyper-real, appetizing, and broadcast-commercial grade.
AR: 16:9
```

---

## 4) 심도(회색톤) 기반 장면 치환 프롬프트

아래는 사용자가 컷의 첫 프레임 캡쳐본을 넣었을 때 쓰는 공통 구조다.

### 4-1. 심도 고정 + 인물 시트 적용
```text
Use the provided first-frame reference image as composition and depth map guide only.
Interpret geometry in grayscale depth priority: foreground, midground, background separation must match.
Replace original subject with the master host from [HUMAN_SHEET_ID].
Keep host identity, face structure, and wardrobe silhouette consistent with sheet.
Slightly adjust camera angle (+/- 10 to 15 degrees) for fresh variation while preserving scene readability.
Product focus: Jeongseonggotgan Dakbaeksuk as primary hero.
Secondary cue: Nurungji-tang supporting element.
Lighting should preserve original tonal contrast but upgrade to premium home-shopping look.
No text overlay.
AR: 16:9
```

### 4-2. 심도 고정 + 배경/도구 시트 적용
```text
Use the provided first-frame reference image for spatial depth and blocking.
Apply environment style from [ENV_SHEET_ID] and prop style from [PROP_SHEET_ID].
Preserve object distance layers according to grayscale depth logic.
Swap legacy bulgogi-related tools/food with dakbaeksuk and nurungji-tang serving setup.
Tabletop should be clean and premium, with controlled highlights and natural steam visibility.
Keep composition balanced for product legibility in TV insert format.
AR: 16:9
```

### 4-3. 심도 고정 + 음식 클로즈업 강화
```text
Based on provided first-frame depth structure, generate a close-up food hero shot.
Main dish: dakbaeksuk in rich clear broth, visible chicken texture, garlic and jujube accents.
Support dish: nurungji-tang in side bowl with crisp-to-soft rice texture transition.
Macro food realism, steam strands, moist surface highlights, appetizing contrast.
Camera: close-up or macro, shallow depth of field, cinematic commercial food lighting.
No extra garnish clutter.
AR: 16:9
```

---

## 5) 장면 타입별 즉시 사용 프롬프트 세트

## 5-1. 오프닝 히어로 컷
```text
Create an opening hero shot for Korean home-shopping insert.
A respected artisan host in modern hanbok presents Jeongseonggotgan Dakbaeksuk at center table.
Nurungji-tang appears as secondary supporting dish on the right-rear side.
Host posture: confident sales introduction, slight smile, both hands framing the hero bowl.
Shot type: medium-wide, slight 3/4 angle.
Lighting: warm premium studio, food-first highlights, gentle background falloff.
Mood: trustworthy, premium, nourishing, traditional but modern.
AR: 16:9
```

## 5-2. 명인 설명 컷(정면)
```text
Create a front-facing host explanation shot for TV commerce insert.
Host looks directly at camera while introducing product benefits.
Hands hold bowl and ladle naturally, emphasizing broth clarity and chicken volume.
Wardrobe and facial identity must match the master sheet exactly.
Background kitchen set is softly blurred but premium and clean.
AR: 16:9
```

## 5-3. 측면 조리 시연 컷
```text
Create a side-angle cooking demonstration shot.
Host at 30-45 degree side view, lifting chicken from broth with ladle and tong.
Steam should rise naturally and remain visible under studio lighting.
Include practical cookware and realistic hand tension.
Food texture must be hyper-real and commercial-ready.
AR: 16:9
```

## 5-4. 탑뷰 구성 컷
```text
Create a top-view food arrangement shot.
Hero dakbaeksuk bowl centered, nurungji-tang bowl offset, ingredient side dishes arranged radially.
Table styling: Korean premium rustic-modern, uncluttered, clear hierarchy.
Top-down camera, soft even light, detailed texture clarity.
AR: 16:9
```

## 5-5. 후면/대각 무드 컷
```text
Create a rear-diagonal mood shot of the host preparing final plating.
Back/diagonal view should still preserve host wardrobe identity silhouette.
Foreground includes product hero bowl edge, midground host hands, background warm studio bokeh.
Atmosphere: artisanal mastery, calm confidence, handcrafted authenticity.
AR: 16:9
```

## 5-6. 제품 단독 클로즈업 컷
```text
Create a product-only close-up commercial shot.
Jeongseonggotgan Dakbaeksuk is the clear hero, with rich broth translucency and tender chicken details.
Nurungji-tang appears as a subtle companion in soft focus.
No human in frame.
High-end food advertising style, clean set, steam and gloss controlled.
AR: 16:9
```

---

## 6) 치환 규칙 (파불고기 → 닭백숙/누룽지탕)
- `stir-fried beef visual cue` → `boiled chicken in clear nourishing broth`
- `red/oily pan tone` → `clean golden-clear soup tone`
- `wok/pan 중심 조리도구` → `stone pot, ceramic bowl, ladle 중심`
- `강한 볶음 질감` → `촉촉한 육질 + 국물 증기 질감`

---

## 7) 프롬프트 생성 입력 폼 (복붙용)
아래 블록만 채우면 장면별 프롬프트를 빠르게 생성할 수 있다.

```text
[PROJECT]
Brand/Product: Jeongseonggotgan Dakbaeksuk (Main), Nurungji-tang (Secondary)
Goal: Home-shopping insert replacement from pabulgogi references

[REFERENCE FRAME]
Frame ID: {S##_F###}
Attached image: {yes/no}
Depth map attached: {yes/no}
Desired camera deviation: {e.g., +12 deg right, slightly lower eye level}

[HUMAN SHEET]
Host ID: {HUMAN_MASTER_A}
Gender/Age impression: { }
Wardrobe code: {HANBOK_CW02}
Glasses code: {GLS01}
Hand style code: {HAND02}

[ENV/PROP SHEET]
Environment ID: {ENV_A}
Prop ID: {PROP_B}
Ingredient ID: {ING_DAK_NUR_01}

[SHOT INTENT]
Scene purpose: {intro/demo/closeup/proof/serving}
Priority: {product/host/balanced}
Must show: { }
Must avoid: { }

[OUTPUT SPECS]
AR: 16:9
Style strength: photoreal high
Text overlay: none
```

---

## 8) 최종 생성용 메타 프롬프트 (자동 생성기 지시문)
아래 메타 프롬프트를 나노바나나 앞단 LLM에 넣으면, 입력 폼을 받아 최종 장면 프롬프트를 자동 출력하도록 구성할 수 있다.

```text
You are a prompt director for Nano Banana 2 home-shopping insert generation.
Your task is to generate a production-ready image prompt from the provided form.
Rules:
1) Preserve identity consistency for host and product across scenes.
2) Use reference first frame only for composition/depth guidance.
3) Replace any pabulgogi visual semantics with dakbaeksuk (main) and nurungji-tang (secondary).
4) Include camera angle, shot size, lighting, material texture, and food steam realism.
5) Keep output concise but specific, in one final English prompt block.
6) End every prompt with AR specification.
Output format:
- Final Prompt:
"..."
- Negative Constraints:
"..."
```

---

## 9) 바로 사용 가능한 예시 출력 1개

### 입력 가정
- Frame: S02_F014 (명인 정면 설명 컷)
- 카메라 각도: 기존보다 오른쪽으로 10도
- 한복: deep navy + ivory
- 제품 우선순위: 닭백숙 80 / 누룽지탕 20

### 생성 프롬프트 예시
```text
Create a premium TV home-shopping insert shot using the provided first-frame image as composition and grayscale depth guidance only. A trusted Korean artisan host in a modern deep navy and ivory hanbok faces camera frontally, with a subtle 10-degree right-angle variation from the reference. Keep host facial identity and hand shape consistent with the master sheet. The host presents Jeongseonggotgan Dakbaeksuk as the clear hero dish, showing rich clear broth, tender chicken texture, visible steam, garlic and jujube accents, while Nurungji-tang appears as a supporting side element in softer emphasis. Use a clean premium kitchen studio environment with realistic ceramic and brass cookware, controlled highlights, warm-neutral commercial lighting, and shallow background separation for product readability. No text overlay, no clutter, no bulgogi-related visuals. AR: 16:9
```

```text
Negative constraints: no spicy red stir-fry cues, no wok-centric setup, no plastic skin, no distorted hands, no excessive garnish clutter, no logo text artifacts.
```
