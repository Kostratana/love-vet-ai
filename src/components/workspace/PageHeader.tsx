import type { ReactNode } from "react";
import { Eyebrow } from "@/components/kit/primitives";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-4 pb-6 lg:pt-0">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-1.5 font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-silver bg-silver-white/70">
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-4 py-3 text-left text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-graphite"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-silver/70 last:border-0 hover:bg-card/70">
                {r.map((cell, j) => (
                  <td key={j} className="px-4 py-3 align-middle text-navy">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-navy">{d.label}</span>
            <span className="font-mono text-xs text-graphite">{d.value}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-silver">
            <div
              className="h-full rounded-full bg-[image:var(--gradient-primary)]"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
