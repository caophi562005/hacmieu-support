import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QrDialog = ({ onOpenChange, open }: Props) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="bg-white!">
        <DialogHeader>
          <DialogTitle>QR Payment</DialogTitle>

          <DialogDescription>
            Scan the QR code to make a payment
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center">
          <Image
            src={
              "https://img.vietqr.io/image/MB-0344927528-qr_only.png?amount=10000&addInfo=HMSUP39YyzfYRXyMSK7fCI7QT4Le8vNB"
            }
            alt="QR Code"
            width={400}
            height={400}
          />
        </div>

        <DialogFooter>
          <Button variant={"outline"}>Close</Button>
          <Button>Pay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
