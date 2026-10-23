"use client";

import { useMemo, useRef, type ReactNode } from "react";
import Prism from "prismjs";

function renderTokens(tokens: Array<string | Prism.Token>): ReactNode {
  return tokens.map((token, index) => typeof token === "string" ? token : (
    <span key={index} className={`token ${token.type}`}>
      {typeof token.content === "string" ? token.content : renderTokens(Array.isArray(token.content) ? token.content : [token.content])}
    </span>
  ));
}

export function CssEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const preview = useRef<HTMLPreElement>(null);
  const highlighted = useMemo(() => renderTokens(Prism.tokenize(value, Prism.languages.css)), [value]);

  return (
    <div className="css-editor relative mt-3 overflow-hidden rounded border border-[#d7dfd5] bg-[#f6f8f5] focus-within:outline-2 focus-within:outline-green-700">
      <pre ref={preview} aria-hidden="true" className="css-editor-text pointer-events-none absolute inset-0 overflow-hidden text-slate-900">
        <code>{highlighted}{"\n"}</code>
      </pre>
      <textarea
        id="map-css"
        aria-describedby="map-css-help"
        value={value}
        onChange={event => onChange(event.target.value)}
        onScroll={event => {
          if (!preview.current) return;
          preview.current.scrollTop = event.currentTarget.scrollTop;
          preview.current.scrollLeft = event.currentTarget.scrollLeft;
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        className="css-editor-text relative block h-32 min-h-24 w-full resize-y overflow-auto bg-transparent text-transparent caret-slate-900 outline-none lg:h-44"
      />
    </div>
  );
}
