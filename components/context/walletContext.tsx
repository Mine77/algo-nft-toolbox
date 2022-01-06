import React, { createContext, useEffect, useState } from "react";

interface Account{
  name:string,
  address:string,
  expired:boolean
}

export interface WalletContextAPI {
  myAlgoConnect: any;
  accounts: Array<Account>;
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
}

// construct the context with no default value
export const WalletContext = createContext<WalletContextAPI>(undefined);

export const WalletContextWrapper = (props) => {


  const [myAlgoConnect, setMyAlgoConnect] = useState(undefined);
  const [accounts, setAccounts] = useState<Array<Account>>([]);
  // const expirePeriod = 15 * 60 * 1000; // 15mins
  const expirePeriod = 24 * 60 * 60 * 1000; // for test

  useEffect(() => {
    import("@randlabs/myalgo-connect")
      .then((MyAlgoConnect) => {
        setMyAlgoConnect(new MyAlgoConnect.default());
      })
      .catch((err) => {
        console.log(err);
      });

    const localTimestamp = localStorage.getItem("accounts.timestamp")
    const localName = localStorage.getItem("accounts.name")
    const localAddress = localStorage.getItem("accounts.address")
    

    
    if (localTimestamp === null || localName === null || localAddress == null) {
      setAccounts([
        {
          name: "",
          address: "",
          expired: true,
        },
      ]);
      return ;
    }

    //check expiration
    const oldTimeObject = JSON.parse(
      localStorage.getItem("accounts.timestamp")
    );
    const oldTime = oldTimeObject.timestamp;
    const now = new Date().getTime();


    //handle expiration
    if (now - oldTime > expirePeriod) {
      setAccounts([
        {
          name: "",
          address: "",
          expired: true,
        },
      ]);
      return ;
    }

    if (now - oldTime < expirePeriod) {
      // get accounts from local storage
      setAccounts([
        {
          name: localStorage.getItem("accounts.name"),
          address: localStorage.getItem("accounts.address"),
          expired: false,
        },
      ]);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ myAlgoConnect, accounts, setAccounts }}>
      {props.children}
    </WalletContext.Provider>
  );
};
