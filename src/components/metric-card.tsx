type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 shadow-[0_16px_70px_rgba(0,0,0,0.2)] backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-amber-100/55">{label}</p>
      <p className="mt-4 font-serif text-4xl text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300/75">{detail}</p>
    </article>
  );
}
