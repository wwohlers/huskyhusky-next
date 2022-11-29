import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { Raleway } from "@next/font/google";
import Footer from "../components/Footer";
import ContentContainer from "../components/ContentContainer";
import Head from "next/head";

const raleway = Raleway({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={
        raleway.className + " w-full flex flex-col min-h-screen items-center"
      }
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <ContentContainer className="mb-16 flex-1 flex flex-row items-center">
        <Component {...pageProps} />
      </ContentContainer>
      <Footer />
    </div>
  );
}
