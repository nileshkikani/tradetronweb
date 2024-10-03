// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";

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
        {/* <Toaster />
        <Header /> */}
        {/* {children} */}
        {/* </Provider> */}
        <div>
          <Header />
          <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-md mx-auto">
              {/* Left Side (Text Content) */}
              <div className="lg:w-1/2 px-4">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-center lg:text-left max-w-md lg:max-w-lg">
                  Algo trading.
                  <br />
                  For everyone.
                </h1>

                <p
                  className="main__desc text-center lg:text-left"
                  style={{ maxWidth: "540px" }}
                >
                  Tradetron has been created to empower strategy creators. How?
                  By allowing them to automate their quant strategies and sell
                  them to investors and traders the world over. The best part?
                  You never have to write a single bit of code or download
                  clunky algo trading software.
                </p>
              </div>

              {/* Right Side (Video and Animation) */}
              <div className="lg:w-1/2 w-full px-4 mt-6 lg:mt-0">
                <video
                  className="w-full"
                  id="bannerVideo"
                  autoPlay
                  loop
                  playsInline
                  muted
                >
                  <source
                    src="https://files.tradetron.tech/tt-ad2.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Custom Stock Market Animation */}
                <div className="relative w-full h-48 mt-4 overflow-hidden">
                  <div className="absolute bottom-0 left-0 flex w-full justify-between space-x-2">
                    {/* Bar 1 */}
                    <div className="w-1/6 bg-green-500 animate-bar h-1/2"></div>
                    {/* Bar 2 */}
                    <div className="w-1/6 bg-green-500 animate-bar h-3/4"></div>
                    {/* Bar 3 */}
                    <div className="w-1/6 bg-green-500 animate-bar h-1/3"></div>
                    {/* Bar 4 */}
                    <div className="w-1/6 bg-green-500 animate-bar h-2/3"></div>
                    {/* Bar 5 */}
                    <div className="w-1/6 bg-green-500 animate-bar h-5/6"></div>
                    {/* Bar 6 */}
                    <div className="w-1/6 bg-green-500 animate-bar h-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
