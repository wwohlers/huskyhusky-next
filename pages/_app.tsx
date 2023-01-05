import { Raleway } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentContainer from "../components/ContentContainer";
import Footer from "../components/Footer";
import Header from "../components/header";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import Subscribe from "../components/Subscribe";
import "../styles/globals.css";
import "../styles/simpleMDE.css";

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
      <ConfirmationModal />
      <NextNProgress color="#990702" />
      <ToastContainer position="top-center" hideProgressBar={true} />
      <Header />
      <ContentContainer className="mb-8 flex-1 flex flex-row items-center">
        <Component {...pageProps} />
      </ContentContainer>
      <Subscribe />
      <Footer />
    </div>
  );
}
