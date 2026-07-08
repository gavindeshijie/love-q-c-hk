import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();

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

function localFile(imagePath) {
  return imagePath.startsWith("/assets/") ? path.join(root, "public", imagePath.replace(/^\//, "")) : "";
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function expectedTerms(product, index) {
  if (index === 0) return [product.name, product.categoryName, product.subCategoryName];
  if (index === 1) return [product.name, product.subCategoryName, "细节"];
  if (index === 2) return [product.name, product.discreetName, "包装"];
  return [product.name];
}

const { mockCategories, mockSubCategories, mockProducts } = await loadData();

const problems = [];
const imageUse = new Map();
const hashUse = new Map();
let checkedImages = 0;

for (const product of mockProducts) {
  if (!Array.isArray(product.images) || product.images.length < 3) {
    problems.push({ type: "short_images", productId: product.id, count: product.images?.length ?? 0 });
  }

  const localPaths = new Set();
  for (const [index, image] of (product.images ?? []).entries()) {
    if (!image || image.startsWith("visual-")) {
      problems.push({ type: "placeholder_ref", productId: product.id, image });
      continue;
    }

    if (image.includes("/generated-products/") || image.endsWith(".svg")) {
      problems.push({ type: "abstract_generated_asset", productId: product.id, image });
    }

    if (localPaths.has(image)) {
      problems.push({ type: "duplicate_in_product", productId: product.id, image });
    }
    localPaths.add(image);

    const usedBy = imageUse.get(image) ?? [];
    usedBy.push(product.id);
    imageUse.set(image, usedBy);

    const file = localFile(image);
    if (!file) {
      problems.push({ type: "non_local_image", productId: product.id, image });
      continue;
    }

    try {
      const buffer = await fs.readFile(file);
      checkedImages += 1;
      const fileHash = sha256(buffer);
      const hashUsers = hashUse.get(fileHash) ?? [];
      hashUsers.push(`${product.id}:${index}`);
      hashUse.set(fileHash, hashUsers);

      if (image.endsWith(".svg")) {
        const svg = buffer.toString("utf8");
        const missingTerms = expectedTerms(product, index).filter((term) => !svg.includes(term));
        if (missingTerms.length) problems.push({ type: "svg_metadata_mismatch", productId: product.id, image, missingTerms });
      }
    } catch {
      problems.push({ type: "missing_file", productId: product.id, image });
    }
  }
}

for (const [image, users] of imageUse.entries()) {
  if (users.length > 1) problems.push({ type: "image_path_reused", image, users: users.slice(0, 8), total: users.length });
}

for (const [fileHash, users] of hashUse.entries()) {
  if (users.length > 1) problems.push({ type: "identical_file_hash", hash: fileHash, users: users.slice(0, 8), total: users.length });
}

for (const category of mockCategories) {
  const categoryProducts = mockProducts.filter((product) => product.categoryId === category.id);
  if (categoryProducts.length < 10) problems.push({ type: "category_too_few_products", category: category.slug, count: categoryProducts.length });
}

for (const subCategory of mockSubCategories) {
  const products = mockProducts.filter((product) => product.subCategoryId === subCategory.id);
  if (products.length < 10) problems.push({ type: "subcategory_too_few_products", subCategory: subCategory.slug, count: products.length });
}

const routes = [
  "/",
  "/categories",
  ...mockCategories.map((category) => `/category/${category.slug}`),
  ...mockSubCategories.map((sub) => {
    const category = mockCategories.find((item) => item.id === sub.categoryId);
    return `/category/${category?.slug}/${sub.slug}`;
  }),
  ...mockProducts.map((product) => `/product/${product.id}`)
];

const report = {
  categories: mockCategories.length,
  subCategories: mockSubCategories.length,
  products: mockProducts.length,
  checkedImages,
  uniqueImagePaths: imageUse.size,
  uniqueFileHashes: hashUse.size,
  pageRoutesAudited: routes.length,
  problems: problems.length,
  problemSamples: problems.slice(0, 20)
};

console.log(JSON.stringify(report, null, 2));

if (problems.length) process.exit(1);
