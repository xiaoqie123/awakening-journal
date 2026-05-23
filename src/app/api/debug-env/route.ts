import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    vercelEnv: process.env.VERCEL || null,
    vercelEnv2: process.env.VERCEL_ENV || null,
    nodeEnv: process.env.NODE_ENV,
  });
}
