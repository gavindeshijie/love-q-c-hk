import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const outputDir = path.join(root, "public/assets/generated-products");

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function hash(value) {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result >>> 0);
}

function familyFor(product) {
  const haystack = `${product.categoryName} ${product.subCategoryName} ${product.name}`;
  if (/香氛|蜡烛|扩香|灯|喷雾/.test(haystack)) return "scent";
  if (/护理|清洁|湿巾|凝露|喷雾|油/.test(haystack)) return "care";
  if (/安全|防护|低敏/.test(haystack)) return "protection";
  if (/礼盒|套装|组合/.test(haystack)) return "gift";
  if (/衣|裤|裙|袜|胸|内搭|睡|袍|角色|学院|护士|和风|旗袍|舞台|礼宾/.test(haystack)) return "apparel";
  if (/工具|静音|遥控|温感|充电|探索/.test(haystack)) return "tools";
  if (/按摩|放松|肩颈|温热|舒缓/.test(haystack)) return "wellness";
  if (/互动|卡牌|任务|骰子|挑战|盲盒/.test(haystack)) return "games";
  if (/收纳|锁盒|防尘|抽屉|旅行/.test(haystack)) return "storage";
  return "gift";
}

function palette(seed) {
  const schemes = [
    { bg1: "#11001d", bg2: "#321047", neon: "#ff4fd8", accent: "#9b4dff" },
    { bg1: "#090012", bg2: "#24105a", neon: "#b66cff", accent: "#00e5ff" },
    { bg1: "#0d0017", bg2: "#3a102f", neon: "#ff6adf", accent: "#d6b56d" },
    { bg1: "#070014", bg2: "#1f174a", neon: "#8b5cff", accent: "#ff4fd8" },
    { bg1: "#100010", bg2: "#29122f", neon: "#d6b56d", accent: "#ff4fd8" }
  ];
  return { ...schemes[seed % schemes.length], gold: "#d8b76f", ink: "#090012" };
}

function commonDefs(id, colors) {
  return `
  <defs>
    <radialGradient id="bg-${id}" cx="35%" cy="18%" r="82%">
      <stop offset="0%" stop-color="${colors.neon}" stop-opacity=".42"/>
      <stop offset="42%" stop-color="${colors.bg2}" stop-opacity=".92"/>
      <stop offset="100%" stop-color="${colors.ink}"/>
    </radialGradient>
    <linearGradient id="gold-${id}" x1="0%" x2="100%">
      <stop offset="0%" stop-color="#ffe2a8"/>
      <stop offset="46%" stop-color="${colors.gold}"/>
      <stop offset="100%" stop-color="#a56f30"/>
    </linearGradient>
    <linearGradient id="glass-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff7ff" stop-opacity=".34"/>
      <stop offset="46%" stop-color="${colors.neon}" stop-opacity=".18"/>
      <stop offset="100%" stop-color="#090012" stop-opacity=".18"/>
    </linearGradient>
    <filter id="glow-${id}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.65 0 1 0 0 0.12 0 0 1 0 1 0 0 0 .75 0"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="velvet-${id}" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M0 50 C18 16 42 88 80 34" fill="none" stroke="#fff" stroke-opacity=".035" stroke-width="10"/>
      <path d="M0 18 C24 58 56 -10 80 44" fill="none" stroke="${colors.neon}" stroke-opacity=".055" stroke-width="4"/>
    </pattern>
  </defs>`;
}

function baseScene(id, colors) {
  return `
  <rect width="900" height="1125" fill="url(#bg-${id})"/>
  <rect width="900" height="1125" fill="url(#velvet-${id})" opacity=".95"/>
  <circle cx="745" cy="170" r="210" fill="${colors.neon}" opacity=".11"/>
  <circle cx="140" cy="860" r="260" fill="${colors.accent}" opacity=".09"/>
  <path d="M-40 970 C210 760 472 1125 940 846 L940 1125 L-40 1125Z" fill="#000" opacity=".34"/>
  <rect x="74" y="76" width="752" height="958" rx="58" fill="#000" opacity=".18" stroke="#fff" stroke-opacity=".08"/>`;
}

function ribbon(id) {
  return `
  <path d="M174 832 C300 760 498 780 730 710" fill="none" stroke="url(#gold-${id})" stroke-width="22" opacity=".55"/>
  <path d="M145 858 C316 786 510 810 755 738" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`;
}

function drawBox(id, x, y, w, h, colors, label = false) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.08}" fill="#07020c" stroke="url(#gold-${id})" stroke-width="4"/>
  <rect x="${x + 18}" y="${y + 18}" width="${w - 36}" height="${h - 36}" rx="22" fill="url(#glass-${id})" opacity=".42"/>
  <path d="M${x + w * .5} ${y + 20} L${x + w * .5} ${y + h - 20}" stroke="${colors.gold}" stroke-opacity=".42" stroke-width="8"/>
  <path d="M${x + 20} ${y + h * .48} L${x + w - 20} ${y + h * .48}" stroke="${colors.gold}" stroke-opacity=".36" stroke-width="8"/>
  ${label ? `<rect x="${x + w * .29}" y="${y + h * .42}" width="${w * .42}" height="${h * .16}" rx="12" fill="#12051f" stroke="${colors.gold}" stroke-opacity=".55"/>` : ""}`;
}

function shortLabel(value, max = 13) {
  const text = String(value ?? "").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function imageMeta(product, mode) {
  if (mode === "main") {
    return {
      label: shortLabel(product.name, 14),
      subline: shortLabel(`${product.categoryName} · ${product.subCategoryName}`, 22),
      audit: product.name
    };
  }
  if (mode === "detail") {
    return {
      label: shortLabel(`${product.subCategoryName}细节`, 12),
      subline: shortLabel(`${product.tags.slice(0, 2).join(" · ")} · 材质角度`, 22),
      audit: `${product.name} 细节材质 ${product.subCategoryName}`
    };
  }
  return {
    label: shortLabel(`${product.discreetName}包装`, 12),
    subline: shortLabel(`中性名称 · ${product.discreetName}`, 22),
    audit: `${product.name} 隐私包装 ${product.discreetName}`
  };
}

function drawApparel(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 210, 270, 480, 520, colors, true)}${ribbon(id)}<path d="M280 265 C350 190 550 190 620 265" fill="none" stroke="${colors.neon}" stroke-opacity=".45" stroke-width="7"/>`;
  if (mode === "detail") return `
    <rect x="155" y="262" width="590" height="560" rx="50" fill="#07020c" stroke="url(#gold-${id})" stroke-opacity=".46" stroke-width="4"/>
    <path d="M190 625 C300 500 410 760 520 570 C616 408 692 640 735 492" fill="none" stroke="${colors.neon}" stroke-width="13" opacity=".5"/>
    <g opacity=".72">${Array.from({ length: 9 }, (_, i) => `<circle cx="${240 + i * 54}" cy="${376 + (i % 2) * 42}" r="23" fill="none" stroke="${colors.accent}" stroke-width="5" opacity=".45"/>`).join("")}</g>
    <path d="M232 708 C370 612 510 610 682 720" fill="none" stroke="url(#gold-${id})" stroke-width="16" opacity=".62"/>`;
  return `
    <path d="M298 300 C348 245 555 245 606 300 C636 396 672 550 710 736 C574 802 325 802 190 736 C228 552 268 394 298 300Z" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="6" filter="url(#glow-${id})"/>
    <path d="M310 318 C370 408 532 408 594 318" fill="none" stroke="${colors.neon}" stroke-width="14" opacity=".55"/>
    <path d="M244 720 C370 640 528 640 656 720" fill="none" stroke="${colors.accent}" stroke-width="12" opacity=".62"/>
    ${ribbon(id)}`;
}

function drawScent(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 190, 250, 520, 590, colors, true)}${ribbon(id)}<circle cx="450" cy="520" r="70" fill="${colors.neon}" opacity=".16"/>`;
  if (mode === "detail") return `
    <rect x="242" y="300" width="182" height="420" rx="44" fill="#08020e" stroke="url(#gold-${id})" stroke-width="5"/>
    <rect x="286" y="370" width="94" height="160" rx="18" fill="url(#glass-${id})" opacity=".6"/>
    <path d="M530 720 L560 310 M574 720 L604 304 M618 720 L646 314" stroke="${colors.gold}" stroke-width="9" stroke-linecap="round"/>
    <rect x="500" y="628" width="178" height="98" rx="24" fill="#08020e" stroke="${colors.neon}" stroke-opacity=".5" stroke-width="5"/>`;
  return `
    <rect x="210" y="550" width="230" height="240" rx="42" fill="#07020c" stroke="url(#gold-${id})" stroke-width="5" filter="url(#glow-${id})"/>
    <ellipse cx="325" cy="550" rx="112" ry="34" fill="url(#gold-${id})" opacity=".72"/>
    <path d="M316 514 C300 470 332 448 324 410 C370 452 362 488 338 516Z" fill="#ffe8a8" opacity=".9"/>
    <rect x="508" y="420" width="136" height="330" rx="34" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="5"/>
    <path d="M576 420 L532 222 M584 420 L626 220 M572 420 L574 210" stroke="${colors.gold}" stroke-width="8" stroke-linecap="round"/>
    ${ribbon(id)}`;
}

function drawCare(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 190, 248, 520, 590, colors, true)}${ribbon(id)}<rect x="318" y="370" width="264" height="270" rx="34" fill="url(#glass-${id})" opacity=".36"/>`;
  if (mode === "detail") return `
    <rect x="168" y="420" width="270" height="260" rx="38" fill="#090012" stroke="${colors.neon}" stroke-opacity=".5" stroke-width="5"/>
    <path d="M210 482 H396 M210 540 H396 M210 598 H356" stroke="#fff" stroke-opacity=".16" stroke-width="10"/>
    <rect x="502" y="262" width="160" height="520" rx="58" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="5"/>`;
  return `
    <rect x="230" y="270" width="158" height="520" rx="58" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="5" filter="url(#glow-${id})"/>
    <rect x="266" y="224" width="86" height="74" rx="18" fill="#090012" stroke="${colors.gold}" stroke-width="4"/>
    <rect x="470" y="342" width="186" height="388" rx="42" fill="#090012" stroke="${colors.neon}" stroke-opacity=".55" stroke-width="5"/>
    <rect x="506" y="420" width="114" height="116" rx="20" fill="url(#glass-${id})" opacity=".5"/>
    ${ribbon(id)}`;
}

function drawProtection(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 185, 250, 530, 560, colors, false)}${ribbon(id)}`;
  if (mode === "detail") return `
    ${Array.from({ length: 4 }, (_, i) => `<rect x="${180 + (i % 2) * 290}" y="${282 + Math.floor(i / 2) * 270}" width="230" height="210" rx="34" fill="url(#glass-${id})" stroke="${i % 2 ? colors.gold : colors.neon}" stroke-opacity=".62" stroke-width="5"/>`).join("")}`;
  return `
    <rect x="190" y="300" width="520" height="420" rx="56" fill="#08020e" stroke="url(#gold-${id})" stroke-width="6" filter="url(#glow-${id})"/>
    <rect x="254" y="360" width="392" height="300" rx="34" fill="url(#glass-${id})" opacity=".46"/>
    <circle cx="450" cy="510" r="80" fill="none" stroke="${colors.neon}" stroke-width="12" opacity=".48"/>
    ${ribbon(id)}`;
}

function drawTools(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 196, 260, 510, 560, colors, true)}${ribbon(id)}<rect x="334" y="380" width="232" height="270" rx="60" fill="url(#glass-${id})" opacity=".36"/>`;
  if (mode === "detail") return `
    <rect x="238" y="250" width="174" height="560" rx="86" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="6"/>
    <circle cx="325" cy="352" r="24" fill="${colors.neon}" opacity=".55"/>
    <rect x="486" y="336" width="190" height="360" rx="62" fill="#07020c" stroke="${colors.neon}" stroke-opacity=".5" stroke-width="5"/>`;
  return `
    <rect x="300" y="235" width="220" height="610" rx="110" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="6" filter="url(#glow-${id})" transform="rotate(12 410 540)"/>
    <circle cx="450" cy="382" r="34" fill="${colors.neon}" opacity=".52"/>
    <rect x="536" y="600" width="190" height="190" rx="48" fill="#07020c" stroke="${colors.gold}" stroke-opacity=".52" stroke-width="5"/>
    ${ribbon(id)}`;
}

function drawGift(mode, id, colors) {
  if (mode === "detail") return `${drawBox(id, 170, 350, 560, 350, colors, false)}<path d="M270 350 C310 250 410 250 450 350 C490 250 590 250 630 350" fill="none" stroke="${colors.neon}" stroke-width="10" opacity=".55"/>`;
  if (mode === "pack") return `${drawBox(id, 150, 235, 600, 620, colors, true)}${ribbon(id)}`;
  return `${drawBox(id, 180, 295, 540, 430, colors, true)}<path d="M295 292 C320 190 426 230 450 302 C474 230 580 190 606 292" fill="none" stroke="${colors.neon}" stroke-width="14" opacity=".6"/>${ribbon(id)}`;
}

function drawStorage(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 170, 260, 560, 560, colors, false)}<path d="M350 260 V198 C350 142 550 142 550 198 V260" fill="none" stroke="${colors.gold}" stroke-width="18" opacity=".55"/>${ribbon(id)}`;
  if (mode === "detail") return `<rect x="180" y="320" width="540" height="380" rx="50" fill="#08020e" stroke="${colors.neon}" stroke-opacity=".55" stroke-width="6"/><path d="M240 410 H660 M240 500 H660 M240 590 H540" stroke="#fff" stroke-opacity=".12" stroke-width="14"/>`;
  return `<rect x="190" y="320" width="520" height="420" rx="58" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="6" filter="url(#glow-${id})"/><circle cx="450" cy="530" r="54" fill="#08020e" stroke="${colors.neon}" stroke-width="8" opacity=".78"/>${ribbon(id)}`;
}

function drawGames(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 185, 260, 530, 560, colors, true)}${ribbon(id)}`;
  if (mode === "detail") return `
    ${Array.from({ length: 5 }, (_, i) => `<rect x="${245 + i * 66}" y="${330 + i * 18}" width="250" height="360" rx="28" fill="#08020e" stroke="${i % 2 ? colors.gold : colors.neon}" stroke-opacity=".5" stroke-width="5" transform="rotate(${i * 5 - 10} ${370 + i * 66} 510)"/>`).join("")}
    <circle cx="610" cy="700" r="58" fill="url(#glass-${id})" stroke="${colors.gold}" stroke-width="5"/>`;
  return `<rect x="260" y="276" width="350" height="500" rx="42" fill="#08020e" stroke="url(#gold-${id})" stroke-width="6" filter="url(#glow-${id})"/><circle cx="435" cy="526" r="112" fill="none" stroke="${colors.neon}" stroke-width="12" opacity=".46"/>${ribbon(id)}`;
}

function drawWellness(mode, id, colors) {
  if (mode === "pack") return `${drawBox(id, 190, 260, 520, 560, colors, true)}${ribbon(id)}`;
  if (mode === "detail") return `<rect x="220" y="360" width="460" height="240" rx="120" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="6"/><circle cx="320" cy="480" r="64" fill="${colors.neon}" opacity=".22"/><circle cx="580" cy="480" r="64" fill="${colors.accent}" opacity=".2"/>`;
  return `<rect x="260" y="326" width="380" height="300" rx="150" fill="url(#glass-${id})" stroke="url(#gold-${id})" stroke-width="6" filter="url(#glow-${id})"/><rect x="344" y="590" width="212" height="198" rx="62" fill="#08020e" stroke="${colors.neon}" stroke-opacity=".55" stroke-width="5"/>${ribbon(id)}`;
}

function shapeFor(product, mode, id, colors) {
  const family = familyFor(product);
  if (family === "scent") return drawScent(mode, id, colors);
  if (family === "care") return drawCare(mode, id, colors);
  if (family === "protection") return drawProtection(mode, id, colors);
  if (family === "apparel") return drawApparel(mode, id, colors);
  if (family === "tools") return drawTools(mode, id, colors);
  if (family === "wellness") return drawWellness(mode, id, colors);
  if (family === "games") return drawGames(mode, id, colors);
  if (family === "storage") return drawStorage(mode, id, colors);
  return drawGift(mode, id, colors);
}

function productSvg(product, mode) {
  const seed = hash(`${product.id}-${mode}`);
  const colors = palette(seed);
  const id = `${product.id}-${mode}`.replaceAll("_", "-");
  const meta = imageMeta(product, mode);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125" role="img" aria-label="${escapeXml(meta.audit)}">
  <metadata>${escapeXml(JSON.stringify({
    productId: product.id,
    sku: product.sku,
    name: product.name,
    category: product.categoryName,
    subCategory: product.subCategoryName,
    mode
  }))}</metadata>
  ${commonDefs(id, colors)}
  ${baseScene(id, colors)}
  ${shapeFor(product, mode, id, colors)}
  <rect x="92" y="900" width="716" height="110" rx="34" fill="#050008" opacity=".42" stroke="#fff" stroke-opacity=".08"/>
  <text x="124" y="948" fill="#fff7ff" font-family="PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="30" font-weight="800">${escapeXml(meta.label)}</text>
  <text x="124" y="988" fill="#d8b76f" font-family="PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="19">${escapeXml(meta.subline)}</text>
</svg>`;
}

async function loadProducts() {
  const source = await fs.readFile(path.join(root, "src/data/mockData.ts"), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const module = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  return module.mockProducts;
}

await fs.mkdir(outputDir, { recursive: true });
const products = await loadProducts();
let written = 0;

for (const product of products) {
  for (const imagePath of product.images) {
    if (!imagePath.startsWith("/assets/generated-products/")) continue;
    const fileName = imagePath.split("/").pop();
    const mode = fileName.includes("-detail.") ? "detail" : fileName.includes("-pack.") ? "pack" : "main";
    await fs.writeFile(path.join(outputDir, fileName), productSvg(product, mode), "utf8");
    written += 1;
  }
}

console.log(`Generated ${written} themed product image assets for ${products.length} products.`);
