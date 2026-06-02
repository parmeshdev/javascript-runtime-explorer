import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useRef } from "react";

type Props = {
  code: string;
  onChange: (v: string) => void;
  activeLine?: number;
};

export function CodeEditor({ code, onChange, activeLine }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    // Sync scroll
    const ta = taRef.current;
    const pre = preRef.current;
    if (!ta || !pre) return;
    const onScroll = () => {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener("scroll", onScroll);
    return () => ta.removeEventListener("scroll", onScroll);
  }, []);

  const lineCount = code.split("\n").length;

  return (
    <div className="relative flex h-full overflow-hidden rounded-xl border border-border bg-card font-mono text-[13px] leading-[1.55] pointer-events-none select-none">
      {/* gutter */}
      <div className="select-none border-r border-border bg-background/40 px-3 py-4 text-right text-muted-foreground">
        {Array.from({ length: lineCount }).map((_, i) => {
          const ln = i + 1;
          const active = ln === activeLine;
          return (
            <div
              key={ln}
              className={`tabular-nums ${active ? "text-[color:var(--runtime-js)] font-semibold" : ""}`}
            >
              {ln}
            </div>
          );
        })}
      </div>

      {/* highlighted overlay + textarea */}
      <div className="relative flex-1">
        {/* active-line highlight band */}
        {activeLine && (
          <div
            className="pointer-events-none absolute inset-x-0 line-active"
            style={{
              top: `calc(1rem + ${(activeLine - 1) * 1.55}em)`,
              height: "1.55em",
            }}
          />
        )}

        <Highlight code={code} language="jsx" theme={themes.vsDark}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre
              ref={preRef}
              className="pointer-events-none absolute inset-0 m-0 overflow-auto bg-transparent p-4 font-mono"
              style={{ background: "transparent" }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-4 font-mono text-transparent caret-white outline-none"
          style={{ caretColor: "white" }}
        />
      </div>
    </div>
  );
}
