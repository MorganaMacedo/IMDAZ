import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Missão IA do IMDAZ",
  description: "Jogo educativo de inteligência artificial para crianças de 10 anos.",
  icons: {
    icon: "/IMDAZ/favicon.svg",
    shortcut: "/IMDAZ/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
