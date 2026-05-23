import Link from 'next/link';
import { getAllJournalMetas } from '@/lib/data-utils';
import LibraryClient from '@/components/LibraryClient';

export default async function LibraryPage() {
  const metas = await getAllJournalMetas();
  return <LibraryClient metas={metas} />;
}
