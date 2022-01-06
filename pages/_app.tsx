import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WalletContextWrapper } from "components/context/walletContext";
import { AlgodContextWrapper } from "components/context/algodContext";
import { AlertProvider } from "components/context/alertContext";
import Alert from "components/alert";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextWrapper>
      <AlgodContextWrapper>
        <AlertProvider>
          <div className="relative">
            <Alert />
            <Component {...pageProps} />
          </div>
        </AlertProvider>
      </AlgodContextWrapper>
    </WalletContextWrapper>
  );
}

export default MyApp;
