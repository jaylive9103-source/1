const state = {
  fileUrl: null,
  frames: [],
  planCuts: []
};

const LOCKED_GLOBAL = {
  common: "실사 홈쇼핑 인서트용 푸드 장면. 따뜻한 자연광, 아이보리 벽, 밝은 원목, 정갈한 한국식 스튜디오. 기존 참고영상과 촬영 목적은 유지하되 동일 장소처럼 보이지 않게 새 스튜디오 느낌. 판매 전환 중심, 음식 형태/온기/질감/증기 강조, 텍스트 없음.",
  banned: "자막/로고/워터마크/패키지 텍스트/배너 금지. 기존 촬영장과 동일한 벽/창/가구 금지. 과장 소품 금지. 허용 외 재료 금지. 인공 색감, 과한 광택, 비현실 증기, 어색한 손/얼굴, AI 질감 금지.",
  master: "연륜 있는 한국 여성 명인 1명. 따뜻하고 신뢰감 있는 표정. 미색/연베이지/연회색/먹녹 계열 한복, 과장 없는 숙련된 손동작.",
  tb: "토종닭백숙: 통닭 존재감이 분명, 맑지만 깊은 아이보리 베이지 국물, 은은한 증기, 탄탄한 닭 형태감. 검은 탕기/짙은 전통 그릇. 과한 황색/갈색 국물 금지, 죽처럼 걸쭉한 질감 금지.",
  nt: "누룽지탕: 누룽지 존재감이 분명, 연한 베이지 탕감, 자연스럽게 흐르는 질감, 은은한 증기. 짙은 전통/검은 그릇. 죽처럼 과점도 금지, 과한 토핑 금지.",
  ingredients: "허용 재료만 사용: 닭, 한우사골, 누룽지, 맵쌀, 찹쌀, 황기, 대추, 인삼, 칡뿌리, 도라지뿌리, 더덕뿌리."
};

const sceneTemplates = {
  opening_hero: "Scene goal: opening hero. Replace source product with Jeongseonggotgan Dakbaeksuk(main) and Nurungji-tang(secondary). Preserve composition from Image 4 and body proportion from Image 5 depth map. Camera delta: {CAMERA_DELTA}. Wardrobe style: {WARDROBE}. Must show: {MUST_SHOW}. Must avoid: {MUST_AVOID}. AR: 16:9.",
  host_explain: "Scene goal: host explanation front shot. Use Image 1 character identity and hanbok details, Image 2 set design, Image 3 props. Follow Image 4 framing and Image 5 depth proportion. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Must avoid: {MUST_AVOID}. AR: 16:9.",
  cooking_side: "Scene goal: side cooking demonstration. Maintain hand/body proportion from Image 5 depth map while preserving host identity from Image 1. Replace food to dakbaeksuk + nurungji-tang. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Must avoid: {MUST_AVOID}. AR: 16:9.",
  top_view: "Scene goal: top-view arrangement. Keep spatial blocking from Image 4 and object scale from Image 3. Use dakbaeksuk hero bowl centered and nurungji-tang support. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Must avoid: {MUST_AVOID}. AR: 16:9.",
  texture_macro: "Scene goal: food texture macro. Use scene tone from Image 2, props from Image 3, and ensure product conversion to dakbaeksuk and nurungji-tang. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Must avoid: {MUST_AVOID}. AR: 16:9."
};

const sceneTypeLabels = {
  opening_hero: "오프닝 히어로",
  host_explain: "명인 설명 정면",
  cooking_side: "측면 조리",
  top_view: "탑뷰 구성",
  texture_macro: "식감 매크로"
};

const el = {
  videoFile: document.getElementById("videoFile"),
  maxSeconds: document.getElementById("maxSeconds"),
  sampleStep: document.getElementById("sampleStep"),
  sensitivity: document.getElementById("sensitivity"),
  depthGamma: document.getElementById("depthGamma"),
  depthLevels: document.getElementById("depthLevels"),
  bgDarken: document.getElementById("bgDarken"),
  depthInvert: document.getElementById("depthInvert"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  regenDepthBtn: document.getElementById("regenDepthBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  clearBtn: document.getElementById("clearBtn"),
  status: document.getElementById("status"),
  previewVideo: document.getElementById("previewVideo"),
  workCanvas: document.getElementById("workCanvas"),
  frames: document.getElementById("frames"),
  sceneType: document.getElementById("sceneType"),
  frameId: document.getElementById("frameId"),
  cameraDelta: document.getElementById("cameraDelta"),
  wardrobe: document.getElementById("wardrobe"),
  mustShow: document.getElementById("mustShow"),
  mustAvoid: document.getElementById("mustAvoid"),
  generateBtn: document.getElementById("generateBtn"),
  batchBtn: document.getElementById("batchBtn"),
  copyBtn: document.getElementById("copyBtn"),
  promptOutput: document.getElementById("promptOutput"),
  planInput: document.getElementById("planInput"),
  planProduct: document.getElementById("planProduct"),
  planChapter: document.getElementById("planChapter"),
  parsePlanBtn: document.getElementById("parsePlanBtn"),
  generatePlanBtn: document.getElementById("generatePlanBtn"),
  planStatus: document.getElementById("planStatus")
};

function initSceneTypes() {
  Object.entries(sceneTypeLabels).forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    el.sceneType.appendChild(option);
  });
}

function setStatus(message) { el.status.textContent = message; }

function averageDiff(a, b) { let sum = 0; const length = Math.min(a.length, b.length); for (let i = 0; i < length; i += 4) { const grayA = (a[i] + a[i + 1] + a[i + 2]) / 3; const grayB = (b[i] + b[i + 1] + b[i + 2]) / 3; sum += Math.abs(grayA - grayB);} return sum / (length / 4) / 255; }

function blurArray(data, width, height) {
  const tmp = new Float32Array(data.length); const out = new Float32Array(data.length);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) { let sum = 0; let count = 0; for (let dx = -2; dx <= 2; dx += 1) { const xx = x + dx; if (xx >= 0 && xx < width) { sum += data[y * width + xx]; count += 1; } } tmp[y * width + x] = sum / count; }
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) { let sum = 0; let count = 0; for (let dy = -2; dy <= 2; dy += 1) { const yy = y + dy; if (yy >= 0 && yy < height) { sum += tmp[yy * width + x]; count += 1; } } out[y * width + x] = sum / count; }
  return out;
}

function makeProportionDepthMap(imageData, width, height) {
  const gamma = Number(el.depthGamma.value || 0.8); const levels = Number(el.depthLevels.value || 12); const bgDarken = Number(el.bgDarken.value || 0.45); const invert = el.depthInvert.checked;
  const luma = new Float32Array(width * height);
  for (let i = 0, p = 0; i < imageData.length; i += 4, p += 1) luma[p] = (imageData[i] * 0.299 + imageData[i + 1] * 0.587 + imageData[i + 2] * 0.114) / 255;
  const blurred = blurArray(luma, width, height);
  let min = Infinity; let max = -Infinity; for (let i = 0; i < blurred.length; i += 1) { const v = blurred[i]; if (v < min) min = v; if (v > max) max = v; }
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) { const idx = y * width + x; const norm = (blurred[idx] - min) / (max - min + 1e-6); const cx = (x / width) * 2 - 1; const cy = (y / height) * 2 - 1; const radial = Math.min(1, Math.sqrt(cx * cx + cy * cy)); let v = norm * (1 - bgDarken * radial * 0.9); v = Math.pow(Math.max(0, Math.min(1, v)), gamma); v = Math.round(v * (levels - 1)) / (levels - 1); if (invert) v = 1 - v; const gray = Math.round(v * 255); const p = idx * 4; out.data[p] = gray; out.data[p + 1] = gray; out.data[p + 2] = gray; out.data[p + 3] = 255; }
  return out;
}

function waitSeek(video, time) { return new Promise((resolve, reject) => { const onSeeked = () => { video.removeEventListener("seeked", onSeeked); resolve(); }; const onError = () => reject(new Error("seek 실패")); video.addEventListener("seeked", onSeeked, { once: true }); video.addEventListener("error", onError, { once: true }); video.currentTime = Math.min(time, Math.max(0, video.duration - 0.05)); }); }
function downloadDataUrl(dataUrl, filename) { const a = document.createElement("a"); a.href = dataUrl; a.download = filename; a.click(); }

function buildPrompt(referenceFrameId) {
  const type = el.sceneType.value; const template = sceneTemplates[type]; if (!template) return "";
  const values = {REFERENCE_FRAME: referenceFrameId || "S01_F001", CAMERA_DELTA: el.cameraDelta.value || "+10 degree right", WARDROBE: el.wardrobe.value || "HANBOK_CW01", MUST_SHOW: el.mustShow.value || "dakbaeksuk hero bowl, steam, host hands", MUST_AVOID: el.mustAvoid.value || "bulgogi cues, clutter, distorted hands"};
  let scenePrompt = template; Object.entries(values).forEach(([key, value]) => { scenePrompt = scenePrompt.replaceAll(`{${key}}`, value); });
  return [`[INPUT IMAGE ORDER]`,`Image 1: Character Sheet (host identity, hanbok, face, hand detail).`,`Image 2: Background Sheet (kitchen set, shelf, table, lighting mood).`,`Image 3: Tools Sheet (bowls, ladle, tong, ceramic props).`,`Image 4: Extracted source frame ${values.REFERENCE_FRAME}.`,`Image 5: Proportion depth map from Image 4 (use body ratio/pose only).`,``,`[SHEET PROMPTS YOU CAN PREPARE]`,`Character prompt: Korean artisan host in modern hanbok (${values.WARDROBE}), trustworthy expression, realistic hand thickness, glasses optional.`,`Background prompt: premium Korean home-shopping kitchen, warm-neutral studio light, clean table hierarchy, no clutter.`,`Tools prompt: stone pot, ceramic bowl, brass spoon, ladle, tong, garnish tray, realistic reflections.`,``,`[FINAL NANO BANANA PROMPT]`,`${scenePrompt}`,'',`[NEGATIVE CONSTRAINTS]`,`no pabulgogi semantics, no wok-centric setup, no distorted fingers, no plastic skin, no random text artifacts.`].join("\n");
}

function buildPlanPrompt(cut) {
  const productGlobal = cut.product === "TB" ? LOCKED_GLOBAL.tb : LOCKED_GLOBAL.nt;
  const sceneGoal = `컷ID ${cut.id}: ${cut.description}`;
  return [`[GLOBAL]`, LOCKED_GLOBAL.common, LOCKED_GLOBAL.banned, LOCKED_GLOBAL.master, productGlobal, LOCKED_GLOBAL.ingredients, '', `[INDIVIDUAL CUT]`, sceneGoal, '', `[INPUT IMAGE ORDER]`, `Image 1 Character / Image 2 Background / Image 3 Tools / Image 4 Source Frame / Image 5 Proportion Depth`, '', `[FINAL PROMPT BLOCK]`, `Use the five images in fixed order. Keep sales-first composition, keep allowed ingredients only, convert pabulgogi flow to ${cut.product === 'TB' ? 'dakbaeksuk main + nurungji-tang support' : 'nurungji-tang main + dakbaeksuk set linkage'}. ${sceneGoal}`].join("\n");
}

function parsePlanText(raw) {
  const lines = raw.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
  const cuts = [];
  for (let i = 0; i < lines.length; i += 1) {
    const id = lines[i];
    const m = id.match(/^(TB|NT)-([A-Z]+)-([0-9]{2})$/);
    if (!m) continue;
    const description = lines[i + 1] && !/^(TB|NT)-/.test(lines[i + 1]) ? lines[i + 1] : "장면 설명 미입력";
    cuts.push({ id, product: m[1], chapter: m[2], shot: m[3], description });
  }
  state.planCuts = cuts;
  el.planStatus.textContent = `파싱 완료: ${cuts.length}컷`;
}

function generatePlanPrompts() {
  if (!state.planCuts.length) {
    el.planStatus.textContent = "먼저 기획안을 파싱해 주세요.";
    return;
  }
  const p = el.planProduct.value;
  const c = el.planChapter.value;
  const filtered = state.planCuts.filter((x) => (p === "ALL" || x.product === p) && (c === "ALL" || x.chapter === c));
  el.promptOutput.value = filtered.map((cut) => `### ${cut.id}\n${buildPlanPrompt(cut)}`).join("\n\n");
  el.planStatus.textContent = `생성 완료: ${filtered.length}컷`;
}

function renderFrames() {
  el.frames.innerHTML = "";
  state.frames.forEach((frame) => {
    const card = document.createElement("div"); card.className = "frame-card";
    const imageGrid = document.createElement("div"); imageGrid.className = "frame-image-grid";
    const img = document.createElement("img"); img.src = frame.dataUrl; img.alt = `${frame.id}-original`;
    const depthImg = document.createElement("img"); depthImg.src = frame.depthDataUrl; depthImg.alt = `${frame.id}-depth`;
    imageGrid.appendChild(img); imageGrid.appendChild(depthImg);
    const meta = document.createElement("div"); meta.className = "frame-meta"; meta.innerHTML = `<b>${frame.id}</b><br/>${frame.time.toFixed(2)}s<br/>좌:원본 / 우:비율용 심도`;
    const pickBtn = document.createElement("button"); pickBtn.textContent = "원본→프롬프트"; pickBtn.className = "secondary"; pickBtn.addEventListener("click", () => { el.frameId.value = frame.id; el.promptOutput.value = buildPrompt(frame.id); setStatus(`${frame.id} 프롬프트 변환 완료`); });
    const downOriginal = document.createElement("button"); downOriginal.textContent = "원본 JPG"; downOriginal.className = "secondary"; downOriginal.addEventListener("click", () => downloadDataUrl(frame.dataUrl, `${frame.id}.jpg`));
    const downDepth = document.createElement("button"); downDepth.textContent = "심도 JPG"; downDepth.className = "secondary"; downDepth.addEventListener("click", () => downloadDataUrl(frame.depthDataUrl, `${frame.id}_depth.jpg`));
    const btnWrap = document.createElement("div"); btnWrap.className = "actions"; btnWrap.appendChild(pickBtn); btnWrap.appendChild(downOriginal); btnWrap.appendChild(downDepth);
    card.appendChild(imageGrid); card.appendChild(meta); card.appendChild(btnWrap); el.frames.appendChild(card);
  });
}

function regenerateDepthMaps() {
  if (!state.frames.length) { setStatus("재생성 전에 컷 분할을 먼저 실행해 주세요."); return; }
  const canvas = el.workCanvas; const ctx = canvas.getContext("2d", { willReadFrequently: true });
  state.frames.forEach((frame) => { const img = new Image(); img.src = frame.dataUrl; img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); const current = ctx.getImageData(0, 0, canvas.width, canvas.height); const depthMap = makeProportionDepthMap(current.data, canvas.width, canvas.height); ctx.putImageData(depthMap, 0, 0); frame.depthDataUrl = canvas.toDataURL("image/jpeg", 0.92); renderFrames(); }; });
  setStatus("심도맵 재생성 완료");
}

async function analyzeVideoCuts() {
  if (!el.videoFile.files?.length) { setStatus("먼저 영상을 업로드해 주세요."); return; }
  const file = el.videoFile.files[0]; if (state.fileUrl) URL.revokeObjectURL(state.fileUrl); state.fileUrl = URL.createObjectURL(file); el.previewVideo.src = state.fileUrl;
  await new Promise((resolve) => { el.previewVideo.onloadedmetadata = resolve; });
  const duration = Math.min(Number(el.maxSeconds.value), el.previewVideo.duration); const step = Number(el.sampleStep.value); const sensitivity = Number(el.sensitivity.value);
  const canvas = el.workCanvas; const ctx = canvas.getContext("2d", { willReadFrequently: true });
  state.frames = []; let prevImageData = null; let count = 1; setStatus(`분석 중... (0 / ${duration.toFixed(1)}초)`);
  for (let t = 0; t <= duration; t += step) { await waitSeek(el.previewVideo, t); ctx.drawImage(el.previewVideo, 0, 0, canvas.width, canvas.height); const current = ctx.getImageData(0, 0, canvas.width, canvas.height); let isCut = !prevImageData; if (prevImageData) { const diff = averageDiff(prevImageData, current.data); isCut = diff >= sensitivity; } if (isCut) { const id = `S01_F${String(count).padStart(3, "0")}`; const dataUrl = canvas.toDataURL("image/jpeg", 0.92); const depthMap = makeProportionDepthMap(current.data, canvas.width, canvas.height); ctx.putImageData(depthMap, 0, 0); const depthDataUrl = canvas.toDataURL("image/jpeg", 0.92); ctx.putImageData(current, 0, 0); state.frames.push({ id, time: t, dataUrl, depthDataUrl }); count += 1; } prevImageData = new Uint8ClampedArray(current.data); setStatus(`분석 중... (${t.toFixed(1)} / ${duration.toFixed(1)}초)`); }
  renderFrames(); setStatus(`완료: ${state.frames.length}개 컷 첫 프레임/비율용 심도 생성`);
}

function generatePrompt() { el.promptOutput.value = buildPrompt(el.frameId.value); }
function generateBatchPrompts() { if (!state.frames.length) { setStatus("일괄 생성 전에 컷 분할을 먼저 실행해 주세요."); return; } const blocks = state.frames.map((frame) => `### ${frame.id}\n${buildPrompt(frame.id)}`); el.promptOutput.value = blocks.join("\n\n"); setStatus(`${state.frames.length}개 시퀀스 즉시 프롬프트화 완료`); }
function exportCutCsv() { if (!state.frames.length) { setStatus("CSV 내보내기 전에 컷 분할을 먼저 실행해 주세요."); return; } const header = ["frame_id", "time_sec", "scene_type", "camera_delta", "wardrobe_code", "must_show", "must_avoid", "output_ar"]; const rows = state.frames.map((frame) => [frame.id, frame.time.toFixed(2), el.sceneType.value, (el.cameraDelta.value || "+10 degree right").replaceAll(",", " "), (el.wardrobe.value || "HANBOK_CW01").replaceAll(",", " "), (el.mustShow.value || "dakbaeksuk hero bowl steam").replaceAll(",", " "), (el.mustAvoid.value || "bulgogi cues clutter").replaceAll(",", " "), "16:9"]); const csv = [header, ...rows].map((row) => row.join(",")).join("\n"); const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); downloadDataUrl(url, "cut_map_export.csv"); URL.revokeObjectURL(url); setStatus(`CSV 내보내기 완료 (${rows.length}행)`); }
function clearAll() { state.frames = []; renderFrames(); el.promptOutput.value = ""; el.frameId.value = ""; setStatus("초기화됨"); }
async function copyPrompt() { if (!el.promptOutput.value.trim()) return; await navigator.clipboard.writeText(el.promptOutput.value); setStatus("프롬프트 복사 완료"); }

initSceneTypes();
el.analyzeBtn.addEventListener("click", analyzeVideoCuts);
el.regenDepthBtn.addEventListener("click", regenerateDepthMaps);
el.exportCsvBtn.addEventListener("click", exportCutCsv);
el.clearBtn.addEventListener("click", clearAll);
el.generateBtn.addEventListener("click", generatePrompt);
el.batchBtn.addEventListener("click", generateBatchPrompts);
el.copyBtn.addEventListener("click", copyPrompt);
el.parsePlanBtn.addEventListener("click", () => parsePlanText(el.planInput.value));
el.generatePlanBtn.addEventListener("click", generatePlanPrompts);
