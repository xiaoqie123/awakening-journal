'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
}

export default function MarkdownPreview({ content }: Props) {
  if (!content.trim()) {
    return (
      <p className="text-sm text-ink-light dark:text-[#6B6B70] italic text-center py-8">
        预览将会显示在这里...
      </p>
    );
  }

  return (
    <div className="prose-reading text-body text-ink dark:text-[#E8E6E3] leading-[1.85] font-body whitespace-pre-wrap">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
