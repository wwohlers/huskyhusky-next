import Head from "next/head";
import Link from "next/link";

const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>About The Husky Husky</title>
        <meta
          name="description"
          content="About Northeastern's finest news source."
        />
      </Head>
      <div className="w-full">
        <h1 className="text-4xl">About The Husky Husky</h1>
        <p>
          We are a small online satire magazine run by Northeastern students.
          Please don&apos;t leave.
        </p>
        <h2 className="text-xl mt-4 font-medium">
          Interested in writing for us?
        </h2>
        <p>
          Use{" "}
          <Link
            className="underline"
            href="https://forms.gle/P421oUSvQXwJcik49"
          >
            this
          </Link>{" "}
          form to apply.
        </p>
        <h2 className="text-xl mt-4 font-medium">Got an idea?</h2>
        <p>
          Got an idea?{" "}
          <Link className="underline" href="mailto:huskyhuskymail@gmail.com">
            Email us.
          </Link>
        </p>
      </div>
    </>
  );
};

export default About;
