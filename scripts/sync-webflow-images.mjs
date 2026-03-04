#!/usr/bin/env node

import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DOWNLOAD_DIR = path.join(PUBLIC_DIR, "images", "covers", "webflow");
const REPORT_PATH = path.join(ROOT_DIR, "docs", "WEBFLOW-IMAGE-SYNC-REPORT.md");

const WEBFLOW_API_BASE = (process.env.WEBFLOW_API_BASE || "https://api.webflow.com/v2").replace(/\/+$/, "");
const DEFAULT_TOKEN_PATH = path.join(os.homedir(), ".openclaw", "workspace", ".secrets", "webflow-token");

const IMAGE_KEYWORDS = ["image", "thumbnail", "thumb", "hero", "cover", "banner", "featured"];
const COVER_KEYWORDS = ["cover", "thumbnail", "thumb", "featured", "main", "image"];
const HERO_KEYWORDS = ["hero", "banner", "cover", "featured", "image"];
const ALT_KEYWORDS = ["alt", "image-alt", "image_alt", "hero-alt", "thumbnail-alt", "cover-alt"];
const TITLE_KEYS = ["name", "title", "post-title", "heading"];
const POSSIBLE_SLUG_KEYS = ["slug", "post-slug", "url-slug", "permalink", "url"];

const args = new Set(process.argv.slice(2));
const shouldDownload = args.has("--download");

function exitWithError(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function cleanText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase();
}

function normalizeSlug(raw) {
  const value = cleanText(raw);
  if (!value) return "";

  let slug = value;
  if (/^https?:\/\//i.test(slug)) {
    try {
      slug = new URL(slug).pathname;
    } catch {
      // Keep raw string fallback.
    }
  }

  slug = decodeURIComponent(slug)
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html?$/i, "")
    .split("/")
    .filter(Boolean)
    .pop() || "";

  return slug.toLowerCase();
}

function isLikelyImageUrl(value) {
  if (typeof value !== "string") return false;
  const text = value.trim();
  if (!/^https?:\/\//i.test(text)) return false;
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?|#|$)/i.test(text) || /images?|imgix|cloudfront|webflow/i.test(text);
}

function imageFieldWeight(key, type) {
  const normalized = normalizeKey(key);
  const keywords = type === "hero" ? HERO_KEYWORDS : COVER_KEYWORDS;

  let score = 0;
  for (const word of keywords) {
    if (normalized.includes(word)) {
      score += 10;
    }
  }

  if (normalized === "hero" || normalized === "hero-image") score += type === "hero" ? 20 : 0;
  if (normalized === "cover" || normalized === "cover-image") score += type === "cover" ? 20 : 0;
  if (normalized === "thumbnail") score += type === "cover" ? 12 : 4;
  if (normalized === "image") score += 8;

  return score;
}

function pickBestImage(candidates, type) {
  if (candidates.length === 0) return null;

  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: imageFieldWeight(candidate.key, type),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0] || null;
}

function getFieldData(item) {
  if (item && typeof item === "object") {
    if (item.fieldData && typeof item.fieldData === "object") return item.fieldData;
    if (item.field_data && typeof item.field_data === "object") return item.field_data;
  }
  return {};
}

function getSlugFromItem(item) {
  const fieldData = getFieldData(item);

  for (const key of POSSIBLE_SLUG_KEYS) {
    const slug = normalizeSlug(fieldData[key]);
    if (slug) return slug;
  }

  for (const key of POSSIBLE_SLUG_KEYS) {
    const slug = normalizeSlug(item?.[key]);
    if (slug) return slug;
  }

  return "";
}

function collectImageCandidates(item) {
  const fieldData = getFieldData(item);
  const candidates = [];

  for (const [rawKey, value] of Object.entries(fieldData)) {
    const key = normalizeKey(rawKey);
    const looksLikeImageKey = IMAGE_KEYWORDS.some((word) => key.includes(word));

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const url = cleanText(value.url || value.src || value.fileUrl || value.file_url || value.cdnUrl || value.cdn_url);
      if (url && /^https?:\/\//i.test(url) && (looksLikeImageKey || isLikelyImageUrl(url))) {
        candidates.push({ key, url, alt: cleanText(value.alt || value.description || value.title || value.caption) });
      }
    }

    if (typeof value === "string" && looksLikeImageKey && isLikelyImageUrl(value)) {
      candidates.push({ key, url: value.trim(), alt: "" });
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (!entry || typeof entry !== "object") continue;
        const url = cleanText(entry.url || entry.src || entry.fileUrl || entry.file_url || entry.cdnUrl || entry.cdn_url);
        if (!url || !/^https?:\/\//i.test(url)) continue;
        if (!looksLikeImageKey && !isLikelyImageUrl(url)) continue;
        candidates.push({ key, url, alt: cleanText(entry.alt || entry.description || entry.title || entry.caption) });
      }
    }
  }

  return candidates;
}

function extractAltText(item, coverCandidate, heroCandidate) {
  const fieldData = getFieldData(item);

  const candidateAlts = [
    coverCandidate?.alt,
    heroCandidate?.alt,
  ]
    .map(cleanText)
    .filter(Boolean);

  if (candidateAlts.length > 0) return candidateAlts[0];

  for (const [rawKey, value] of Object.entries(fieldData)) {
    const key = normalizeKey(rawKey);
    if (!ALT_KEYWORDS.some((word) => key.includes(word))) continue;
    const text = cleanText(value);
    if (text) return text;
  }

  for (const key of TITLE_KEYS) {
    const text = cleanText(fieldData[key]);
    if (text) return text;
  }

  return "";
}

function buildRecord(item) {
  const slug = getSlugFromItem(item);
  if (!slug) return null;

  const imageCandidates = collectImageCandidates(item);
  const coverCandidate = pickBestImage(imageCandidates, "cover");
  const heroCandidate = pickBestImage(imageCandidates, "hero") || coverCandidate;

  const coverImage = coverCandidate?.url || "";
  const heroImage = heroCandidate?.url || coverImage;
  const imageAlt = extractAltText(item, coverCandidate, heroCandidate);

  if (!coverImage && !heroImage) {
    return {
      slug,
      coverImage: "",
      heroImage: "",
      imageAlt,
      imageSignal: 0,
    };
  }

  let signal = 0;
  if (coverImage) signal += 1;
  if (heroImage) signal += 1;
  if (imageAlt) signal += 1;

  return {
    slug,
    coverImage,
    heroImage,
    imageAlt,
    imageSignal: signal,
  };
}

function pickPreferredRecord(current, next) {
  if (!current) return next;
  if (!next) return current;
  if ((next.imageSignal || 0) > (current.imageSignal || 0)) return next;
  return current;
}

async function readToken() {
  const envToken = cleanText(process.env.WEBFLOW_TOKEN);
  if (envToken) return envToken;

  if (!fs.existsSync(DEFAULT_TOKEN_PATH)) {
    return "";
  }

  const fileToken = cleanText(await fsp.readFile(DEFAULT_TOKEN_PATH, "utf8"));
  return fileToken;
}

function buildUrl(pathname, params = {}) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = new URL(`${WEBFLOW_API_BASE}${normalizedPath}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function webflowGet(token, pathname, params = {}) {
  const url = buildUrl(pathname, params);
  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Network request failed for ${url.toString()}: ${message}`);
  }

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message = typeof data?.message === "string" ? data.message : text.slice(0, 300);
    throw new Error(`Webflow API ${response.status} ${response.statusText} for ${url.pathname}: ${message}`);
  }

  return data;
}

function normalizeCollectionsResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.collections)) return payload.collections;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeSitesResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.sites)) return payload.sites;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeItemsResponse(payload) {
  if (Array.isArray(payload)) return { items: payload, pagination: null };
  if (Array.isArray(payload?.items)) return { items: payload.items, pagination: payload.pagination || null };
  if (Array.isArray(payload?.collectionItems)) return { items: payload.collectionItems, pagination: payload.pagination || null };
  return { items: [], pagination: payload?.pagination || null };
}

function siteLooksLikeTangle(site) {
  const haystack = JSON.stringify(site).toLowerCase();
  return haystack.includes("tangle") || haystack.includes("tangle.tools");
}

function scoreCollection(collection) {
  const slug = normalizeKey(collection?.slug);
  const name = normalizeKey(collection?.displayName || collection?.name);
  const haystack = `${slug} ${name}`;

  let score = 0;
  if (slug === "blog" || name === "blog") score += 100;
  if (slug === "posts" || name === "posts") score += 90;
  if (haystack.includes("blog")) score += 30;
  if (haystack.includes("post")) score += 20;
  if (haystack.includes("article")) score += 15;
  if (haystack.includes("news")) score += 10;
  return score;
}

async function listCollections(token, siteId) {
  const payload = await webflowGet(token, `/sites/${siteId}/collections`);
  return normalizeCollectionsResponse(payload);
}

async function discoverCollection(token) {
  const explicitCollectionId = cleanText(process.env.WEBFLOW_COLLECTION_ID);
  if (explicitCollectionId) {
    return { id: explicitCollectionId, discoveredVia: "WEBFLOW_COLLECTION_ID" };
  }

  const explicitSiteId = cleanText(process.env.WEBFLOW_SITE_ID);
  if (explicitSiteId) {
    const collections = await listCollections(token, explicitSiteId);
    const sorted = collections
      .map((collection) => ({ collection, score: scoreCollection(collection) }))
      .sort((a, b) => b.score - a.score);

    if (sorted.length === 0 || sorted[0].score <= 0) {
      throw new Error(`No usable collection found in site ${explicitSiteId}`);
    }

    return {
      id: sorted[0].collection.id,
      siteId: explicitSiteId,
      discoveredVia: "WEBFLOW_SITE_ID",
      collectionName: sorted[0].collection.displayName || sorted[0].collection.name || sorted[0].collection.slug,
    };
  }

  const sitesPayload = await webflowGet(token, "/sites");
  const allSites = normalizeSitesResponse(sitesPayload);
  const candidateSites = allSites.filter(siteLooksLikeTangle);
  const sitesToTry = candidateSites.length > 0 ? candidateSites : allSites;

  let best = null;

  for (const site of sitesToTry) {
    const siteId = cleanText(site?.id);
    if (!siteId) continue;

    let collections = [];
    try {
      collections = await listCollections(token, siteId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`WARN: failed to list collections for site ${siteId}: ${message}`);
      continue;
    }

    for (const collection of collections) {
      const score = scoreCollection(collection);
      if (!best || score > best.score) {
        best = { siteId, collection, score };
      }
    }
  }

  if (!best || best.score <= 0) {
    throw new Error("Could not discover a blog/posts collection. Set WEBFLOW_COLLECTION_ID.");
  }

  return {
    id: best.collection.id,
    siteId: best.siteId,
    discoveredVia: "site-scan",
    collectionName: best.collection.displayName || best.collection.name || best.collection.slug,
  };
}

async function fetchCollectionItems(token, collectionId) {
  const items = [];
  const pageSize = 100;
  let offset = 0;

  while (true) {
    const payload = await webflowGet(token, `/collections/${collectionId}/items`, {
      limit: pageSize,
      offset,
    });

    const { items: pageItems, pagination } = normalizeItemsResponse(payload);
    items.push(...pageItems);

    const fetched = pageItems.length;
    const total = pagination?.total;

    if (fetched === 0) break;

    offset += fetched;

    if (typeof total === "number" && offset >= total) {
      break;
    }

    if (fetched < pageSize) {
      break;
    }
  }

  return items;
}

function getLocalPostMap() {
  const entries = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const map = new Map();

  for (const filename of entries) {
    const slug = filename.replace(/\.mdx$/, "").toLowerCase();
    map.set(slug, path.join(CONTENT_DIR, filename));
  }

  return map;
}

function sanitizeFileSegment(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "") || "image";
}

function getExtFromContentType(contentType) {
  const normalized = cleanText(contentType).toLowerCase().split(";")[0];
  switch (normalized) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    case "image/bmp":
      return ".bmp";
    default:
      return "";
  }
}

function getExtFromUrl(rawUrl) {
  try {
    const pathname = new URL(rawUrl).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (/^\.(avif|bmp|gif|jpe?g|png|svg|webp)$/.test(ext)) {
      return ext === ".jpeg" ? ".jpg" : ext;
    }
  } catch {
    // Fall through to empty.
  }

  return "";
}

async function downloadImage(url, slug, label, cache) {
  if (!url) return "";
  const cacheKey = `${slug}:${label}:${url}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  await fsp.mkdir(DOWNLOAD_DIR, { recursive: true });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image ${url}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const extFromType = getExtFromContentType(contentType);
  const extFromUrl = getExtFromUrl(url);
  const ext = extFromType || extFromUrl || ".jpg";

  const suffix = label === "cover" || label === "hero" ? `-${label}` : "";
  const baseName = sanitizeFileSegment(slug);

  const sameUrlPath = cache.get(`${slug}:url:${url}`);
  if (sameUrlPath) {
    cache.set(cacheKey, sameUrlPath);
    return sameUrlPath;
  }

  let fileName = `${baseName}${suffix}${ext}`;
  if (!suffix && cache.has(`${slug}:default-name`)) {
    fileName = `${baseName}-${label}${ext}`;
  }

  cache.set(`${slug}:default-name`, fileName);

  const diskPath = path.join(DOWNLOAD_DIR, fileName);
  const bytes = Buffer.from(await response.arrayBuffer());
  await fsp.writeFile(diskPath, bytes);

  const publicPath = `/images/covers/webflow/${fileName}`;
  cache.set(cacheKey, publicPath);
  cache.set(`${slug}:url:${url}`, publicPath);
  return publicPath;
}

function ensureStringValue(value) {
  if (typeof value === "string") return value;
  return "";
}

function updateFrontmatter(source, updates) {
  const parsed = matter(source);
  const data = { ...parsed.data };
  let changed = false;

  for (const [key, value] of Object.entries(updates)) {
    if (!value) continue;
    const nextValue = ensureStringValue(value).trim();
    if (!nextValue) continue;

    const prevValue = ensureStringValue(data[key]).trim();
    if (prevValue !== nextValue) {
      data[key] = nextValue;
      changed = true;
    }
  }

  if (!changed) {
    return { changed: false, output: source };
  }

  const output = matter.stringify(parsed.content, data, { lineWidth: 0 });
  return { changed: true, output };
}

function buildReport({
  totalCmsItems,
  matchedMdxPosts,
  updatedPosts,
  unmatchedSlugs,
  collectionMeta,
  downloadMode,
  errorMessage,
}) {
  const lines = [
    "# Webflow Image Sync Report",
    "",
    `- Download mode: ${downloadMode ? "enabled (--download)" : "disabled"}`,
    `- Collection ID: ${collectionMeta.id || "n/a"}`,
    `- Collection source: ${collectionMeta.discoveredVia || "n/a"}`,
  ];

  if (collectionMeta.collectionName) {
    lines.push(`- Collection name: ${collectionMeta.collectionName}`);
  }

  if (collectionMeta.siteId) {
    lines.push(`- Site ID: ${collectionMeta.siteId}`);
  }

  lines.push(
    "",
    "## Summary",
    "",
    `- total cms items: ${totalCmsItems}`,
    `- matched mdx posts: ${matchedMdxPosts}`,
    `- updated posts: ${updatedPosts}`,
    `- unmatched slugs: ${unmatchedSlugs.length}`,
    ""
  );

  if (errorMessage) {
    lines.push("## Error", "", `- ${errorMessage}`, "");
  }

  if (unmatchedSlugs.length > 0) {
    lines.push("## Unmatched Slugs", "");
    for (const slug of unmatchedSlugs) {
      lines.push(`- ${slug}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}`;
}

async function writeReport(payload) {
  const report = buildReport(payload);
  await fsp.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fsp.writeFile(REPORT_PATH, report, "utf8");
}

async function main() {
  const token = await readToken();
  if (!token) {
    exitWithError(
      "Missing Webflow token. Set WEBFLOW_TOKEN or create ~/.openclaw/workspace/.secrets/webflow-token"
    );
  }

  let collectionMeta = { id: "", discoveredVia: "" };
  let items = [];
  let matchedMdxPosts = 0;
  let updatedPosts = 0;
  let unmatchedSlugs = [];
  let errorMessage = "";

  try {
    collectionMeta = await discoverCollection(token);
    items = await fetchCollectionItems(token, collectionMeta.id);

    const localPosts = getLocalPostMap();
    const recordsBySlug = new Map();

    for (const item of items) {
      const record = buildRecord(item);
      if (!record) continue;

      const current = recordsBySlug.get(record.slug);
      recordsBySlug.set(record.slug, pickPreferredRecord(current, record));
    }

    const unmatched = new Set();
    const downloadCache = new Map();

    for (const [slug, record] of recordsBySlug.entries()) {
      const postPath = localPosts.get(slug);
      if (!postPath) {
        unmatched.add(slug);
        continue;
      }

      matchedMdxPosts += 1;

      const source = await fsp.readFile(postPath, "utf8");

      let coverImage = record.coverImage;
      let heroImage = record.heroImage || record.coverImage;

      if (shouldDownload) {
        const sameRemoteImage = coverImage && heroImage && coverImage === heroImage;

        if (sameRemoteImage) {
          const downloaded = await downloadImage(coverImage, slug, "primary", downloadCache);
          coverImage = downloaded;
          heroImage = downloaded;
        } else {
          if (coverImage) {
            coverImage = await downloadImage(coverImage, slug, "cover", downloadCache);
          }
          if (heroImage) {
            heroImage = await downloadImage(heroImage, slug, "hero", downloadCache);
          }
        }
      }

      const { changed, output } = updateFrontmatter(source, {
        coverImage,
        heroImage,
        imageAlt: record.imageAlt,
      });

      if (changed) {
        await fsp.writeFile(postPath, output, "utf8");
        updatedPosts += 1;
      }
    }

    unmatchedSlugs = [...unmatched].sort();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  await writeReport({
    totalCmsItems: items.length,
    matchedMdxPosts,
    updatedPosts,
    unmatchedSlugs,
    collectionMeta,
    downloadMode: shouldDownload,
    errorMessage,
  });

  console.log(`Webflow image sync complete`);
  console.log(`- total cms items: ${items.length}`);
  console.log(`- matched mdx posts: ${matchedMdxPosts}`);
  console.log(`- updated posts: ${updatedPosts}`);
  console.log(`- unmatched slugs: ${unmatchedSlugs.length}`);
  console.log(`- report: ${path.relative(ROOT_DIR, REPORT_PATH)}`);

  if (errorMessage) {
    throw new Error(errorMessage);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  exitWithError(message);
});
