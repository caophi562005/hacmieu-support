"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ArrowLeft, CreditCard, QrCode } from "lucide-react";
import { useState } from "react";
import { QrScreen } from "../screens/qr-screen";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "subscription_creation" | "subscription_renewal";
}

type Step = "select" | "qr";

export const PaymentDialog = ({
  onOpenChange,
  open,
  type = "subscription_creation",
}: Props) => {
  const [step, setStep] = useState<Step>("select");

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-w-md bg-white!">
        <DialogHeader>
          <DialogTitle>
            {step === "select"
              ? "Chọn phương thức thanh toán"
              : "Thanh toán QR"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Chọn phương thức thanh toán phù hợp với bạn"
              : "Quét mã QR để thực hiện thanh toán"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-muted p-6 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-not-allowed opacity-60"
              onClick={() => {}}
              type="button"
            >
              <CreditCard className="size-10 text-muted-foreground" />
              <span className="font-medium">Thẻ tín dụng</span>
            </button>

            <button
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-muted p-6 hover:border-primary hover:bg-muted/50 transition-all"
              onClick={() => setStep("qr")}
              type="button"
            >
              <QrCode className="size-10" />
              <span className="font-medium">Mã QR</span>
            </button>
          </div>
        ) : (
          <QrScreen type={type} />
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === "qr" && (
            <Button
              variant="ghost"
              onClick={() => setStep("select")}
              className="mr-auto"
            >
              <ArrowLeft className="mr-2 size-4" />
              Quay lại
            </Button>
          )}
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
