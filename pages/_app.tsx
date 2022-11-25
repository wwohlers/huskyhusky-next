import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/header";
import { Raleway } from "@next/font/google";
import Footer from "../components/Footer";

const raleway = Raleway({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={
        raleway.className + " w-full flex flex-col min-h-screen items-center"
      }
    >
      <Header />
      <main className="flex-1 flex flex-row justify-center w-11/12 md:w-5/6 lg:w-4/5">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
