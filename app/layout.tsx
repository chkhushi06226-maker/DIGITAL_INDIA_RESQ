import "./globals.css";

export const metadata = {
  title: "Digital India RES-Q",
  description: "Intelligent & Resilient Emergency Infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}