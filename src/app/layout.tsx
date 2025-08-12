import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'IqamahNow',
  description: 'Your companion for prayer times, masjid information, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(207 66% 63%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16"/><path d="M12 4a5 5 0 0 1 5 5v5H7v-5a5 5 0 0 1 5-5z"/><path d="M8 18h8"/><path d="M12 14v4"/><path d="M18 9.5V9a6 6 0 0 0-12 0v.5"/></svg>`;
  const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(logoSvg)}`;
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconDataUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,701&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
