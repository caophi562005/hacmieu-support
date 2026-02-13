import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";
import "@workspace/ui/themes/bubblegum.css";
import "@workspace/ui/themes/doom-64.css";
import "@workspace/ui/themes/vintage-paper.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="h-screen w-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
