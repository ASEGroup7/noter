import { cn } from "@/lib/utils"

export default function PageContainer(props : { children?: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLElement>) {
  return(
    <section 
      className={cn(
        props.className,
        "flex-1 w-[min(680px,90%)] m-auto",
      )}
      {...props}
    >
      { props.children }
    </section>
  )
}
