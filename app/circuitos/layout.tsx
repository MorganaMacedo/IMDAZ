import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratório de Circuitos | IMDAZ",
  description: "Oficina interativa de circuitos e programação com duração de 120 minutos para crianças de 10 anos.",
};

export default function CircuitLabLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
