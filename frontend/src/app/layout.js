import "./globals.css";

export const metadata = {
  title: "Scheduldog",
  description: "An intuitive course scheduling app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
