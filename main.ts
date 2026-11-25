// One Star for Monday — a one-star review of Monday, written as though
// Monday were a restaurant. The program emits exactly one line of plain
// text to <outDir>/entry.txt and checks it against the competition gate
// (1–180 characters, at most 25 words, a single line) before finishing.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The review, built from two beats: the complaint, then the verdict.
const complaint =
  "Monday showed up late, did nothing, and still asked for a raise.";
const verdict = "One star. Would not repeat.";
const review = `${complaint} ${verdict}`;

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function guard(text: string): void {
  if (text.length < 1 || text.length > 180) {
    throw new Error(`entry length ${text.length} outside the 1-180 gate`);
  }
  if (wordCount(text) > 25) {
    throw new Error(`entry has ${wordCount(text)} words, over the 25-word cap`);
  }
  if (text.includes("\n") || text.trim() !== text) {
    throw new Error("entry must be a single unpadded line");
  }
}

guard(review);
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, review, "utf8");

// Read the file back and confirm it is byte-identical to the review.
const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== review) {
  throw new Error("entry.txt does not match the review byte for byte");
}
console.log(`wrote entry.txt (${review.length} chars, ${wordCount(review)} words)`);
console.log("read-back check passed: entry.txt is byte-identical");
