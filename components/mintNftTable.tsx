import {
  createRef,
  MutableRefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import AlertContext from "./context/alertContext";
import { AlgodContext } from "./context/algodContext";
import FileInputButton from "./fileInputButton";
import GroupEditModal from "./groupEditModal";
import ImgPreviewModal from "./imgPreviewModal";

interface PropsData {
  name: string;
  image: string;
  imgFile: File;
}

interface PropsDataArray extends Array<PropsData> {}

enum NFTStandard {
  fracArc3 = "Fractional ARC3",
  pureArc3 = "Pure ARC3",
}

interface NftData {
  data: TableDataItemAPI;
  refs: {
    name: MutableRefObject<HTMLInputElement>;
    unit: MutableRefObject<HTMLInputElement>;
    decimal: MutableRefObject<HTMLInputElement>;
    description: MutableRefObject<HTMLTextAreaElement>;
    status: MutableRefObject<HTMLDivElement>;
  };
}

export interface TableDataItemAPI {
  id: number;
  name: string;
  image: string;
  imgFile: File;
  unit: string;
  decimal: number;
  standard: NFTStandard | string;
  description: string;
}

export interface TableDataAPI extends Array<TableDataItemAPI> {}

interface NftDataArray extends Array<NftData> {}

const MintNftTable = (props: { data: PropsDataArray; onMint: Function }) => {
  const alert = useContext(AlertContext);

  const algodContext = useContext(AlgodContext);
  // header
  const headers = [
    "#",
    "Image",
    "NFT Name",
    "NFT Unit",
    "NFT Decimal",
    "NFT Standard",
    "Description",
    "",
  ];
  const headerStyle =
    "px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal";

  // Modal
  const [showImgPreviewModal, setShowImgPreviewModal] = useState(false);
  const [previewImg, setPreviewImg] = useState<string>("");
  const [showGroupEditModal, setShowGroupEditModal] = useState(false);

  // process data
  const populateNftData = (propsData: PropsDataArray): NftDataArray => {
    return propsData.map((data, i) => ({
      data: {
        id: i,
        ...data,
        unit: "",
        decimal: 0,
        standard: NFTStandard.pureArc3,
        description: "",
        imgFile: data.imgFile,
      },
      refs: {
        name: createRef(),
        unit: createRef(),
        decimal: createRef(),
        description: createRef(),
        status: createRef(),
      },
    }));
  };

  const updateNftDataId = (oldDataArray: NftDataArray): NftDataArray => {
    const dataArrayTemp = [...oldDataArray];
    for (let i = 0; i < oldDataArray.length; i++) dataArrayTemp[i].data.id = i;
    return dataArrayTemp;
  };

  const [nftDataArray, setNftDataArray] = useState<NftDataArray>(
    populateNftData(props.data)
  );

  // button event

  const handleInputClick = (event) => {
    event.target.select();
  };

  const handleAddData = (newData) => {
    setNftDataArray(
      updateNftDataId([...nftDataArray].concat(populateNftData(newData)))
    );
  };

  const handleRemoveClick = (index) => {
    let newNftDataArray: NftDataArray = [...nftDataArray];
    newNftDataArray.splice(index, 1);
    newNftDataArray = updateNftDataId(newNftDataArray);

    setNftDataArray(newNftDataArray);
  };

  useEffect(() => {
    if (nftDataArray.length == 0) return;
    nftDataArray.map((item) => {
      item.refs.name.current.value = item.data.name;
      item.refs.unit.current.value = item.data.unit;
      item.refs.description.current.value = item.data.description;
    });
  }, [nftDataArray]);

  const handleInputChange = (event) => {
    const id = event.target.id;
    const index = id.match(/\d+/)[0];
    const type = id.match(/\D+/)[0];
    var value = event.target.value;
    if (type === "name") {
      const size = new Buffer(value).length;
      console.log(size);
      if (size > 32) {
        value = null;
      }
    }

    let newNftDataArray: NftDataArray = [...nftDataArray];
    newNftDataArray[parseInt(index)].data[type] = value;
    setNftDataArray(newNftDataArray);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.id;
    const index = id.match(/\d+/)[0];
    const value = event.target.value;
    let newNftDataArray: NftDataArray = [...nftDataArray];
    newNftDataArray[parseInt(index)].data.standard = value;
    switch (value) {
      case NFTStandard.fracArc3:
        nftDataArray[parseInt(index)].refs.decimal.current.disabled = false;
        nftDataArray[parseInt(index)].refs.decimal.current.value = "1";
        newNftDataArray[parseInt(index)].data.decimal = 1;
        break;
      case NFTStandard.pureArc3:
        nftDataArray[parseInt(index)].refs.decimal.current.disabled = true;
        nftDataArray[parseInt(index)].refs.decimal.current.value = "0";
        newNftDataArray[parseInt(index)].data.decimal = 0;
        break;
    }

    setNftDataArray(newNftDataArray);
  };

  const handleSave = (editData: {
    name: string;
    unit: string;
    description: string;
  }) => {
    let newNftDataArray: NftDataArray = [...nftDataArray];
    nftDataArray.map((item, i) => {
      const newData = {
        name:
          editData.name !== ""
            ? editData.name
                .replaceAll("[id]", (item.data.id + 1).toString())
                .replaceAll("[name]", item.data.name)
            : item.refs.name.current.value,
        unit:
          editData.unit !== ""
            ? editData.unit
                .replaceAll("[id]", (item.data.id + 1).toString())
                .replaceAll("[name]", item.data.name)
            : item.refs.unit.current.value,
        description:
          editData.description !== ""
            ? editData.description
                .replaceAll("[id]", (item.data.id + 1).toString())
                .replaceAll("[name]", item.data.name)
            : item.refs.description.current.value,
      };
      newNftDataArray[i].data.name = newData.name;
      newNftDataArray[i].data.unit = newData.unit;
      newNftDataArray[i].data.description = newData.description;
      item.refs.name.current.value = newData.name;
      item.refs.unit.current.value = newData.unit;
      item.refs.description.current.value = newData.description;
    });
    setNftDataArray(newNftDataArray);
  };

  // handle mint
  enum MintStatus {
    Ready = 0,
    InMint = 1,
    Completed = 2,
  }
  const [mintStatus, setMintStatus] = useState(MintStatus.Ready);
  const [assets, setAssets] = useState([]);

  const handleMintClick = () => {
    let tableData: TableDataAPI = [];

    nftDataArray.map((item) => tableData.push(item.data));

    setMintStatus(MintStatus.InMint);

    const networkUrl = algodContext.network === "Testnet" ? "testnet." : "";

    props
      .onMint(tableData)
      .then((assetInfo) => {
        // console.log(assetIds);
        if (!assetInfo) {
          setMintStatus(MintStatus.Ready);
          return;
        }
        setAssets(
          assetInfo.map((info) => ({
            assetId: info.assetId,
            assetCid: info.assetCid,
            url:
              "https://" + networkUrl + "algoexplorer.io/asset/" + info.assetId,
          }))
        );
        setMintStatus(MintStatus.Completed);
        alert.success("Mint completed");
      })
      .catch((error) => {
        alert.error(String(error));
        setMintStatus(MintStatus.Ready);
      });
  };

  return (
    <div>
      {mintStatus == MintStatus.Ready ? (
        <div className="flex flex-row items-center justify-top">
          <div className="flex">
            <FileInputButton text="Add New" onDataChange={handleAddData} />
          </div>

          <div className="flex ml-4">
            <button
              onClick={() => {
                setShowGroupEditModal(true);
              }}
              type="button"
              className="py-2 px-8  bg-blue-600 hover:bg-blue-700 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md outline-none rounded-lg "
            >
              Group Edit
            </button>
          </div>
          <div className="flex ml-auto">
            <button
              onClick={handleMintClick}
              type="button"
              className="py-2 px-8  bg-blue-600 hover:bg-blue-700 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md outline-none rounded-lg "
            >
              Mint All({nftDataArray.length})
            </button>
          </div>
        </div>
      ) : null}

      <div className="container mx-auto">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal table-auto">
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} scope="col" className={headerStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nftDataArray.map((item, i) => (
                  <tr key={i}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className="relative inline-block leading-tight">
                        <p className="relative">{item.data.id + 1}</p>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex justify-start items-center">
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => {
                              setShowImgPreviewModal(true);
                              setPreviewImg(item.data.image);
                            }}
                            className="block relative"
                          >
                            <img
                              alt="preview image"
                              src={item.data.image}
                              className="mx-auto object-cover rounded-lg h-12 w-12 "
                            />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input
                        ref={item.refs.name}
                        id={item.data.id + "name"}
                        type="text"
                        className="outline-none border-0 focus:border-b-2 focus:border-blue-500"
                        placeholder="Name"
                        maxLength={16}
                        defaultValue={item.data.name}
                        onClick={handleInputClick}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input
                        ref={item.refs.unit}
                        id={item.data.id + "unit"}
                        type="text"
                        className="outline-none border-0 focus:border-b-2 focus:border-blue-500"
                        placeholder="Unit name"
                        maxLength={4}
                        onClick={handleInputClick}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input
                        ref={item.refs.decimal}
                        id={item.data.id + "decimal"}
                        type="number"
                        max={10}
                        min={0}
                        className="outline-none border-0 w-full focus:border-b-2 focus:border-blue-500  disabled:text-gray-400 disabled:bg-transparent"
                        placeholder="Decimals (0-10)"
                        onClick={handleInputClick}
                        onChange={handleInputChange}
                        defaultValue={0}
                        disabled
                      />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <select
                        id={item.data.id + "standard"}
                        onChange={handleSelectChange}
                        className="outline-none border-2 border-blue-500 bg-blue-500 rounded-lg p-1 text-white shadow-xl"
                      >
                        <option value={NFTStandard.pureArc3}>Pure ARC3</option>
                        <option value={NFTStandard.fracArc3}>
                          Fractional ARC3
                        </option>
                      </select>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <textarea
                        ref={item.refs.description}
                        id={item.data.id + "description"}
                        className="outline-none border-0 w-full break-words focus:border-b-2 focus:border-blue-500 resize-none"
                        placeholder="Description"
                        maxLength={512}
                        onClick={handleInputClick}
                        onChange={handleInputChange}
                      ></textarea>
                    </td>
                    <td className="py-2 border-b border-gray-200 bg-white">
                      <div ref={item.refs.status}>
                        {mintStatus === MintStatus.Ready ? (
                          <button
                            onClick={() => {
                              handleRemoveClick(item.data.id);
                            }}
                            type="button"
                            className="py-2 px-8  bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md outline-none rounded-lg "
                          >
                            Delete
                          </button>
                        ) : mintStatus === MintStatus.InMint ? (
                          <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="mr-2 animate-spin"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                          </svg>
                        ) : mintStatus === MintStatus.Completed &&
                          assets.length === nftDataArray.length ? (
                          <div className="pb-2">
                            <p className="text-sm">
                              Asset ID:
                              <span>
                                <Link
                                  href={assets[i].url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-500"
                                >
                                  {assets[i].assetId}
                                </Link>
                              </span>
                            </p>
                            <p className="text-sm">
                              <span>
                                <Link
                                  href={
                                    "https://ipfs.io/ipfs/" + assets[i].assetCid
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-500"
                                >
                                  IPFS Link
                                </Link>
                              </span>
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ImgPreviewModal
        previewImg={previewImg}
        showModal={showImgPreviewModal}
        setShowModal={setShowImgPreviewModal}
      />
      <GroupEditModal
        showModal={showGroupEditModal}
        setShowModal={setShowGroupEditModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default MintNftTable;
