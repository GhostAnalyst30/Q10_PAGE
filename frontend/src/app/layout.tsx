import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import ChatBotWidget from "@/components/chatbot/chatbot-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Q10 Courses - Plataforma de Cursos Online",
    template: "%s | Q10 Courses",
  },
  description:
    "Aprende con los mejores cursos online. Accede a contenido de calidad en programación, marketing, diseño y más.",
  openGraph: {
    title: "Q10 Courses - Plataforma de Cursos Online",
    description:
      "Aprende con los mejores cursos online. Accede a contenido de calidad en programación, marketing, diseño y más.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
         <Providers>
           <div className="flex min-h-screen flex-col">
             <Navbar />
             <main className="flex-1">{children}</main>
             <Footer />
           </div>
           <ChatBotWidget />
         </Providers>
      </body>
    </html>
  );
}
