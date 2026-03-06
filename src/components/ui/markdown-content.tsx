import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert
      prose-headings:font-display prose-headings:text-foreground
      prose-p:text-foreground/85 prose-p:leading-relaxed
      prose-strong:text-foreground
      prose-li:text-foreground/85
      prose-table:border-collapse prose-table:w-full prose-table:text-xs
      prose-th:bg-muted prose-th:text-foreground prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:border prose-th:border-border prose-th:text-left
      prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-border prose-td:text-foreground/80
      prose-tr:even:bg-muted/30
      prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
      prose-pre:bg-muted prose-pre:border prose-pre:border-border
      ${className}`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
