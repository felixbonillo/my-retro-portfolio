// Make sure the Terminal component exists at the correct path
import RetroPC from "./components/RetroPC";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Felix Bonillo</title>
        <meta name="description" content="Portafolio de proyectos y habilidades" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RetroPC />
    </>
  );
}
