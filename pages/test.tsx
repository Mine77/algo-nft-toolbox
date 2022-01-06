import { NextPage } from "next";
import { useState } from "react";
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

const Test: NextPage = () => {
  const { data, error } = useSWR(
    walletContext.accounts.length > 0
      ? `/api/accountInfo?address=${walletContext.accounts[0].address}&network=${algodContext.network}`
      : null,
    fetcher
  );

  if (error) console.log(error);
  if (!data) console.log("loading");
  return (
    <div>
      {list.map((item) => {
        return (<h1>{item}</h1>);
      })}
      <button onClick={handleClick}>Button</button>
    </div>
  );
};

export default Test;
