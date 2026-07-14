export function ScrollIndicator({ label }: { label: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-3 self-center font-mono text-[10px] uppercase tracking-widest text-text-muted">
      <span className="relative h-16 w-px overflow-hidden bg-border">
        <span className="scroll-line absolute inset-x-0 top-0 h-1/2 bg-ember" />
      </span>
      <span>{label}</span>
    </div>
  );
}
