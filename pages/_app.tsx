import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/header";
import { Raleway } from "@next/font/google";
import Footer from "../components/Footer";
import ContentContainer from "../components/ContentContainer";

const raleway = Raleway({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={
        raleway.className + " w-full flex flex-col min-h-screen items-center"
      }
    >
      <Header />
      <ContentContainer className="flex-1 flex flex-row justify-center items-center">
        <Component {...pageProps} />
      </ContentContainer>
      <Footer />
    </div>
  );
}
