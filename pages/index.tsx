import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { WalletContext } from "components/context/walletContext";
import Link from "next/link";
import { useRouter } from "next/router";
import AlertContext from "components/context/alertContext";

const Home: NextPage = () => {
  const walletContext = useContext(WalletContext);
  const [walletStatus, setWalletStatus] = useState(false);
  const router = useRouter();
  const alert = useContext(AlertContext);

  const ConnectWallet = () => {
    walletContext.myAlgoConnect
      .connect()
      .then((accounts) => {
        walletContext.setAccounts(accounts);
        localStorage.setItem("accounts.name", accounts[0].name);
        localStorage.setItem("accounts.address", accounts[0].address);
        var timeObject = { value: "value", timestamp: new Date().getTime() };
        localStorage.setItem("accounts.timestamp", JSON.stringify(timeObject));
        router.push("/mint");
      })
      .catch((error) => {
        alert.error(String(error));
      });
  };

  useEffect(() => {
    if (walletContext.accounts.length === 0) return;
    if (walletContext.accounts[0].expired) return;
    setWalletStatus(true);
  }, [walletContext]);

  return (
    <div>
      <Head>
        <title>Algorand NFT Toolbox</title>
        <meta name="description" content="A simple Algorand ARC3 mint tool" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main>
        <div className="flex items-center justify-center h-screen">
          <div className="p-10">
            <h1 className="font-sans font-bold text-7xl p-7">
              Algorand NFT Toolbox
              <br />
              <span className="text-sm flex items-center justify-center">
                Work In Progress: use at your own risk
              </span>
            </h1>

            <div className="flex items-center justify-center">
              {walletStatus ? (
                <Link href="/mint" passHref>
                  <button
                    type="button"
                    className="py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-800 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg"
                  >
                    Connect Wallet
                  </button>
                </Link>
              ) : (
                <button
                  onClick={ConnectWallet}
                  type="button"
                  className="py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-800 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
