// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header/Header";
// import { AuthProvider } from "@/context/AuthContext";
// import { Provider } from 'react-redux';
// import store from "@/store";



// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TradetronWeb",
  description: "tool for custom tradeing strategy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Provider store={store}> */}
        <Toaster />
        <Header />
          {children}
        {/* </Provider> */}
      </body>
    </html>
  );
}
