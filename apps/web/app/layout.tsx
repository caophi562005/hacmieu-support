import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import "@workspace/ui/globals.css";
import "@workspace/ui/themes/bubblegum.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/bubblegum.font.css" />
      </head>
      <body className="bubblegum font-sans antialiased">
        <ClerkProvider>
          <Providers>
            <TooltipProvider>
              <Toaster />
              {children}
            </TooltipProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
