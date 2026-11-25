import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'RF Cinema IA — Estúdio de Curtas',
  description: 'Estúdio profissional de curtas-metragens com Inteligência Artificial e Gemini.',
  openGraph: {
    title: 'RF Cinema IA — Estúdio de Curtas',
    description: 'Estúdio profissional de curtas-metragens com Inteligência Artificial e Gemini.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RF Cinema IA — Estúdio de Curtas',
    description: 'Estúdio profissional de curtas-metragens com Inteligência Artificial e Gemini.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
