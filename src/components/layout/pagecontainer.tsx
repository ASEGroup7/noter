import { cn } from "@/lib/utils"

export default function PageContainer({ children, className } : { children?: React.ReactNode, className?: string }) {
  return(
    <section className={cn(
      className,
      "flex-1 w-[min(680px,90%)] m-auto"
    )}>
      { children }
    </section>
  )
}