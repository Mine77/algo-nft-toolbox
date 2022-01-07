import algosdk from "algosdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { CreateAsset, SendTransaction } from "util/algo";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(400).send({ message: "Only POST requests allowed" });
    return;
  }

  const { network } = req.query;

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

  let signedTxgEncoded = req.body.signedGroupTx;

  const txIdArray = signedTxgEncoded.map((data) => {
    return data.txID;
  });
  const signedTxgBlob = signedTxgEncoded.map(
    (data) => new Uint8Array(Buffer.from(data.blob, "base64"))
  );

  try {
    await SendTransaction(algodClient, signedTxgBlob);
    var assetIds = [];
    var promise = [];
    txIdArray.map((txId) => {
      promise.push(algodClient.pendingTransactionInformation(txId).do());
    });
    const ptxs = await Promise.all(promise);
    var assetIds = [];
    ptxs.map((ptx) => {
      assetIds.push(ptx["asset-index"]);
    });
    res.status(200).json({ assetIds: assetIds });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default handler;
