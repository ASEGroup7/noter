export default function KBDIcon({ children } : { children: React.ReactNode }) {
  return <kbd className="rounded border bg-muted px-1.5 text-[10px] shadow-sm">
    <span>{children}</span>
  </kbd>
}