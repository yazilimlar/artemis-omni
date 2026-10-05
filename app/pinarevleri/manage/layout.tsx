import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pınar Evleri — Availability & Booking Control Center',
  description: 'Manager operations MVP for Pınar Evleri reservations, availability, occupancy and booking changes.',
  robots: { index: false, follow: false },
};

export default function PinarEvleriManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body > header,
        body > footer,
        body > a[href="#main"] { display: none !important; }
        body > main#main { min-height: 100dvh; }
        body > main#main > main { margin-top: 0 !important; }
      ` }} />
      {children}
    </>
  );
}
