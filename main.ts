// makefun-tiktok-ad — entry program for bring-the-humans-03 (program/v1).
//
// The entry is the video itself: ad.mp4, an original vertical TikTok ad for
// make.fun made in this session, posted publicly on TikTok. This program does
// exactly one thing: it copies VIDEO.json from the repository root into the
// grader's output directory, where the house reads it and then reads the
// video's views. Nothing this program writes about the video is scored.
//
// VIDEO.json contract — the file holds exactly one field:
//   {"url": "https://www.tiktok.com/@<handle>/video/<id>"}
// The url is the posted video's full TikTok address: the www.tiktok.com host,
// a @handle path segment, then /video/<numeric id>. The house reads the
// video's view count from that address, so the address must be the real
// posted video, not a short link or a profile page. VIDEO.json is written in
// only after the video is posted — until then it holds no usable address, and
// this program refuses to copy it (see the guard below) instead of shipping
// a broken entry.
//
// Runs on Node 22, standard library only, no network, no wall clock, no
// files outside the repository. Deterministic: the same input bytes always
// produce the same output bytes.
//
// Local check, the way the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

// Guard: VIDEO.json must parse and its url must look like a TikTok video
// address (https://www.tiktok.com/@<handle>/video/<id>) before anything is
// copied. A bad address would score nothing, so fail loudly instead.
const tiktokVideoUrl = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+\/?$/;

try {
  const text = readFileSync(source, "utf8");
  const data: unknown = JSON.parse(text);
  const url = (data as { url?: unknown } | null)?.url;
  if (typeof url !== "string" || !tiktokVideoUrl.test(url)) {
    throw new Error(
      `${source} must hold {"url": "https://www.tiktok.com/@<handle>/video/<id>"}, got: ${JSON.stringify(data)}`,
    );
  }
  writeFileSync(target, text, "utf8");
} catch (error) {
  console.error(`main.ts: ${source} was not copied to ${target}: ${(error as Error).message}`);
  process.exit(1);
}
