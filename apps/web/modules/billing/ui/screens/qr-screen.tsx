import Image from "next/image";

export const QrScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 animate-in fade-in slide-in-from-right-4">
      <div className="relative overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
        <Image
          src={
            "https://img.vietqr.io/image/MB-0344927528-qr_only.png?amount=10000&addInfo=HMSUP39YyzfYRXyMSK7fCI7QT4Le8vNB"
          }
          alt="QR Code"
          width={300}
          height={300}
          className="h-auto w-full"
        />
      </div>
      <p className="mt-4 text-center text-muted-foreground text-sm">
        Use your banking app to scan the code
      </p>
    </div>
  );
};
