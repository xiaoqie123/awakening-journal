import fs from 'fs';
import path from 'path';

// VERCEL_URL is set by the platform to the deployment URL — only available in real Vercel environments
const isVercel = !!process.env.VERCEL_URL;

// Lazy-load @vercel/blob to avoid SDK initialization during local builds
type BlobAPI = {
  put: typeof import('@vercel/blob').put;
  list: typeof import('@vercel/blob').list;
  del: typeof import('@vercel/blob').del;
};

let _blob: BlobAPI | null = null;
async function getBlob(): Promise<BlobAPI> {
  if (!_blob) {
    _blob = await import('@vercel/blob');
  }
  return _blob;
}

// ===== Low-level blob operations =====

function getContentType(pathname: string): string {
  if (pathname.endsWith('.json')) return 'application/json; charset=utf-8';
  if (pathname.endsWith('.md')) return 'text/markdown; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

async function blobGet(pathname: string): Promise<string | null> {
  const { list } = await getBlob();
  const result = await list({ prefix: pathname, limit: 1 });
  const match = result.blobs.find(b => b.pathname === pathname);
  if (!match) return null;
  const res = await fetch(match.url);
  if (res.ok) return res.text();
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const authRes = await fetch(match.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (authRes.ok) return authRes.text();
  }
  return null;
}

async function blobPut(pathname: string, content: string): Promise<void> {
  const { put, list, del } = await getBlob();
  const existing = await list({ prefix: pathname, limit: 1 });
  const match = existing.blobs.find(b => b.pathname === pathname);
  if (match) await del(match.url);
  await put(pathname, content, {
    access: 'private',
    addRandomSuffix: false,
    contentType: getContentType(pathname),
  });
}

async function blobExists(pathname: string): Promise<boolean> {
  const { list } = await getBlob();
  const result = await list({ prefix: pathname, limit: 1 });
  return result.blobs.some(b => b.pathname === pathname);
}

async function blobList(prefix: string): Promise<string[]> {
  const { list } = await getBlob();
  const result = await list({ prefix, limit: 500 });
  return result.blobs.map(b => b.pathname);
}

// ===== Public API (unified) =====

/** Read file content as UTF-8 string */
export async function readFile(relativePath: string): Promise<string> {
  if (isVercel) {
    const content = await blobGet(relativePath);
    if (content !== null) return content;
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
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN not set — connect a Blob Store in Vercel dashboard');
    }
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
    return files.filter(f => f !== relativeDir);
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
