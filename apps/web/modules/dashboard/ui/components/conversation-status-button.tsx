import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface Props {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: Props) => {
  if (status === "resolved") {
    return (
      <Hint text="Đánh dấu là Chưa xử lý">
        <Button
          disabled={disabled}
          variant={"tertiary"}
          size={"sm"}
          onClick={onClick}
        >
          <CheckIcon />
          Đã xử lý
        </Button>
      </Hint>
    );
  }

  if (status === "escalated") {
    return (
      <Hint text="Đánh dấu là Đã xử lý">
        <Button
          disabled={disabled}
          variant={"warning"}
          size={"sm"}
          onClick={onClick}
        >
          <ArrowUpIcon />
          Chuyển cấp trên
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="Đánh dấu là Chuyển cấp trên">
      <Button
        disabled={disabled}
        variant={"destructive"}
        size={"sm"}
        onClick={onClick}
      >
        <ArrowRightIcon />
        Chưa xử lý
      </Button>
    </Hint>
  );
};
