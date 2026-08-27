import "./globals.css";

export const metadata = {
  title: "AFTER HOURS®",
  description: "Built when nobody's watching. The first drop is coming.",
  openGraph: {
    title: "AFTER HOURS®",
    description: "Built when nobody's watching. The first drop is coming.",
    siteName: "AFTER HOURS®",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
