import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TERMS } from '@/data/dictionary-terms';
import { TermTooltip } from '@/components/ui/term-tooltip';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Convert ASCII box-drawing tables (┌─┬─┐ style) to standard markdown tables.
 * Also handles plain-text pipe tables that might be missing header separators.
 */
function preprocessContent(raw: string): string {
  const lines = raw.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect ASCII box table start (┌ or ╔)
    if (/^[│┌├└╔╠╚┃]/.test(line.trim()) || /[┐┤┘╗╣╝]$/.test(line.trim())) {
      // Collect all consecutive box-drawing lines
      const tableLines: string[] = [];
      while (i < lines.length && /[│┌├└┐┤┘─┬┴╔╠╚╗╣╝═╦╩╬┃]/.test(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      // Convert box table to markdown table
      const mdTable = boxTableToMarkdown(tableLines);
      if (mdTable) {
        result.push(mdTable);
      } else {
        // Fallback: push original lines
        tableLines.forEach(l => result.push(l));
      }
      continue;
    }

    result.push(line);
    i++;
  }

  return result.join('\n');
}

function boxTableToMarkdown(lines: string[]): string | null {
  // Extract data rows (lines with │ or ┃ that contain cell data)
  const dataRows: string[][] = [];

  for (const line of lines) {
    // Skip border-only lines (┌─┬─┐, ├─┼─┤, └─┴─┘, etc.)
    if (/^[┌├└╔╠╚][─═┬┼┴╦╩╬─]*[┐┤┘╗╣╝]?\s*$/.test(line.trim())) {
      continue;
    }

    // Data row: split by │ or ┃
    if (line.includes('│') || line.includes('┃')) {
      const cells = line
        .split(/[│┃]/)
        .map(c => c.trim())
        .filter((c, idx, arr) => idx > 0 && idx < arr.length); // Remove leading/trailing empty from split
      
      // Filter out rows that are all empty
      if (cells.some(c => c.length > 0)) {
        dataRows.push(cells);
      }
    }
  }

  if (dataRows.length < 1) return null;

  // First row is the header
  const header = dataRows[0];
  const colCount = header.length;
  const separator = header.map(() => '---');
  
  const mdLines = [
    '| ' + header.join(' | ') + ' |',
    '| ' + separator.join(' | ') + ' |',
  ];

  for (let r = 1; r < dataRows.length; r++) {
    // Pad row to match column count
    const row = dataRows[r];
    while (row.length < colCount) row.push('');
    mdLines.push('| ' + row.slice(0, colCount).join(' | ') + ' |');
  }

  return mdLines.join('\n');
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const processed = preprocessContent(content);

  return (
    <div className={`markdown-content text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-foreground border border-border text-xs">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border border-border text-foreground/80 text-xs">
              {children}
            </td>
          ),
          tr: ({ children, ...props }) => (
            <tr className="even:bg-muted/30" {...props}>{children}</tr>
          ),
          h1: ({ children }) => (
            <h1 className="text-lg font-display font-bold text-foreground mt-4 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-display font-semibold text-foreground mt-4 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-display font-semibold text-foreground mt-3 mb-1">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-foreground/85 leading-relaxed mb-2">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2 text-foreground/85 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2 text-foreground/85 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/85">{children}</li>
          ),
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            return isInline ? (
              <code className="text-primary bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
            ) : (
              <code className={codeClassName}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted border border-border rounded-md p-3 overflow-x-auto text-xs my-2">{children}</pre>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
