import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from './_components/footer';
import AuthProvider from './_providers/auth';
import { Toaster } from './_components/ui/sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barbershop App",
  description: "Agende seu corte de cabelo com os melhores!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ptBR">
      <link rel="icon" href="/favicon-fsw.png" sizes="any" />
      <body className={`${inter.className} dark flex flex-col min-h-screen`}>
        <AuthProvider>
          <div className='flex-grow'>
            {children}
            <Toaster />
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
