// A measurement rule: evenly spaced ticks with every fifth one taller — the visual
// language of a vernier / gauge face, and the page's signature element.
export const TickScale = ({ count = 64, className = '' }: { count?: number; className?: string }) => (
  <div className={`flex items-end gap-[3px] overflow-hidden ${className}`} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="w-px shrink-0 bg-line" style={{ height: i % 5 === 0 ? 12 : 6 }} />
    ))}
  </div>
);
