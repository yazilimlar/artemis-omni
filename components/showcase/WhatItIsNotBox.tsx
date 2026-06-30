type WhatItIsNotBoxProps = {
  title?: string;
  items: string[];
};

export function WhatItIsNotBox({ title = "What it is not", items }: WhatItIsNotBoxProps) {
  return (
    <div className="rounded-2xl border border-rose-300/25 bg-rose-400/5 p-6">
      <p className="font-mono text-[0.66rem] uppercase tracking-wider text-rose-200">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-200" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
