import "../app/globals.css";
import NavBar from "@/components/NavBar";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <main className="min-h-[calc(100vh-56px)]">
        <Component {...pageProps} />
      </main>
    </>
  );
}
