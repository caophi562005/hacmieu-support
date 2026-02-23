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
}

type Step = "select" | "qr";

export const PaymentDialog = ({ onOpenChange, open }: Props) => {
  const [step, setStep] = useState<Step>("select");

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setTimeout(() => setStep("select"), 300); // Reset step after closing animation
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-w-md bg-white!">
        <DialogHeader>
          <DialogTitle>
            {step === "select" ? "Choose Payment Method" : "QR Payment"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Select your preferred payment method"
              : "Scan the QR code to make a payment"}
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
              <span className="font-medium">Credit Card</span>
            </button>

            <button
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-muted p-6 hover:border-primary hover:bg-muted/50 transition-all"
              onClick={() => setStep("qr")}
              type="button"
            >
              <QrCode className="size-10" />
              <span className="font-medium">QR Code</span>
            </button>
          </div>
        ) : (
          <QrScreen />
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === "qr" && (
            <Button
              variant="ghost"
              onClick={() => setStep("select")}
              className="mr-auto"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          )}
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          {step === "qr" && <Button>I have paid</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
