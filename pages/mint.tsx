import type { NextPage } from "next";
import Layout from "components/layout";
import { useContext, useState } from "react";
import FileInputButton from "components/fileInputButton";
import MintNftTable, { TableDataAPI } from "components/mintNftTable";
import { AlgodContext } from "components/context/algodContext";
import { WalletContext } from "components/context/walletContext";
import AlertContext from "components/context/alertContext";
import useSWR from "swr";
import { AssetData, ConstructGroupedCreateAssetTx } from "util/algo";
import { Web3Storage } from "web3.storage";
import ssri from "ssri";
import { createHash } from "crypto";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useTxParams = (network) => {
  const { data, error } = useSWR(`/api/txParams?network=${network}`, fetcher);
  return {
    data: data ? data.txParams : null,
    isLoading: !error && !data,
    isError: error,
  };
};

interface ARC3JSON {
  title: string;
  type: string;
  properties: Object;
}

const MintNFT: NextPage = () => {
  interface ImgData {
    name: string;
    image: string;
    imgFile: File;
  }
  interface ImgDataState extends Array<ImgData> {}
  const [imgData, setImgData] = useState<ImgDataState>([]);

  const alert = useContext(AlertContext);

  const walletContext = useContext(WalletContext);
  const algodContext = useContext(AlgodContext);

  const txParams = useTxParams(algodContext.network);

  const handleFileChange = (data) => {
    setImgData(data);
  };

  const postMint = (signedGroupTxEncoded, network) => {
    var p = new Promise<any>((resolve, reject) => {
      fetch(`/api/mint?network=${network}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signedGroupTx: signedGroupTxEncoded,
        }),
      })
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
    return p;
  };

  const createAsset  = (assetData) => {
    var p = new Promise<Array<number>>(async (resolve, reject) => {
      if (txParams.isError) reject("Get transaction parameter error");
      const txgg = ConstructGroupedCreateAssetTx(
        walletContext.accounts[0].address,
        assetData,
        txParams.data
      );

      var signedTxgEncodedArray = [];
      for (let i = 0; i < txgg.length; i++) {
        try {
          const signedTxg = await walletContext.myAlgoConnect.signTransaction(
            txgg[i].map((txn) => txn.toByte())
          );
          const signedTxgEncoded = signedTxg.map((signedTx) => {
            return {
              txID: signedTx.txID,
              blob: Buffer.from(signedTx.blob).toString("base64"),
            };
          });
          signedTxgEncodedArray.push(signedTxgEncoded);
        } catch (error) {
          reject(String(error));
        }
      }

      var assetIds = [];
      for (let i = 0; i < signedTxgEncodedArray.length; i++) {
        try {
          const result = await postMint(
            signedTxgEncodedArray[i],
            algodContext.network
          );
          if (result.status === 400) {
            reject(result.response.error);
          }
          assetIds = assetIds.concat(result.assetIds);
        } catch (error) {
          reject(String(error));
        }
      }
      resolve(assetIds);
    });
    return p;
  };

  const uploadToIPFS = (files: Array<any>) => {
    var p = new Promise((resolve, reject) => {
      const client = new Web3Storage({
        token: process.env.NEXT_PUBLIC_IPFS_API,
      });

      var promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(client.put([files[i]], { wrapWithDirectory: false }));
      }
      Promise.all(promises).then(resolve).catch(reject);
    });
    return p;
  };

  const handleMint = (tableData: TableDataAPI) => {
    var p = new Promise(async (resolve, reject) => {
      try {
        const imgFiles = tableData.map((data) => {
          return data.imgFile;
        });

        const imgIntegritiy = [];
        for (let i = 0; i < tableData.length; i++) {
          const integrity = await ssri
            .create({
              algorithms: ["sha256"],
            })
            .update(tableData[i].image)
            .digest();
          imgIntegritiy.push(integrity.toString());
        }

        const imgCids = await uploadToIPFS(imgFiles);

        const arc3JSONs: Array<ARC3JSON> = tableData.map((data, i) => {
          return {
            title: "Token Metadata",
            type: "object",
            properties: {
              name: {
                type: "string",
                description: data.name,
              },
              decimals: {
                type:"integer",
                description: data.decimal.toString()
              },
              description: {
                type: "string",
                description: data.description,
              },
              image: {
                type: "string",
                description: "ipfs://" + imgCids[i],
              },
              image_integrity: {
                type: "string",
                description: imgIntegritiy[i],
              },
              image_mimetype: {
                type: "string",
                description: imgFiles[i].type,
              },
            },
          };
        });

        console.log(arc3JSONs);

        var arc3JSONSha256s = [];
        var arc3JSONCids = [];
        for (let i = 0; i < arc3JSONs.length; i++) {
          const arc3JSONString = JSON.stringify(arc3JSONs[i]);
          const arc3JSONSha256 = await createHash("sha256")
            .update(arc3JSONString, "utf-8")
            .digest();
          arc3JSONSha256s.push(new Uint8Array(arc3JSONSha256));

          const arc3Blob = new Blob([JSON.stringify(arc3JSONs[i])], {
            type: "application/json",
          });
          const arc3File = new File([arc3Blob], arc3JSONSha256 + ".json");
          const arc3JSONCid = await uploadToIPFS([arc3File]);
          arc3JSONCids.push(arc3JSONCid[0]);
        }

        const assetData: Array<AssetData> = tableData.map((data, i) => {
          return {
            assetName: data.name,
            unitName: data.unit,
            decimal: Number(data.decimal),
            assetUrl: "ipfs://" + arc3JSONCids[i] + "#arc3",
            assetMetadataHash: arc3JSONSha256s[i],
            note: "Creation of an ARC3 NFT",
          };
        });

        console.log(assetData);

        const assetIds = await createAsset(assetData);
        var assetInfo = assetIds.map((id,i)=>{return {
          assetId:id,
          assetCid: arc3JSONCids[i]
        }})
        if (assetIds === [] ) assetInfo=null;
        resolve(assetInfo);
      } catch (error) {
        reject(String(error));
      }
    });
    return p;
  };

  return (
    <Layout>
      <div>
        <div className="header flex items-start justify-between mb-8">
          <div className="title">
            <p className="text-4xl font-bold text-gray-800 mb-4">Mint NFT</p>
          </div>
        </div>
        {imgData.length === 0 ? (
          <div className="flex w-full item-center justify-center">
            <FileInputButton
              text="Upload NFT Image(s)"
              onDataChange={handleFileChange}
            />
          </div>
        ) : (
          <MintNftTable data={imgData} onMint={handleMint} />
        )}
      </div>
    </Layout>
  );
};
export default MintNFT;
