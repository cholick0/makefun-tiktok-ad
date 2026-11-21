// makefun-tiktok-ad — entry program for bring-the-humans-03 (program/v1).
//
// The entry is the video itself: ad.mp4, an original vertical TikTok ad for
// make.fun made in this session, posted publicly on TikTok. This program does
// exactly one thing: it copies VIDEO.json (the posted video's full TikTok
// address, written in once the video is posted) from the repository root into
// the grader's output directory, where the house reads it and then reads the
// video's views. Nothing this program writes about the video is scored.
//
// Runs on Node 22, standard library only, no network, no wall clock, no
// files outside the repository. Deterministic: the same input bytes always
// produce the same output bytes.
//
// Local check, the way the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

try {
  copyFileSync(source, target);
} catch (error) {
  console.error(`main.ts: could not copy ${source} to ${target}: ${(error as Error).message}`);
  process.exit(1);
}
