import { Raleway } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentContainer from "../components/ContentContainer";
import Footer from "../components/Footer";
import Header from "../components/header";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import Subscribe from "../components/Subscribe";
import "../styles/globals.css";
import "../styles/simpleMDE.css";
import { number, ValidationError } from "../util/validation/library/number";

const raleway = Raleway({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const validator = number()
      .integer({
        roundIfNot: false,
      })
      .toString()
      .minLength(2);
    try {
      validator.assert(40);
    } catch (e) {
      if (e instanceof ValidationError) {
        toast.error(e.message);
      }
    }
  });

  return (
    <div
      className={
        raleway.className + " w-full flex flex-col min-h-screen items-center"
      }
    >
      <ConfirmationModal />
      <NextNProgress color="#990702" />
      <ToastContainer position="top-center" hideProgressBar={true} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <ContentContainer className="mb-8 flex-1 flex flex-row items-center">
        <Component {...pageProps} />
      </ContentContainer>
      <Subscribe />
      <Footer />
    </div>
  );
}
