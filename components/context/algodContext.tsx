import { createContext, useEffect, useState } from "react";
import algosdk, { Algodv2 } from "algosdk";

interface AlgodContextAPI {
  network: string
  toggleNetwork: Function;
}

export const AlgodContext = createContext<AlgodContextAPI>(undefined);

export const AlgodContextWrapper = (props) => {

  const [network, setNetwork] = useState("Testnet");

  const toggleNetwork = () => {
    if (network === "Mainnet") setNetwork("Testnet");
    else setNetwork("Mainnet");
  };

  const initValue = {
    network,
    toggleNetwork,
  };

  return (
    <AlgodContext.Provider value={initValue}>
      {props.children}
    </AlgodContext.Provider>
  );
};
