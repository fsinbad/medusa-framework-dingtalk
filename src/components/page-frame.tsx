import type { ReactNode } from "react";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  aside,
  children,
}: PageFrameProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:px-10">
      <header className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300/78">
            {description}
          </p>
        </div>
        {aside ? <div className="lg:text-right">{aside}</div> : null}
      </header>
      {children}
    </div>
  );
}
