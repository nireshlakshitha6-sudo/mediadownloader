import './globals.css';
import SecurityShield from '../components/SecurityShield';

export const metadata = {
  title: 'VEROX MEDIA DOWNLOADER - Universal Social Video & Audio Downloader',
  description: 'Download videos and audio in 4K, 1080p, and 320kbps MP3 from YouTube, TikTok, Facebook, Instagram, Twitter/X, and more with KeyAuth Premium.',
  themeColor: '#e50914'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23e50914'/%3E%3Cpath d='M28 32 L50 68 L72 32' stroke='white' stroke-width='10' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Cpath d='M50 20 L50 62' stroke='white' stroke-width='10' stroke-linecap='round' fill='none'/%3E%3C/svg%3E" type="image/svg+xml" />
      </head>
      <body>
        <SecurityShield />
        {children}
      </body>
    </html>
  );
}
