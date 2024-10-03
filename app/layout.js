import "./globals.css";
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

const RootProvider = dynamic(() => import('../components/RootProvider'), {
  ssr: false,
});

export const metadata = {
  title: "TradetronWeb",
  description: "Tool for custom trading strategy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          <Toaster />
          <Header />
          <main>{children}</main>
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
