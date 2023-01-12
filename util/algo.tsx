import algosdk from "algosdk";
import AlgodClient from "algosdk/src/client/v2/algod/algod";

export interface AssetData {
  assetName: string;
  unitName: string;
  assetUrl: string;
  decimal: number;
  assetMetadataHash: string;
  note: string;
}

function ConstructCreateAssetTx(address: string, data: AssetData, txParams) {
  const decimals = data.decimal;
  const totalIssuance = 1 * 10 ** decimals;
  const manager = address;
  const reserve = address;
  const freeze = address;
  const clawback = address;
  const defaultFrozen = false;
  const enc = new TextEncoder();
  const noteEnc = enc.encode(data.note);
  let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
    address,
    noteEnc,
    totalIssuance,
    decimals,
    defaultFrozen,
    manager,
    reserve,
    freeze,
    clawback,
    data.unitName,
    data.assetName,
    data.assetUrl,
    data.assetMetadataHash,
    txParams
  );
  return txn;
}

export function ConstructGroupedCreateAssetTx(
  address: string,
  dataArray: Array<AssetData>,
  txParams
) {
  const txg = dataArray.map((data) =>
    ConstructCreateAssetTx(address, data, txParams)
  );
  var txgg = [];
  const size = 16;
  while (txg.length > 0) txgg.push(txg.splice(0, size));
  txgg.map((txg) => {
    const groupID = algosdk.computeGroupID(txg);
    txg.map((tx) => (tx.group = groupID));
  });

  return txgg;
}

export function SendTransaction(algodClient: AlgodClient, signedTxg) {
  const p = new Promise((resolve, reject) => {
    algodClient
      .sendRawTransaction(signedTxg)
      .do()
      .then((tx) => {
        waitForConfirmation(algodClient, tx.txId)
          .then((msg) => {
            console.log(msg);
            algodClient
              .pendingTransactionInformation(tx.txId)
              .do()
              .then((ptx) => {
                // get the asset ID
                // let assetId = ptx["asset-index"];
                resolve(ptx);
              })
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
  });
  return p;
}

// Function for sending an asset creation transaction
export function CreateAsset(
  algodClient: AlgodClient,
  myAlgoConnect: any,
  address: string,
  assetName: string,
  unitName: string,
  assetUrl: string,
  assetMetadataHash: string,
  note: string
) {
  var p = new Promise(function (resolve, reject) {
    const decimals = 0;
    const totalIssuance = 1;
    const manager = address;
    const reserve = address;
    const freeze = address;
    const clawback = address;
    const defaultFrozen = false;
    const enc = new TextEncoder();
    const noteEnc = enc.encode(note);
    // get chain parameters for sending transactions
    algodClient
      .getTransactionParams()
      .do()
      .then((params) => {
        // use note parameter when you want to attach a string to the transaction
        // construct the asset creation transaction
        let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
          address,
          noteEnc,
          totalIssuance,
          decimals,
          defaultFrozen,
          manager,
          reserve,
          freeze,
          clawback,
          unitName,
          assetName,
          assetUrl,
          assetMetadataHash,
          params
        );
        myAlgoConnect
          .signTransaction(txn.toByte())
          .then((signedTxn) => {
            algodClient
              .sendRawTransaction(signedTxn.blob)
              .do()
              .then((tx) => {
                waitForConfirmation(algodClient, tx.txId)
                  .then((msg) => {
                    console.log(msg);
                    algodClient
                      .pendingTransactionInformation(tx.txId)
                      .do()
                      .then((ptx) => {
                        // get the asset ID
                        let assetId = ptx["asset-index"];
                        resolve(assetId);
                      })
                      .catch(reject);
                  })
                  .catch(console.log);
              })
              .catch(console.log);
          })
          .catch(reject);
      })
      .catch(reject);
  });
  return p;
}

// Utility function to wait for tx confirmaiton
function waitForConfirmation(algodclient, txId) {
  var p = new Promise(function (resolve, reject) {
    console.log("Waiting transaction: " + txId + " to be confirmed...");
    var counter = 1000;
    let interval = setInterval(() => {
      if (--counter === 0) reject("Confirmation Timeout");
      algodclient
        .pendingTransactionInformation(txId)
        .do()
        .then((pendingInfo) => {
          if (pendingInfo != undefined) {
            let confirmedRound = pendingInfo["confirmed-round"];
            if (confirmedRound !== null && confirmedRound > 0) {
              clearInterval(interval);
              resolve("Transaction confirmed in round " + confirmedRound);
            }
          }
        })
        .catch(reject);
    }, 2000);
  });
  return p;
}

// // Function for sending payment transaction
// function sendPaymentTransaction(account, to, amount) {
//   var p = new Promise(function (resolve) {
//     // use closeRemainderTo paramerter when you want to close an account
//     let closeRemainderTo = undefined;
//     // use note parameter when you want to attach a string to the transaction
//     let note = undefined;
//     algodclient
//       .getTransactionParams()
//       .do()
//       .then((params) => {
//         let txn = algosdk.makePaymentTxnWithSuggestedParams(
//           account.addr,
//           to,
//           amount,
//           closeRemainderTo,
//           note,
//           params
//         );
//         // sign the transaction
//         var signedTxn = algosdk.signTransaction(txn, account.sk);
//         algodclient
//           .sendRawTransaction(signedTxn.blob)
//           .do()
//           .then((tx) => {
//             console.log(tx);
//             waitForConfirmation(algodclient, tx.txId)
//               .then(resolve)
//               .catch(console.log);
//           })
//           .catch(console.log);
//       })
//       .catch(console.log);
//   });
//   return p;
// }

// // Function for sending an asset creation transaction
// function createAsset(
//   algodClient: AlgodClient,
//   account:string,
//   assetName:string,
//   unitName:string,
//   decimals:number,
//   totalIssuance,
//   assetUrl,
//   assetMetadataHash,
//   manager,
//   reserve,
//   freeze,
//   clawback,
//   defaultFrozen
// ) {
//   var p = new Promise(function (resolve, reject) {
//     // get chain parameters for sending transactions
//     algodclient
//       .getTransactionParams()
//       .do()
//       .then((params) => {
//         // use note parameter when you want to attach a string to the transaction
//         let note = undefined;
//         let assetMetadataHash = undefined;
//         // construct the asset creation transaction
//         let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
//           account.addr,
//           note,
//           totalIssuance,
//           decimals,
//           defaultFrozen,
//           manager,
//           reserve,
//           freeze,
//           clawback,
//           unitName,
//           assetName,
//           assetUrl,
//           assetMetadataHash,
//           params
//         );
//         var signedTxn = algosdk.signTransaction(txn, account.sk);
//         algodclient
//           .sendRawTransaction(signedTxn.blob)
//           .do()
//           .then((tx) => {
//             waitForConfirmation(algodclient, tx.txId)
//               .then((msg) => {
//                 console.log(msg);
//                 algodclient
//                   .pendingTransactionInformation(tx.txId)
//                   .do()
//                   .then((ptx) => {
//                     // get the asset ID
//                     let assetId = ptx["asset-index"];
//                     resolve(assetId);
//                   })
//                   .catch(reject);
//               })
//               .catch(console.log);
//           })
//           .catch(console.log);
//       })
//       .catch(reject);
//   });
//   return p;
// }

// // Function for sending asset transaction
// function sendAssetTransaction(account, to, amount, assetId) {
//   var p = new Promise(function (resolve) {
//     // use closeRemainderTo paramerter when you want to close an account
//     let closeRemainderTo = undefined;
//     // use note parameter when you want to attach a string to the transaction
//     let note = undefined;
//     // use revocationTarget when you want to clawback assets
//     let revocationTarget = undefined;
//     algodclient
//       .getTransactionParams()
//       .do()
//       .then((params) => {
//         let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
//           account.addr,
//           to,
//           closeRemainderTo,
//           revocationTarget,
//           amount,
//           note,
//           assetId,
//           params
//         );
//         // sign the transaction
//         var signedTxn = algosdk.signTransaction(txn, account.sk);
//         algodclient
//           .sendRawTransaction(signedTxn.blob)
//           .do()
//           .then((tx) => {
//             waitForConfirmation(algodclient, tx.txId)
//               .then(resolve)
//               .catch(console.log);
//           })
//           .catch(console.log);
//       })
//       .catch(console.log);
//   });
//   return p;
// }

// function compileContract(contractDir) {
//   var p = new Promise(function (resolve) {
//     // read the contract file
//     const filePath = path.join(__dirname, contractDir);
//     const data = fs.readFileSync(filePath);

//     // Compile teal contract
//     algodclient.compile(data).do().then(resolve).catch(console.log);
//   });
//   return p;
// }

// function sendSwapTransaction(buyerAccount, contractAddr, lsig) {
//   var p = new Promise(function (resolve) {
//     const assetId = 15977673;
//     const closeRemainderTo = undefined;
//     const note = undefined;
//     const revocationTarget = undefined;
//     const aliceAddress =
//       "2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA";
//     algodclient
//       .getTransactionParams()
//       .do()
//       .then((params) => {
//         // make the algo payment tx from contract to buyer
//         let algoPaymentTx = algosdk.makePaymentTxnWithSuggestedParams(
//           contractAddr,
//           buyerAccount.addr,
//           10,
//           closeRemainderTo,
//           note,
//           params
//         );
//         // make the asset transfer tx from buyer to Alice
//         let assetTransferTx = algosdk.makeAssetTransferTxnWithSuggestedParams(
//           buyerAccount.addr,
//           aliceAddress,
//           closeRemainderTo,
//           revocationTarget,
//           10,
//           note,
//           assetId,
//           params
//         );
//         // put 2 tx into an array
//         const txns = [algoPaymentTx, assetTransferTx];
//         // assign the group tx ID
//         const txGroup = algosdk.assignGroupID(txns);
//         // sign the first tx with the contract logic sig
//         const signedAlgoPaymentTx = algosdk.signLogicSigTransactionObject(
//           txGroup[0],
//           lsig
//         );
//         // sign the second tx with the buyer's private key
//         const signedAssetTransferTx = txGroup[1].signTxn(buyerAccount.sk);
//         // assemble transactions
//         let signedTxs = [];
//         signedTxs.push(signedAlgoPaymentTx.blob);
//         signedTxs.push(signedAssetTransferTx);
//         algodclient
//           .sendRawTransaction(signedTxs)
//           .do()
//           .then((tx) => {
//             waitForConfirmation(algodclient, tx.txId)
//               .then(resolve)
//               .catch(console.log);
//           })
//           .catch(console.log);
//       })
//       .catch(console.log);
//   });
//   return p;
// }

// function getAccountInfo(address) {
//   var p = new Promise(function (resolve) {
//     algodclient.accountInformation(address).do().then(resolve);
//   });
//   return p;
// }

// function checkIfNFT(assetId) {
//   var p = new Promise(function (resolve) {
//     algodclient.getAssetByID(assetId).do().then(resolve);
//     algodclient.get
//   });
//   return p;
// }
