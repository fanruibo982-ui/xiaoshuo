const reader = document.getElementById("reader");
const chapterTemplate = document.getElementById("chapterTemplate");
const generateBtn = document.getElementById("generateBtn");
const autoBtn = document.getElementById("autoBtn");
const resetBtn = document.getElementById("resetBtn");
const genreInput = document.getElementById("genre");
const protagonistInput = document.getElementById("protagonist");
const lengthInput = document.getElementById("length");

let chapterIndex = 0;
let autoMode = false;
let autoTimer = null;

const openingPool = [
  "夜色刚落，城门外的风带着雨意，{protagonist}踩着碎石走向命运转角。",
  "清晨钟声传来，{protagonist}在旧书楼翻到一页被火烫过的秘卷。",
  "长街灯火摇晃，{protagonist}忽然听见一声只属于{genre}世界的召唤。",
];

const middlePool = [
  "看似寻常的线索背后，隐藏着一段跨越百年的恩怨。",
  "他/她做出一个冒险决定：先救人，再问真相。",
  "就在最安静的时刻，反派留下的暗号出现在眼前。",
  "同伴的犹豫让局势更复杂，但也逼出主角真正的勇气。",
  "一件旧物突然发光，揭示了主角与世界规则的联系。",
];

const endingPool = [
  "章节末尾，{protagonist}抬头望向远方，知道真正的考验才刚刚开始。",
  "当夜幕再次降临，{protagonist}将答案写进心里，准备踏入下一场风暴。",
  "这一刻，{protagonist}明白：在{genre}之路上，每一步都在改写自己的命运。",
];

function pick(pool, seed) {
  return pool[seed % pool.length];
}

function buildParagraph(genre, protagonist, sentenceCount) {
  const safeCount = Number.isFinite(sentenceCount)
    ? Math.min(12, Math.max(3, sentenceCount))
    : 6;

  const lines = [];
  lines.push(
    pick(openingPool, chapterIndex)
      .replaceAll("{genre}", genre)
      .replaceAll("{protagonist}", protagonist),
  );

  for (let i = 0; i < safeCount - 2; i += 1) {
    lines.push(pick(middlePool, chapterIndex + i));
  }

  lines.push(
    pick(endingPool, chapterIndex)
      .replaceAll("{genre}", genre)
      .replaceAll("{protagonist}", protagonist),
  );

  return lines.join("\n");
}

function appendChapter() {
  const genre = genreInput.value.trim() || "奇幻";
  const protagonist = protagonistInput.value.trim() || "无名主角";
  const sentenceCount = Number.parseInt(lengthInput.value, 10);

  if (chapterIndex === 0) {
    reader.innerHTML = "";
  }

  chapterIndex += 1;
  const fragment = chapterTemplate.content.cloneNode(true);
  fragment.querySelector("h2").textContent = `第 ${chapterIndex} 章`;
  fragment.querySelector("p").textContent = buildParagraph(
    genre,
    protagonist,
    sentenceCount,
  );
  reader.appendChild(fragment);
  reader.scrollTop = reader.scrollHeight;
}

function stopAutoMode() {
  autoMode = false;
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  autoBtn.textContent = "自动续写：关闭";
}

function startAutoMode() {
  autoMode = true;
  autoBtn.textContent = "自动续写：开启";
  appendChapter();
  autoTimer = setInterval(appendChapter, 4000);
}

generateBtn.addEventListener("click", appendChapter);

autoBtn.addEventListener("click", () => {
  if (autoMode) {
    stopAutoMode();
    return;
  }
  startAutoMode();
});

resetBtn.addEventListener("click", () => {
  stopAutoMode();
  chapterIndex = 0;
  reader.innerHTML = '<p class="placeholder">点击「生成下一章」开始阅读。</p>';
});
