import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AlgodContext } from "./context/algodContext";
import { WalletContext } from "./context/walletContext";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useBalance = (address, network) => {
  const { data, error } = useSWR(
    address ? `/api/accountInfo?address=${address}&network=${network}` : null,
    fetcher
  );
  return {
    balance: data ? data.accountInfo.amount / 1000000 : null,
    isLoading: !error && !data,
    isError: error,
  };
};

const Profile = () => {
  const walletContext = useContext(WalletContext);
  const algodContext = useContext(AlgodContext);

  const router = useRouter();

  const accountBalance = useBalance(
    walletContext.accounts.length > 0
      ? walletContext.accounts[0].address
      : null,
    algodContext.network
  );

  // handle expire
  useEffect(() => {
    if (walletContext.accounts.length > 0) {
      if (walletContext.accounts[0].expired) {
        router.push("/");
        return;
      }
    }
  }, [walletContext]);

  const handleToggle = () => {
    algodContext.toggleNetwork();
  };

  return (
    <div className="flex flex-col pt-6 p-4">
      <div className="flex flex-row items-center">
        <div className="self-auto w-1/2">
          <h1 className="text-xl font-semibold text-black dark:text-white truncate max-w-1/2">
            {/* {walletContext.accounts.length > 0
              ? walletContext.accounts[0].name
              : null} */}
              Wallet #1 asdasd
          </h1>
        </div>
        <div className="ml-2 w-1/2">
          <span className="text-gray-700 font-medium align-middle">
            {algodContext.network}
          </span>
          <div className="relative inline-block w-8 ml-1 align-middle select-none">
            <input
              type="checkbox"
              name="toggle"
              id="Network"
              className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-4 h-4 rounded-full bg-red-500 border-4 appearance-none cursor-pointer"
              onChange={handleToggle}
            />
            <label
              htmlFor="Network"
              className="block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-xs mb-1">
        {walletContext.accounts.length > 0
          ? walletContext.accounts[0].address.slice(0, 12) +
            "...." +
            walletContext.accounts[0].address.slice(46)
          : null}
      </p>
      <div className="flex flex-row rounded-md text-blue-500 bg-blue-200 items-center shadow-md">
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 113 113.4"
          className="w-4 h-4 align-middle ml-1"
        >
          <title>algorand-algo-logo</title>
          <polygon points="19.6 113.4 36 85 52.4 56.7 68.7 28.3 71.4 23.8 72.6 28.3 77.6 47 72 56.7 55.6 85 39.3 113.4 58.9 113.4 75.3 85 83.8 70.3 87.8 85 95.4 113.4 113 113.4 105.4 85 97.8 56.7 95.8 49.4 108 28.3 90.2 28.3 89.6 26.2 83.4 3 82.6 0 65.5 0 65.1 0.6 49.1 28.3 32.7 56.7 16.4 85 0 113.4 19.6 113.4" />
        </svg>
        <p className="text-black dark:text-gray-100 text-sm mx-1 text-center">
          {!accountBalance.isLoading ? accountBalance.balance : "loading..."}
        </p>
      </div>
    </div>
  );
};

export default Profile;
