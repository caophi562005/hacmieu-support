import { api } from "@workspace/backend/_generated/api";
import { useMutation } from "convex/react";
import { customAlphabet } from "nanoid";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface Props {
  type: "subscription_creation" | "subscription_renewal";
}

const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

const generateCode = (prefix: string) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // 25
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 12
  const day = date.getDate().toString().padStart(2, "0"); // 22

  const randomSuffix = nanoid(); // VD: X9Y2Z1
  return `${prefix}${year}${month}${day}${randomSuffix}`; // Kết quả: 251222X9Y2Z1
};

export const QrScreen = ({ type }: Props) => {
  const prefix = type === "subscription_creation" ? "HMSUPCRE" : "HMSUPRE";
  const codeRef = useRef(generateCode(prefix));
  const code = codeRef.current;

  const createPayment = useMutation(api.private.payments.create);
  const isCreated = useRef(false);

  useEffect(() => {
    if (isCreated.current) return;

    createPayment({
      amount: 10000,
      currency: "VND",
      type: type,
      paymentMethod: "qr",
      status: "pending",
      code: code,
      plan: "Pro",
      interval: "month",
    }).catch((err) => console.error("Could not register pending payment", err));

    isCreated.current = true;
  }, [type, code, createPayment]);

  return (
    <div className="flex flex-col items-center justify-center py-4 animate-in fade-in slide-in-from-right-4">
      <div className="relative overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
        <Image
          src={`https://img.vietqr.io/image/MB-0344927528-qr_only.png?amount=10000&addInfo=${code}`}
          alt="QR Code"
          width={300}
          height={300}
          className="h-auto w-full"
        />
      </div>
      <p className="mt-4 text-center font-mono font-bold text-lg">{code}</p>
      <p className="mt-2 text-center text-muted-foreground text-sm">
        Use your banking app to scan the code
      </p>
      {/* <p className="text-center text-muted-foreground text-xs mt-1">
        Your payment will be verified automatically
      </p> */}
    </div>
  );
};
