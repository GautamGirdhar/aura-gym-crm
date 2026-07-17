import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Providers>
            <main className="flex-1 bg-zinc-100 min-h-screen">
              {children}
              <Toaster richColors position="top-right" />
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
