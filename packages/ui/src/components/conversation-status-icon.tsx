import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface ConversationStatusIconProps {
  status: "unresolved" | "resolved" | "escalated";
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-[#3fb62f]",
  },
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-destructive",
  },
  escalated: {
    icon: ArrowUpIcon,
    bgColor: "bg-yellow-500",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full p-1.5 shrink-0",
        config.bgColor,
      )}
    >
      <Icon className="size-3 stroke-3 text-white" />
    </div>
  );
};
