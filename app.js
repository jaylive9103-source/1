const state = {
  fileUrl: null,
  frames: [],
};

const sceneTemplates = {
  opening_hero: "Using {REFERENCE_FRAME} as depth/composition guide, create an opening hero insert shot. A respected Korean artisan host in modern hanbok ({WARDROBE}) presents Jeongseonggotgan Dakbaeksuk at center table. Nurungji-tang is secondary support. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Avoid: {MUST_AVOID}. AR: 16:9",
  host_explain: "Using {REFERENCE_FRAME}, create a front-facing host explanation shot. Keep host identity consistent and show dakbaeksuk broth clarity with ladle. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Avoid: {MUST_AVOID}. AR: 16:9",
  cooking_side: "Using {REFERENCE_FRAME}, create a side-angle cooking process shot with visible steam and realistic hand tension. Dakbaeksuk is main, nurungji-tang is support. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Avoid: {MUST_AVOID}. AR: 16:9",
  top_view: "Using {REFERENCE_FRAME}, create a top-view composition. Hero dakbaeksuk centered, nurungji-tang offset with clean premium tabletop styling. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Avoid: {MUST_AVOID}. AR: 16:9",
  texture_macro: "Using {REFERENCE_FRAME}, create macro food texture shot. Emphasize moist chicken fibers, clear broth motion, and nurungji crisp-to-soft transition. Camera delta: {CAMERA_DELTA}. Must show: {MUST_SHOW}. Avoid: {MUST_AVOID}. AR: 16:9"
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
  analyzeBtn: document.getElementById("analyzeBtn"),
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
};

function initSceneTypes() {
  Object.entries(sceneTypeLabels).forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    el.sceneType.appendChild(option);
  });
}

function setStatus(message) {
  el.status.textContent = message;
}

function averageDiff(a, b) {
  let sum = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 4) {
    const grayA = (a[i] + a[i + 1] + a[i + 2]) / 3;
    const grayB = (b[i] + b[i + 1] + b[i + 2]) / 3;
    sum += Math.abs(grayA - grayB);
  }
  return sum / (length / 4) / 255;
}

function waitSeek(video, time) {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    const onError = () => reject(new Error("seek 실패"));
    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.currentTime = Math.min(time, Math.max(0, video.duration - 0.05));
  });
}

function makeDepthMap(baseImageData, width, height) {
  const out = new ImageData(width, height);
  for (let i = 0; i < baseImageData.length; i += 4) {
    const gray = (baseImageData[i] + baseImageData[i + 1] + baseImageData[i + 2]) / 3;
    out.data[i] = gray;
    out.data[i + 1] = gray;
    out.data[i + 2] = gray;
    out.data[i + 3] = 255;
  }
  return out;
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function buildPrompt(referenceFrameId) {
  const type = el.sceneType.value;
  const template = sceneTemplates[type];
  if (!template) return "";

  const values = {
    REFERENCE_FRAME: referenceFrameId || "S01_F001",
    CAMERA_DELTA: el.cameraDelta.value || "+10 degree right",
    WARDROBE: el.wardrobe.value || "HANBOK_CW01",
    MUST_SHOW: el.mustShow.value || "dakbaeksuk hero bowl, steam, host hands",
    MUST_AVOID: el.mustAvoid.value || "bulgogi cues, clutter, distorted hands"
  };

  let prompt = template;
  Object.entries(values).forEach(([key, value]) => {
    prompt = prompt.replaceAll(`{${key}}`, value);
  });

  const globalPrefix = "Use the provided first-frame image as composition and depth reference only. Preserve grayscale depth hierarchy. Replace pabulgogi semantics with dakbaeksuk (main) and nurungji-tang (secondary). Keep host identity consistent.";
  const negative = "Negative constraints: no pabulgogi semantics, no wok-centric setup, no distorted fingers, no plastic skin, no random text artifacts.";

  return `${globalPrefix}\n\n${prompt}\n\n${negative}`;
}

function renderFrames() {
  el.frames.innerHTML = "";
  state.frames.forEach((frame) => {
    const card = document.createElement("div");
    card.className = "frame-card";

    const imageGrid = document.createElement("div");
    imageGrid.className = "frame-image-grid";

    const img = document.createElement("img");
    img.src = frame.dataUrl;
    img.alt = `${frame.id}-original`;

    const depthImg = document.createElement("img");
    depthImg.src = frame.depthDataUrl;
    depthImg.alt = `${frame.id}-depth`;

    imageGrid.appendChild(img);
    imageGrid.appendChild(depthImg);

    const meta = document.createElement("div");
    meta.className = "frame-meta";
    meta.innerHTML = `<b>${frame.id}</b><br/>${frame.time.toFixed(2)}s<br/>좌:원본 / 우:심도(그레이)`;

    const pickBtn = document.createElement("button");
    pickBtn.textContent = "이 프레임 선택";
    pickBtn.className = "secondary";
    pickBtn.addEventListener("click", () => {
      el.frameId.value = frame.id;
      el.promptOutput.value = buildPrompt(frame.id);
      setStatus(`${frame.id} 선택됨`);
    });

    const downOriginal = document.createElement("button");
    downOriginal.textContent = "원본 JPG";
    downOriginal.className = "secondary";
    downOriginal.addEventListener("click", () => downloadDataUrl(frame.dataUrl, `${frame.id}.jpg`));

    const downDepth = document.createElement("button");
    downDepth.textContent = "심도 JPG";
    downDepth.className = "secondary";
    downDepth.addEventListener("click", () => downloadDataUrl(frame.depthDataUrl, `${frame.id}_depth.jpg`));

    const btnWrap = document.createElement("div");
    btnWrap.className = "actions";
    btnWrap.appendChild(pickBtn);
    btnWrap.appendChild(downOriginal);
    btnWrap.appendChild(downDepth);

    card.appendChild(imageGrid);
    card.appendChild(meta);
    card.appendChild(btnWrap);
    el.frames.appendChild(card);
  });
}

async function analyzeVideoCuts() {
  if (!el.videoFile.files?.length) {
    setStatus("먼저 영상을 업로드해 주세요.");
    return;
  }

  const file = el.videoFile.files[0];
  if (state.fileUrl) URL.revokeObjectURL(state.fileUrl);
  state.fileUrl = URL.createObjectURL(file);
  el.previewVideo.src = state.fileUrl;

  await new Promise((resolve) => {
    el.previewVideo.onloadedmetadata = resolve;
  });

  const duration = Math.min(Number(el.maxSeconds.value), el.previewVideo.duration);
  const step = Number(el.sampleStep.value);
  const sensitivity = Number(el.sensitivity.value);

  const canvas = el.workCanvas;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  state.frames = [];
  let prevImageData = null;
  let count = 1;

  setStatus(`분석 중... (0 / ${duration.toFixed(1)}초)`);

  for (let t = 0; t <= duration; t += step) {
    await waitSeek(el.previewVideo, t);
    ctx.drawImage(el.previewVideo, 0, 0, canvas.width, canvas.height);
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let isCut = false;
    if (!prevImageData) {
      isCut = true;
    } else {
      const diff = averageDiff(prevImageData, current.data);
      isCut = diff >= sensitivity;
    }

    if (isCut) {
      const id = `S01_F${String(count).padStart(3, "0")}`;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

      const depthMap = makeDepthMap(current.data, canvas.width, canvas.height);
      ctx.putImageData(depthMap, 0, 0);
      const depthDataUrl = canvas.toDataURL("image/jpeg", 0.92);

      ctx.putImageData(current, 0, 0);
      state.frames.push({ id, time: t, dataUrl, depthDataUrl });
      count += 1;
    }

    prevImageData = new Uint8ClampedArray(current.data);
    setStatus(`분석 중... (${t.toFixed(1)} / ${duration.toFixed(1)}초)`);
  }

  renderFrames();
  setStatus(`완료: ${state.frames.length}개 컷 첫 프레임/심도맵 추출`);
}

function generatePrompt() {
  el.promptOutput.value = buildPrompt(el.frameId.value);
}

function generateBatchPrompts() {
  if (!state.frames.length) {
    setStatus("일괄 생성 전에 컷 분할을 먼저 실행해 주세요.");
    return;
  }

  const blocks = state.frames.map((frame) => {
    return `### ${frame.id}\n${buildPrompt(frame.id)}`;
  });
  el.promptOutput.value = blocks.join("\n\n");
  setStatus(`${state.frames.length}개 프레임 일괄 프롬프트 생성 완료`);
}

function exportCutCsv() {
  if (!state.frames.length) {
    setStatus("CSV 내보내기 전에 컷 분할을 먼저 실행해 주세요.");
    return;
  }

  const header = [
    "frame_id","time_sec","scene_type","camera_delta","wardrobe_code","must_show","must_avoid","output_ar"
  ];

  const rows = state.frames.map((frame) => [
    frame.id,
    frame.time.toFixed(2),
    el.sceneType.value,
    (el.cameraDelta.value || "+10 degree right").replaceAll(",", " "),
    (el.wardrobe.value || "HANBOK_CW01").replaceAll(",", " "),
    (el.mustShow.value || "dakbaeksuk hero bowl steam").replaceAll(",", " "),
    (el.mustAvoid.value || "bulgogi cues clutter").replaceAll(",", " "),
    "16:9"
  ]);

  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, "cut_map_export.csv");
  URL.revokeObjectURL(url);

  setStatus(`CSV 내보내기 완료 (${rows.length}행)`);
}

function clearAll() {
  state.frames = [];
  renderFrames();
  el.promptOutput.value = "";
  el.frameId.value = "";
  setStatus("초기화됨");
}

async function copyPrompt() {
  if (!el.promptOutput.value.trim()) return;
  await navigator.clipboard.writeText(el.promptOutput.value);
  setStatus("프롬프트 복사 완료");
}

initSceneTypes();
el.analyzeBtn.addEventListener("click", analyzeVideoCuts);
el.exportCsvBtn.addEventListener("click", exportCutCsv);
el.clearBtn.addEventListener("click", clearAll);
el.generateBtn.addEventListener("click", generatePrompt);
el.batchBtn.addEventListener("click", generateBatchPrompts);
el.copyBtn.addEventListener("click", copyPrompt);
