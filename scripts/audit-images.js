#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const COVERS_DIR = path.join(PUBLIC_DIR, "images", "covers");

const REQUIRED_FRONTMATTER_FIELDS = ["coverImage", "heroImage", "imageAlt"];
const IMAGE_REF_REGEX = /\/images\/covers\/[^\s"')`]+/g;

function readPostFiles() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

function normalizeImageRef(imageRef) {
  return imageRef.trim();
}

function resolvePublicPathFromRef(imageRef) {
  const relativeFromPublic = imageRef.replace(/^\/+/, "");
  return path.resolve(PUBLIC_DIR, relativeFromPublic);
}

function isInsideCoversDir(resolvedPath) {
  const coversRoot = `${path.resolve(COVERS_DIR)}${path.sep}`;
  return resolvedPath.startsWith(coversRoot);
}

function collectImageRefs(frontmatter, body) {
  const refs = new Set();

  for (const value of Object.values(frontmatter)) {
    if (typeof value !== "string") {
      continue;
    }

    if (value.includes("/images/covers/")) {
      const matches = value.match(IMAGE_REF_REGEX);
      if (matches) {
        for (const match of matches) {
          refs.add(normalizeImageRef(match));
        }
      }
    }
  }

  const bodyMatches = body.match(IMAGE_REF_REGEX);
  if (bodyMatches) {
    for (const match of bodyMatches) {
      refs.add(normalizeImageRef(match));
    }
  }

  return [...refs];
}

function runAudit() {
  const files = readPostFiles();

  const missingFieldsByFile = [];
  const invalidImageRefs = [];
  const missingImageFiles = [];

  for (const file of files) {
    const absolutePath = path.join(CONTENT_DIR, file);
    const source = fs.readFileSync(absolutePath, "utf8");
    const { data, content } = matter(source);

    const missingFields = REQUIRED_FRONTMATTER_FIELDS.filter((field) => {
      const value = data[field];
      return typeof value !== "string" || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      missingFieldsByFile.push({ file, missingFields });
    }

    const imageRefs = collectImageRefs(data, content);

    for (const imageRef of imageRefs) {
      if (!imageRef.startsWith("/images/covers/")) {
        invalidImageRefs.push({ file, imageRef, reason: "must start with /images/covers/" });
        continue;
      }

      const resolvedPath = resolvePublicPathFromRef(imageRef);
      if (!isInsideCoversDir(resolvedPath)) {
        invalidImageRefs.push({
          file,
          imageRef,
          reason: "must resolve within public/images/covers",
        });
        continue;
      }

      if (!fs.existsSync(resolvedPath)) {
        missingImageFiles.push({ file, imageRef });
      }
    }
  }

  return {
    totalPosts: files.length,
    missingFieldsByFile,
    invalidImageRefs,
    missingImageFiles,
  };
}

function printAuditReport(results) {
  const { totalPosts, missingFieldsByFile, invalidImageRefs, missingImageFiles } = results;

  console.log("Image audit summary");
  console.log(`- Posts checked: ${totalPosts}`);
  console.log(`- Files missing required frontmatter fields: ${missingFieldsByFile.length}`);
  console.log(`- Invalid image refs: ${invalidImageRefs.length}`);
  console.log(`- Missing image files: ${missingImageFiles.length}`);

  if (missingFieldsByFile.length > 0) {
    console.log("\nMissing required frontmatter fields:");
    for (const entry of missingFieldsByFile) {
      console.log(`- content/${entry.file}: ${entry.missingFields.join(", ")}`);
    }
  }

  if (invalidImageRefs.length > 0) {
    console.log("\nInvalid image refs:");
    for (const entry of invalidImageRefs) {
      console.log(`- content/${entry.file}: ${entry.imageRef} (${entry.reason})`);
    }
  }

  if (missingImageFiles.length > 0) {
    console.log("\nMissing image files:");
    for (const entry of missingImageFiles) {
      console.log(`- content/${entry.file}: ${entry.imageRef}`);
    }
  }
}

function main() {
  const results = runAudit();
  printAuditReport(results);

  const hasFailures =
    results.missingFieldsByFile.length > 0 ||
    results.invalidImageRefs.length > 0 ||
    results.missingImageFiles.length > 0;

  if (hasFailures) {
    process.exit(1);
  }
}

main();
