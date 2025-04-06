import "./globals.css";
import Navbar from './components/Navbar';
import { Toaster } from "sonner";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata = {
  title: "Scheduldog",
  description: "An intuitive course scheduling app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
        <Toaster
          // position="top-center"
          toastOptions={{
            className: "toast",
          }}
        />
        <Navbar />
        {children}
        </UserProvider>
      </body>
    </html>
  );
}
