import Link from 'next/link';
import { getAllJournalMetas } from '@/lib/data-utils';
import { verifySession } from '@/lib/auth/session';
import LibraryClient from '@/components/LibraryClient';

export default async function LibraryPage() {
  const { userId } = await verifySession();
  const metas = await getAllJournalMetas(userId);
  return <LibraryClient metas={metas} />;
}
