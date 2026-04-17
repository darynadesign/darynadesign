// Rebuild the Wave zoom-animation composite atlases with interior gaps
// scaled by GAP_SCALE. Outer padding is preserved unchanged.
//
//   node scripts/rebuild-wave-zoom-atlas.mjs           # writes .new.webp
//   node scripts/rebuild-wave-zoom-atlas.mjs --commit  # overwrites originals
//
// Tile positions are detected from the existing atlas by scanning for runs
// of near-uniform background pixels, so re-running on an already-rebuilt
// atlas with a different GAP_SCALE will stack (i.e. always edit the SOURCE
// atlas, not a previously-rebuilt one — or revert first).

import sharp from "sharp";
import { rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const GAP_SCALE = 0.8;
// Background color of the zoom section (matches .case-wave-zoom CSS
// #bfccea). Inter-tile gaps are painted in this color in both composites.
const BG = { r: 191, g: 204, b: 234 };
const BG_TOLERANCE = 8;
// A row/column with non-bg pixel fraction below this is treated as a gap.
// Gaps are 100% bg; tile rows/cols have substantial non-bg content even
// when many tiles happen to be lavender/white, so the threshold has plenty
// of margin.
const TILE_FRACTION_THRESHOLD = 0.01;

const TARGETS = [
  {
    label: "desktop",
    src: resolve(ROOT, "assets/Wave/zoom-animation-composite-desktop.webp"),
    expectedCols: 7,
    expectedRows: 6,
  },
  {
    label: "mobile",
    src: resolve(ROOT, "assets/Wave/zoom-animation-composite-mobile.webp"),
  },
];

function outPath(src) {
  return src.replace(/\.webp$/, ".new.webp");
}

async function loadRGBA(path) {
  const img = sharp(path).ensureAlpha();
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

function isBgPixel(data, i, bg) {
  return (
    Math.abs(data[i] - bg.r) <= BG_TOLERANCE &&
    Math.abs(data[i + 1] - bg.g) <= BG_TOLERANCE &&
    Math.abs(data[i + 2] - bg.b) <= BG_TOLERANCE
  );
}

// Non-bg pixel fraction for each column (length = width).
function columnNonBgFractions(data, width, height, bg) {
  const out = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    let nonBg = 0;
    for (let y = 0; y < height; y++) {
      if (!isBgPixel(data, (y * width + x) * 4, bg)) nonBg++;
    }
    out[x] = nonBg / height;
  }
  return out;
}

// Non-bg pixel fraction for each row (length = height).
function rowNonBgFractions(data, width, height, bg) {
  const out = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    let nonBg = 0;
    const rowStart = y * width * 4;
    for (let x = 0; x < width; x++) {
      if (!isBgPixel(data, rowStart + x * 4, bg)) nonBg++;
    }
    out[y] = nonBg / width;
  }
  return out;
}

// Returns [{ start, end }] ranges of indices where the fraction is above
// the threshold (i.e. tile rows/cols). Gap regions have fraction ≈ 0.
function detectTileRanges(fractions, threshold) {
  const ranges = [];
  let inTile = false;
  let start = 0;
  for (let i = 0; i < fractions.length; i++) {
    const isTile = fractions[i] > threshold;
    if (isTile && !inTile) {
      inTile = true;
      start = i;
    } else if (!isTile && inTile) {
      inTile = false;
      ranges.push({ start, end: i });
    }
  }
  if (inTile) ranges.push({ start, end: fractions.length });
  return ranges;
}

function assertUniform(ranges, label) {
  if (ranges.length < 2) return;
  const tileSizes = ranges.map((r) => r.end - r.start);
  const gapSizes = [];
  for (let i = 1; i < ranges.length; i++) {
    gapSizes.push(ranges[i].start - ranges[i - 1].end);
  }
  const spread = (arr) => Math.max(...arr) - Math.min(...arr);
  if (spread(tileSizes) > 2) {
    console.warn(
      `  [${label}] non-uniform tile sizes: min=${Math.min(...tileSizes)} max=${Math.max(...tileSizes)} (spread ${spread(tileSizes)})`,
    );
  }
  if (spread(gapSizes) > 2) {
    console.warn(
      `  [${label}] non-uniform gap sizes: min=${Math.min(...gapSizes)} max=${Math.max(...gapSizes)} (spread ${spread(gapSizes)})`,
    );
  }
}

async function rebuild(target) {
  console.log(`\n=== ${target.label}: ${target.src}`);
  const { data, width, height } = await loadRGBA(target.src);
  console.log(
    `  size: ${width}x${height}  bg: rgb(${BG.r},${BG.g},${BG.b})`,
  );

  const colFractions = columnNonBgFractions(data, width, height, BG);
  const rowFractions = rowNonBgFractions(data, width, height, BG);
  const colRanges = detectTileRanges(colFractions, TILE_FRACTION_THRESHOLD);
  const rowRanges = detectTileRanges(rowFractions, TILE_FRACTION_THRESHOLD);

  console.log(
    `  grid: ${colRanges.length} cols x ${rowRanges.length} rows`,
  );
  assertUniform(colRanges, "cols");
  assertUniform(rowRanges, "rows");

  if (target.expectedCols && colRanges.length !== target.expectedCols) {
    throw new Error(
      `expected ${target.expectedCols} cols, detected ${colRanges.length}`,
    );
  }
  if (target.expectedRows && rowRanges.length !== target.expectedRows) {
    throw new Error(
      `expected ${target.expectedRows} rows, detected ${rowRanges.length}`,
    );
  }

  const leftPad = colRanges[0].start;
  const rightPad = width - colRanges[colRanges.length - 1].end;
  const topPad = rowRanges[0].start;
  const bottomPad = height - rowRanges[rowRanges.length - 1].end;

  const oldGapXs = [];
  for (let i = 1; i < colRanges.length; i++) {
    oldGapXs.push(colRanges[i].start - colRanges[i - 1].end);
  }
  const oldGapYs = [];
  for (let i = 1; i < rowRanges.length; i++) {
    oldGapYs.push(rowRanges[i].start - rowRanges[i - 1].end);
  }
  const avgGapX = Math.round(
    oldGapXs.reduce((a, b) => a + b, 0) / oldGapXs.length,
  );
  const avgGapY = Math.round(
    oldGapYs.reduce((a, b) => a + b, 0) / oldGapYs.length,
  );
  const newGapX = Math.round(avgGapX * GAP_SCALE);
  const newGapY = Math.round(avgGapY * GAP_SCALE);

  console.log(
    `  outer pad: L=${leftPad} R=${rightPad} T=${topPad} B=${bottomPad}`,
  );
  console.log(
    `  gap X: avg ${avgGapX} -> ${newGapX}  gap Y: avg ${avgGapY} -> ${newGapY}`,
  );

  // Build new canvas: preserve outer pad + tile sizes, use new gaps.
  const tileWs = colRanges.map((r) => r.end - r.start);
  const tileHs = rowRanges.map((r) => r.end - r.start);
  const newWidth =
    leftPad +
    tileWs.reduce((a, b) => a + b, 0) +
    newGapX * (colRanges.length - 1) +
    rightPad;
  const newHeight =
    topPad +
    tileHs.reduce((a, b) => a + b, 0) +
    newGapY * (rowRanges.length - 1) +
    bottomPad;
  console.log(
    `  new size: ${newWidth}x${newHeight} (was ${width}x${height})`,
  );

  // Extract each tile as a PNG buffer, then composite onto new canvas.
  const composites = [];
  let newTop = topPad;
  for (let r = 0; r < rowRanges.length; r++) {
    let newLeft = leftPad;
    for (let c = 0; c < colRanges.length; c++) {
      const tileW = tileWs[c];
      const tileH = tileHs[r];
      const tileBuf = await sharp(target.src)
        .extract({
          left: colRanges[c].start,
          top: rowRanges[r].start,
          width: tileW,
          height: tileH,
        })
        .png()
        .toBuffer();
      composites.push({ input: tileBuf, left: newLeft, top: newTop });
      newLeft += tileW + newGapX;
    }
    newTop += tileHs[r] + newGapY;
  }

  const out = outPath(target.src);
  await sharp({
    create: {
      width: newWidth,
      height: newHeight,
      channels: 4,
      background: { r: BG.r, g: BG.g, b: BG.b, alpha: 1 },
    },
  })
    .composite(composites)
    .webp({ quality: 92 })
    .toFile(out);
  console.log(`  wrote ${out}`);

  // Focus-point recomputation for logging — centers of each tile in the
  // new atlas, normalized. Useful to sanity-check focusPoint() in wave.html.
  const tileCentersX = [];
  let accX = leftPad;
  for (let c = 0; c < colRanges.length; c++) {
    tileCentersX.push((accX + tileWs[c] / 2) / newWidth);
    accX += tileWs[c] + newGapX;
  }
  const tileCentersY = [];
  let accY = topPad;
  for (let r = 0; r < rowRanges.length; r++) {
    tileCentersY.push((accY + tileHs[r] / 2) / newHeight);
    accY += tileHs[r] + newGapY;
  }
  console.log(
    `  tile centers X: ${tileCentersX.map((v) => v.toFixed(4)).join(", ")}`,
  );
  console.log(
    `  tile centers Y: ${tileCentersY.map((v) => v.toFixed(4)).join(", ")}`,
  );

  return { src: target.src, out };
}

async function main() {
  const commit = process.argv.includes("--commit");
  const results = [];
  for (const t of TARGETS) {
    results.push(await rebuild(t));
  }
  if (commit) {
    for (const { src, out } of results) {
      await rename(out, src);
      console.log(`committed: ${out} -> ${src}`);
    }
  } else {
    console.log(
      "\nPreview written. Re-run with --commit to overwrite originals.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
