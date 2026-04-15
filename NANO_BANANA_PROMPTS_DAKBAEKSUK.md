# 정성곳간 닭백숙/누룽지탕 인서트용 즉시 사용 프롬프트 팩 (Nano Banana)

> 목적: 파불고기 레퍼런스(01~06)의 컷 구조를 유지하면서 닭백숙(메인), 누룽지탕(보조)로 치환.
> 사용법: 각 프롬프트에서 `{REFERENCE_FRAME}`만 교체해 바로 사용.

## A. 고정 글로벌 스타일 블록 (모든 장면 앞에 공통 삽입)
```text
Use the provided first-frame image as composition and depth reference only.
Preserve grayscale depth hierarchy: foreground / midground / background.
Replace all original pabulgogi semantics with Jeongseonggotgan Dakbaeksuk (main) and Nurungji-tang (secondary).
Host identity must stay fully consistent across all scenes.
Premium Korean home-shopping visual language, photoreal food advertising quality.
No text overlays, no logos, no watermark artifacts.
AR: 16:9
```

## B. 인물 마스터 시트 프롬프트 (먼저 1회 생성)

### B1) 전신/다각도 시트
```text
Create a full-body multi-angle character sheet of a trusted Korean master artisan host for TV commerce.
Include: full body front, front face close-up, left profile, right profile, 45-degree angle, back view, top view, low-angle view.
Wardrobe: modern hanbok, deep navy + ivory, premium textile weave, clean collar line.
Hands: realistic thickness, visible knuckle structure, practical cook's hands.
Optional glasses: thin metal rim with anti-glare behavior.
Neutral gray studio background, soft key light, gentle fill.
Identity consistency is mandatory across all views.
AR: 16:9
```

### B2) 복장 디테일 시트
```text
Create a hanbok wardrobe detail sheet for a premium food-selling host.
Show front/back and fabric macro close-ups.
Design: modernized traditional, minimal embroidery, not festive costume.
Colorway options: (1) deep navy + ivory, (2) forest green + warm beige, (3) burgundy + charcoal.
Include apron layering option suitable for cooking demo.
AR: 16:9
```

### B3) 손 제스처 시트
```text
Create a hand gesture sheet for home-shopping cooking sales.
Include gestures: bowl presentation, ladle pour, tong lift, ingredient pointing, steam checking, package opening.
Hands should feel strong, warm, experienced, and anatomically correct.
No finger distortion.
AR: 16:9
```

## C. 세트/도구/재료 시트 프롬프트 (먼저 1회 생성)

### C1) 공간 시트
```text
Create a premium Korean home-shopping kitchen set sheet.
Include hero table, prep table, background shelf, practical soft lighting fixtures.
Visual tone: warm-neutral, clean, premium, uncluttered.
AR: 16:9
```

### C2) 도구 시트
```text
Create a prop sheet for dakbaeksuk and nurungji-tang presentation.
Include stone pot, ceramic bowls, brass spoon, ladle, tong, wooden spoon, garnish tray.
Materials must have realistic reflections and scale consistency.
AR: 16:9
```

### C3) 재료 시트
```text
Create an ingredient sheet for Korean dakbaeksuk and nurungji-tang.
Include whole chicken cuts, clear broth, garlic, jujube, ginseng-like root cues, green onion, nurungji crust texture.
Show both raw and plated-ready states.
Food realism must be high-end commercial grade.
AR: 16:9
```

---

## D. 영상별 장면 프롬프트 (즉시 사용)

아래 24개 프롬프트는 각 영상의 대표 인서트 컷을 치환하기 위한 기본 세트다.
`{REFERENCE_FRAME}`에 첫 프레임 캡쳐를 넣어 사용한다.

## D-01. 01_브랜드 영상 치환

### 01-1 오프닝 히어로
```text
Using {REFERENCE_FRAME} as depth/composition guide, create an opening hero insert shot.
A respected Korean artisan host in deep navy + ivory modern hanbok presents Jeongseonggotgan Dakbaeksuk at center table.
Nurungji-tang is placed as secondary support on rear-right.
Camera: medium-wide, 3/4 front, +10 degree right deviation from reference.
Lighting: warm premium studio, strong food highlights, soft background falloff.
Steam visibility must be natural and appetizing.
No clutter, no bulgogi visuals.
AR: 16:9
```

### 01-2 브랜드 신뢰 클로즈업
```text
Using {REFERENCE_FRAME}, generate a trust-focused close-up of the host face and upper body.
Host looks at camera with calm confidence while holding dakbaeksuk bowl edge.
Keep face identity and hanbok texture consistent with master sheet.
Background remains premium kitchen blur.
Secondary nurungji-tang cue appears softly in background.
AR: 16:9
```

### 01-3 제품 단독 히어로
```text
Using {REFERENCE_FRAME}, create a product-only hero shot.
Main hero: dakbaeksuk with clear broth translucency, tender chicken fibers, garlic and jujube accents.
Secondary: small nurungji-tang bowl in soft-focus support.
Camera: close-up macro feel, shallow depth of field.
Commercial food lighting with controlled gloss.
AR: 16:9
```

### 01-4 엔딩 무드
```text
Using {REFERENCE_FRAME}, create a warm premium ending mood shot.
Rear-diagonal host silhouette finishing plating near hero dakbaeksuk bowl.
Foreground bowl rim, midground hands, background soft studio bokeh.
Tone: artisanal mastery, nourishing, trustworthy.
AR: 16:9
```

## D-02. 02_인포모션 영상 치환

### 02-1 핵심 혜택 설명
```text
Using {REFERENCE_FRAME}, create a front-facing info shot.
Host explains product value while naturally showing broth clarity with ladle.
Dakbaeksuk is primary in frame center; nurungji-tang remains secondary.
Camera: medium shot, frontal, +5 degree right shift.
AR: 16:9
```

### 02-2 원재료 신뢰 컷
```text
Using {REFERENCE_FRAME}, create an ingredient credibility insert.
Arrange garlic, jujube, ginseng-like roots around partially visible dakbaeksuk bowl.
Keep premium cleanliness and Korean traditional-modern styling.
No raw clutter or messy prep look.
AR: 16:9
```

### 02-3 국물 질감 강조
```text
Using {REFERENCE_FRAME}, create a broth texture close-up.
Ladle pour moment with visible steam strands and clear golden broth.
Chicken texture remains detailed and juicy.
High realism, no oversaturation.
AR: 16:9
```

### 02-4 보조상품 연결
```text
Using {REFERENCE_FRAME}, create a support-product transition shot.
Nurungji-tang receives hot broth pour, showing crisp-to-soft texture transition.
Dakbaeksuk bowl stays readable in midground hero context.
AR: 16:9
```

## D-03. 03_원재료(공영) 영상 치환

### 03-1 원재료 탑뷰
```text
Using {REFERENCE_FRAME}, create a top-view ingredient layout.
Central dakbaeksuk components with radial arrangement of garlic, jujube, green onion, and root cues.
Warm neutral table styling, clean hierarchy.
AR: 16:9
```

### 03-2 명인 선별 컷
```text
Using {REFERENCE_FRAME}, create a side-angle host selection shot.
Host hand picks ingredients with confident gesture.
Hand anatomy and sleeve detail must be clean and realistic.
AR: 16:9
```

### 03-3 원재료→완성 연결
```text
Using {REFERENCE_FRAME}, create split-depth style continuity shot.
Foreground raw ingredients, midground simmering pot, background plated dakbaeksuk.
Depth layers must follow reference geometry.
AR: 16:9
```

### 03-4 품질 인증 무드
```text
Using {REFERENCE_FRAME}, create a quality-assurance mood shot.
Host nodding slightly with finished dakbaeksuk and side nurungji-tang visible.
Trustworthy, premium, clean broadcast tone.
AR: 16:9
```

## D-04. 04_조리과정(공영) 영상 치환

### 04-1 끓임 시작
```text
Using {REFERENCE_FRAME}, create an early cooking process shot.
Stone pot with dakbaeksuk broth beginning to simmer.
Host hand enters frame with ladle, practical realistic motion cue.
AR: 16:9
```

### 04-2 조리 중간
```text
Using {REFERENCE_FRAME}, create a mid-process shot.
Chicken lifted slightly with tong and ladle, broth droplets visible.
Steam must be natural and layered by depth.
AR: 16:9
```

### 04-3 조리 완성 직전
```text
Using {REFERENCE_FRAME}, create near-finish process insert.
Broth clarity and chicken tenderness are strongly visible.
Subtle garnish only; avoid clutter.
AR: 16:9
```

### 04-4 완성 플레이팅
```text
Using {REFERENCE_FRAME}, create final plating shot.
Dakbaeksuk hero bowl centered, nurungji-tang supporting bowl offset.
Host hands frame bowls for sales readability.
AR: 16:9
```

## D-05. 05_응용요리 영상 치환

### 05-1 응용 1 컷
```text
Using {REFERENCE_FRAME}, create a derived serving variation shot.
Use dakbaeksuk meat and broth in a neat serving bowl while keeping brand style consistency.
Nurungji-tang remains visible as companion.
AR: 16:9
```

### 05-2 응용 2 컷
```text
Using {REFERENCE_FRAME}, create a practical home-serving variation.
Host presents easy portioning with spoon and bowl.
Maintain premium broadcast cleanliness and realistic utensil reflections.
AR: 16:9
```

### 05-3 가족식 제안 컷
```text
Using {REFERENCE_FRAME}, create a family-style serving cue.
Multiple small bowls around hero dakbaeksuk, balanced composition, no clutter.
Warm trustworthy mood for purchase motivation.
AR: 16:9
```

### 05-4 재가열/편의성 컷
```text
Using {REFERENCE_FRAME}, create a convenience-focused insert.
Simple reheating-ready presentation with stone pot and ladle.
Communicate ease and premium quality simultaneously.
AR: 16:9
```

## D-06. 06_식감모음 영상 치환

### 06-1 닭 육질 매크로
```text
Using {REFERENCE_FRAME}, create macro texture shot of dakbaeksuk chicken.
Show moist fibers, tender pull, realistic gloss under controlled highlights.
No artificial plastic look.
AR: 16:9
```

### 06-2 국물 식감 컷
```text
Using {REFERENCE_FRAME}, create close-up broth movement shot.
Gentle ladle swirl with clear, rich soup body and fine steam strands.
AR: 16:9
```

### 06-3 누룽지 식감 컷
```text
Using {REFERENCE_FRAME}, create nurungji-tang texture transition shot.
Capture crisp edge softening in hot broth with appetizing detail.
Dakbaeksuk remains contextual support in background.
AR: 16:9
```

### 06-4 종합 식감 피날레
```text
Using {REFERENCE_FRAME}, create final texture montage-style still.
Front: dakbaeksuk meat detail, mid: broth steam, rear: nurungji-tang texture cue.
High-end commercial realism, balanced contrast, purchase-driving appetite appeal.
AR: 16:9
```

---

## E. 네거티브 프롬프트 공통 묶음
```text
No pabulgogi semantics, no spicy red stir-fry cues, no wok-centric setup,
no distorted fingers, no extra limbs, no plastic skin, no waxy food texture,
no cluttered background, no random text artifacts, no watermark, no logo.
```

## F. 장면별 빠른 조립 포맷
```text
[GLOBAL_STYLE]
+ [SCENE_PROMPT]
+ [NEGATIVE_PROMPT]
```

