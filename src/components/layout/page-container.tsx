import { cn } from "@/lib/utils"

export default function PageContainer({ children, className }: { children?: React.ReactNode, className?: string }) {
  return(
    <section className={cn(
      className,
      "flex-1 max-w-screen-md min-w-[680px,90%] w-full mx-auto" 
    )}>
      { children }
    </section>
  )
}
