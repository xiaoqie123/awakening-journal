import Link from 'next/link';
import { getAllJournalMetas } from '@/lib/data-utils';
import LibraryClient from '@/components/LibraryClient';

export default function LibraryPage() {
  const metas = getAllJournalMetas();
  return <LibraryClient metas={metas} />;
}
