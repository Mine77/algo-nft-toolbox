import algosdk from "algosdk";
import type { NextApiRequest, NextApiResponse } from "next";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address,network } = req.query;

  const testnetServer = "https://testnet-algorand.api.purestake.io/ps2";
  const mainnetServer = "https://mainnet-algorand.api.purestake.io/ps2";
  const port = "";
  const token = {
    "X-API-Key": process.env.PURESTAKE_API,
  };

  let algodClient = undefined;
  switch (network) {
    case "Testnet":
      algodClient = new algosdk.Algodv2(token, testnetServer, port);
      break;

    case "Mainnet":
      algodClient = new algosdk.Algodv2(token, mainnetServer, port);
      break;
    default:
      break;
  }

  const algoBalance = await algodClient.accountInformation(address).do();

  res.status(200).json({ accountInfo: algoBalance });
};

export default handler;
