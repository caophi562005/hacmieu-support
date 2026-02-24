"use client";

import { errorMessageAtom } from "@/modules/widget/atoms/widget-atom";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold ">
          <p className="text-3xl">Lỗi hệ thống! 🔌</p>
          <p className="text-lg">Không thể kết nối đến tổ chức</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon />
        <p className="text-sm">{errorMessage || "Đã xảy ra lỗi hệ thống"}</p>
      </div>
    </>
  );
};
