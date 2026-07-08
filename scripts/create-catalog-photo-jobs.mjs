import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const generatedRoot = "/Users/gavin/.codex/generated_images/019efd71-fb8e-7d91-8a28-6cbb372caad1";

const sheets = {
  starter: "ig_03f33a7a10c4fc62016a4e03d7ad888199a3324e887c2f994d.png",
  apparel: "ig_03f33a7a10c4fc62016a4e045313388199bbec7765acd5da1a.png",
  care: "ig_03f33a7a10c4fc62016a4e04dde9a48199a575504e67757b9a.png",
  protection: "ig_03f33a7a10c4fc62016a4e055c30348199acea5a51dda529d3.png",
  "gift-box": "ig_03f33a7a10c4fc62016a4e05e2bd408199abc7efff72cec7cb.png",
  "storage-clean": "ig_03f33a7a10c4fc62016a4e066d75a08199988d04f2e3c8eca2.png",
  sleepwear: "ig_053ce7ee78b8a4db016a4e072e2728819198b7eda78a8ea189.png",
  roleplay: "ig_053ce7ee78b8a4db016a4e07d023bc8191a36ec5658613c47e.png",
  tools: "ig_053ce7ee78b8a4db016a4e085f6d748191bf8d4a46822b278a.png",
  wellness: "ig_053ce7ee78b8a4db016a4e091d57ac8191a0fc77141eb884fa.png",
  scent: "ig_053ce7ee78b8a4db016a4e09bfbd208191b7aa6b630703b364.png",
  couple: "ig_0e8bcd2734d57e87016a4e0aba966c819391733b70364a013c.png",
  games: "ig_0e8bcd2734d57e87016a4e0b3294b8819387287776c7ba291b.png",
  sale: "ig_0e8bcd2734d57e87016a4e0baae04c8193ab6ce9234fc37832.png"
};

const allCells = Array.from({ length: 25 }, (_, index) => index);

const pools = {
  apparel: {
    panties: [0, 1, 2, 3, 24, 0, 1, 2, 3, 24],
    bras: [1, 2, 3, 6, 7, 14, 24, 1, 2, 3],
    "sleep-dresses": [5, 6, 7, 8, 9, 23, 24, 5, 6, 7],
    bodysuits: [4, 13, 14, 24, 2, 3, 4, 13, 14, 24],
    stockings: [11, 12, 10, 13, 19, 20, 21, 22, 11, 12],
    "skirts-shorts": [15, 16, 17, 18, 9, 19, 15, 16, 17, 18],
    "apparel-roleplay": [16, 18, 19, 20, 21, 22, 23, 24, 13, 14],
    "accessories-belts": [10, 13, 19, 20, 21, 22, 23, 10, 20, 21]
  },
  sleepwear: {
    "satin-nightdress": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    robes: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    "home-sets": [5, 6, 7, 8, 9, 20, 21, 22, 23, 24],
    "long-robe-sets": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    "sleep-gifts": [20, 21, 22, 23, 24, 0, 1, 2, 3, 4]
  },
  roleplay: {
    "academy-style": [0, 1, 2, 3, 4, 15, 16, 17, 18, 19],
    "nurse-style": [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    "kimono-style": [10, 11, 12, 13, 14, 20, 21, 22, 23, 24],
    "qipao-style": [10, 11, 12, 13, 14, 20, 21, 22, 23, 24],
    "stage-style": [15, 16, 17, 18, 19, 0, 1, 2, 3, 4],
    "host-style": [20, 21, 22, 23, 24, 5, 6, 7, 8, 9]
  },
  scent: {
    candles: [0, 1, 2, 3, 4, 20, 21, 22, 23, 24],
    diffusers: [5, 6, 7, 8, 9, 15, 16, 17, 18, 19],
    "mood-lights": [10, 11, 12, 13, 14, 20, 21, 22, 23, 24],
    "room-mists": [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    "bath-scent": [15, 16, 17, 18, 19, 10, 11, 12, 13, 14]
  }
};

async function loadData() {
  const source = await fs.readFile(path.join(root, "src/data/mockData.ts"), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}

function outputPath(productId, kind) {
  return path.join(root, "public/assets/catalog-photos", `${productId}-${kind}.jpg`);
}

function stableHash(value) {
  return [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 1000003, 17);
}

function cellRect(cellIndex, productSalt, kind) {
  const imageSize = 1254;
  const cellSize = imageSize / 5;
  const col = cellIndex % 5;
  const row = Math.floor(cellIndex / 5);
  const driftX = (productSalt % 9) - 4;
  const driftY = (Math.floor(productSalt / 11) % 9) - 4;
  const baseInset = kind === "main" ? 22 : kind === "detail" ? 38 : 28;
  const zoom = kind === "detail" ? 0.82 : kind === "pack" ? 0.9 : 0.92;
  const width = cellSize * zoom - baseInset;
  const height = cellSize * zoom - baseInset;
  const x = col * cellSize + (cellSize - width) / 2 + driftX * 1.15;
  const y = row * cellSize + (cellSize - height) / 2 + driftY * 1.15;
  return { x, y, width, height };
}

const { mockCategories, mockSubCategories, mockProducts } = await loadData();
const categoryById = new Map(mockCategories.map((category) => [category.id, category]));
const subById = new Map(mockSubCategories.map((subCategory) => [subCategory.id, subCategory]));
const positionByGroup = new Map();
const jobs = [];
const manifest = [];

function distinctCells(pool, start, productSalt) {
  const source = pool.length >= 3 ? pool : allCells;
  const step = Math.max(1, Math.floor(source.length / 3));
  const candidates = [
    start,
    start + step + (productSalt % 2),
    start + step * 2 + (productSalt % 3)
  ];
  const chosen = [];

  for (const candidate of candidates) {
    const cell = source[((candidate % source.length) + source.length) % source.length];
    if (!chosen.includes(cell)) chosen.push(cell);
  }

  for (let index = 0; chosen.length < 3 && index < source.length; index += 1) {
    const cell = source[((start + index) % source.length + source.length) % source.length];
    if (!chosen.includes(cell)) chosen.push(cell);
  }

  for (const cell of allCells) {
    if (chosen.length >= 3) break;
    if (!chosen.includes(cell)) chosen.push(cell);
  }

  return chosen.slice(0, 3);
}

for (const product of mockProducts) {
  if (product.id === "p_scent_01") continue;

  const category = categoryById.get(product.categoryId);
  const subCategory = subById.get(product.subCategoryId);
  if (!category) throw new Error(`Missing category for ${product.id}`);

  const groupKey = `${category.slug}:${subCategory?.slug ?? "featured"}`;
  const productOffset = positionByGroup.get(groupKey) ?? 0;
  positionByGroup.set(groupKey, productOffset + 1);

  const pool = pools[category.slug]?.[subCategory?.slug] ?? allCells;
  const productSalt = stableHash(product.id);
  const groupSalt = stableHash(groupKey);
  const start = productOffset + groupSalt;
  const [mainCell, detailCell, packCell] = distinctCells(pool, start, productSalt);
  const cellByKind = { main: mainCell, detail: detailCell, pack: packCell };
  const input = path.join(generatedRoot, sheets[category.slug]);
  if (!sheets[category.slug]) throw new Error(`Missing sheet for ${category.slug}`);

  for (const kind of ["main", "detail", "pack"]) {
    jobs.push({
      input,
      output: outputPath(product.id, kind),
      ...cellRect(cellByKind[kind], productSalt, kind)
    });
  }

  manifest.push({
    productId: product.id,
    categorySlug: category.slug,
    subCategorySlug: subCategory?.slug ?? "featured",
    sourceSheet: sheets[category.slug],
    cells: {
      main: mainCell,
      detail: detailCell,
      pack: packCell
    }
  });
}

const destination = process.argv[2] ?? "/tmp/loveqc-crop-jobs.json";
await fs.writeFile(destination, JSON.stringify(jobs, null, 2));
await fs.writeFile(path.join(root, "scripts/catalog-photo-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${jobs.length} jobs to ${destination}`);
console.log(`Wrote ${manifest.length} manifest entries to scripts/catalog-photo-manifest.json`);
