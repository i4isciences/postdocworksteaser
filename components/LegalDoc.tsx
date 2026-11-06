import { Fragment } from "react";

type Run = [string, boolean, boolean];
type Block = { t: "h1" | "h2" | "h3" | "p"; runs: Run[] } | { t: "ul"; items: Run[][] };

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map(([text, bold, italic], i) => {
        const parts = text.split("\n");
        const inner = parts.map((part, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {part}
          </Fragment>
        ));
        const el = bold ? <strong>{inner}</strong> : inner;
        return <Fragment key={i}>{italic ? <em>{el}</em> : el}</Fragment>;
      })}
    </>
  );
}

// Renders a legal document exactly as supplied (lib/legal/*.json is generated from the approved Word files).
export function LegalDoc({ blocks }: { blocks: Block[] }) {
  const [title, ...rest] = blocks;
  return (
    <div className="teaser-legal-body">
      {title.t === "h1" && (
        <h1>
          <Runs runs={title.runs} />
        </h1>
      )}
      {rest.map((b, i) => {
        if (b.t === "h2")
          return (
            <h2 key={i} className="legal-h2">
              <Runs runs={b.runs} />
            </h2>
          );
        if (b.t === "h3")
          return (
            <h3 key={i} className="legal-h3">
              <Runs runs={b.runs} />
            </h3>
          );
        if (b.t === "ul")
          return (
            <ul key={i} className="legal-list">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Runs runs={it} />
                </li>
              ))}
            </ul>
          );
        if (b.t === "p")
          return (
            <p key={i} className={i === 0 ? "teaser-legal-updated" : "legal-p"}>
              <Runs runs={b.runs} />
            </p>
          );
        return null;
      })}
    </div>
  );
}
