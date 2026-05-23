import { put, list, del } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const isVercel = !!process.env.BLOB_READ_WRITE_TOKEN;

// ===== Low-level read/write =====

async function blobGet(pathname: string): Promise<string | null> {
  const result = await list({ prefix: pathname, limit: 1 });
  const match = result.blobs.find(b => b.pathname === pathname);
  if (!match) return null;
  const res = await fetch(match.url);
  if (!res.ok) return null;
  return res.text();
}

async function blobPut(pathname: string, content: string): Promise<void> {
  // Delete old blob with same pathname before writing (overwrite)
  const existing = await list({ prefix: pathname, limit: 1 });
  const match = existing.blobs.find(b => b.pathname === pathname);
  if (match) await del(match.url);
  await put(pathname, content, { access: 'public', addRandomSuffix: false });
}

async function blobExists(pathname: string): Promise<boolean> {
  const result = await list({ prefix: pathname, limit: 1 });
  return result.blobs.some(b => b.pathname === pathname);
}

async function blobList(prefix: string): Promise<string[]> {
  const result = await list({ prefix, limit: 500 });
  return result.blobs.map(b => b.pathname);
}

// ===== Public API (unified) =====

/** Read file content as UTF-8 string */
export async function readFile(relativePath: string): Promise<string> {
  if (isVercel) {
    const content = await blobGet(relativePath);
    if (content !== null) return content;
    // Fallback: try local bundled file
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf-8');
    throw new Error(`File not found: ${relativePath}`);
  }
  const fullPath = path.join(process.cwd(), relativePath);
  return fs.readFileSync(fullPath, 'utf-8');
}

/** Write file content */
export async function writeFile(relativePath: string, content: string): Promise<void> {
  if (isVercel) {
    await blobPut(relativePath, content);
    return;
  }
  const fullPath = path.join(process.cwd(), relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}

/** Check if file exists */
export async function fileExists(relativePath: string): Promise<boolean> {
  if (isVercel) return blobExists(relativePath);
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

/** List files in a directory */
export async function listDir(relativeDir: string): Promise<string[]> {
  if (isVercel) {
    const files = await blobList(relativeDir);
    return files.filter(f => f !== relativeDir); // exclude dir entry itself
  }
  const fullDir = path.join(process.cwd(), relativeDir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir).map(f => path.join(relativeDir, f));
}

/** Read a parsed JSON file */
export async function readJson<T>(relativePath: string): Promise<T> {
  const raw = await readFile(relativePath);
  return JSON.parse(raw);
}

/** Write a JSON file */
export async function writeJson<T>(relativePath: string, data: T): Promise<void> {
  await writeFile(relativePath, JSON.stringify(data, null, 2));
}
