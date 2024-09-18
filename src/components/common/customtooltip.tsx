import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

interface CustomTooltipProps   {
  trigger: React.ReactNode | React.ReactNode[];
  content?: React.ReactNode | React.ReactNode[] | undefined;
  className?: string;
  onClick?: () => void;
}

export default function CustomTooltip(props : CustomTooltipProps) {
  return(
    <Tooltip delayDuration={100}>
      <TooltipTrigger onClick={props.onClick} className={cn(
        props.className,
        "flex items-center gap-2"
      )}>
        {props.trigger}
      </TooltipTrigger>
      {
        props.content ? <TooltipContent>{props.content}</TooltipContent> : null
      }
    </Tooltip>
  )
}