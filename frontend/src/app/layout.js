import "./globals.css";
import Navbar from './components/Navbar';
import { Toaster } from "sonner";

export const metadata = {
  title: "Scheduldog",
  description: "An intuitive course scheduling app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          // position="top-center"
          toastOptions={{
            className: "toast",
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
