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
        <div className="self-auto">
          <p className="text-md font-semibold text-black dark:text-white text-2xl">
            {walletContext.accounts.length > 0
              ? walletContext.accounts[0].name
              : null}
          </p>
        </div>
        <div className="ml-auto">
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
      <div className="flex rounded-md text-blue-500 bg-blue-200 items-center shadow-md">
        <p className="text-black dark:text-gray-100 text-sm mx-1 text-center">
          <span className="pr-1 align-middle">
            <Image src="/algo.svg" layout="intrinsic" width={13} height={13} />
          </span>
          {!accountBalance.isLoading ? accountBalance.balance : "loading..."}
        </p>
      </div>
    </div>
  );
};

export default Profile;
