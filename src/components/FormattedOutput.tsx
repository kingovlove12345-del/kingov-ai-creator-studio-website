import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface FormattedOutputProps {
  content: string;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  // Split on **bold** and `inline code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="font-mono text-[13px] bg-slate-100 text-[#0B192C] px-1.5 py-0.5 rounded"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored here; main Copy button covers fallback
    }
  };

  return (
    <div className="my-4 rounded-xl bg-[#0B192C] text-slate-100 overflow-hidden border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-[#10233E] border-b border-slate-800 text-xs text-slate-300">
        <span className="font-mono">Prompt / Script Block</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 min-h-[32px] px-2.5 py-1 rounded text-xs font-medium text-[#F5C451] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Block</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

export function FormattedOutput({ content }: FormattedOutputProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Handle fenced code blocks
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      elements.push(<CodeBlock key={`code-${i}`} code={codeLines.join('\n')} />);
      continue;
    }

    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-6 border-t border-slate-200" />
      );
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4
          key={`h3-${i}`}
          className="font-display text-base sm:text-lg font-bold text-[#0B192C] mt-6 mb-2 tracking-tight"
        >
          {renderInlineFormatting(trimmed.slice(4))}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3
          key={`h2-${i}`}
          className="font-display text-lg sm:text-xl font-bold text-[#0B192C] mt-7 mb-2.5 pb-1.5 border-b border-slate-200 tracking-tight"
        >
          {renderInlineFormatting(trimmed.slice(3))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2
          key={`h1-${i}`}
          className="font-display text-xl sm:text-2xl font-bold text-[#0B192C] mt-6 mb-3 tracking-tight"
        >
          {renderInlineFormatting(trimmed.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // Screenplay sluglines (INT. / EXT.)
    if (/^(INT\.|EXT\.|INT\/EXT\.)/i.test(trimmed)) {
      elements.push(
        <p
          key={`slug-${i}`}
          className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#0B192C] bg-slate-100 px-3 py-1.5 rounded-md mt-5 mb-2"
        >
          {trimmed}
        </p>
      );
      i++;
      continue;
    }

    // Bullet lists
    if (/^[-*•]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 space-y-2 pl-5 list-disc marker:text-[#B48618]">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-[15px] leading-relaxed text-slate-700 pl-1">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered or Option lists (1. / A. / B.)
    if (/^(\d+[.)]|[A-D][.)])\s+/.test(trimmed)) {
      const orderedItems: { prefix: string; body: string }[] = [];
      while (
        i < lines.length &&
        /^(\d+[.)]|[A-D][.)])\s+/.test(lines[i].trim())
      ) {
        const match = lines[i].trim().match(/^(\d+[.)]|[A-D][.)])\s+(.*)$/);
        if (match) {
          orderedItems.push({ prefix: match[1], body: match[2] });
        }
        i++;
      }
      elements.push(
        <div key={`ol-${i}`} className="my-3 space-y-2">
          {orderedItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-700">
              <span className="font-mono text-xs font-semibold text-[#0B192C] mt-1 shrink-0 tabular-nums min-w-[24px]">
                {item.prefix}
              </span>
              <span className="flex-1">{renderInlineFormatting(item.body)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-2.5 text-[15px] sm:text-base leading-relaxed text-slate-700">
        {renderInlineFormatting(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="max-w-none">{elements}</div>;
}
