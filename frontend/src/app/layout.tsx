import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '作品展示',
  description: '个人作品展示平台',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="site-title">
              作品展示
            </Link>
            <nav className="site-nav">
              <Link href="/">首页</Link>
              <Link href="/works">作品</Link>
              <Link href="/about">关于</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">© {new Date().getFullYear()} 个人作品展示</div>
        </footer>
      </body>
    </html>
  );
}
