import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Car PDI | InspectMyCar",
};

export default function NewCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-main text-slate-900">
      {children}
    </section>
  );
}