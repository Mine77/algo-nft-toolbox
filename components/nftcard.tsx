import { NextPage } from "next";

interface Props {
  Standard:string,
  Name:string,
  Description:string,
  NFTID:string,
  CreatedTime:string
}

const NftCard:NextPage<Props> = (props) => {
  return (
    <div className="overflow-hidden shadow-lg rounded-lg h-90 w-90 md:w-80 cursor-pointer m-auto">
      <a
        href={"https://algoexplorer.io/asset/" + props.NFTID}
        target="_blank"
        rel="noreferrer"
        className="w-full block h-full"
      >
        <img
          alt="blog photo"
          src="/images/blog/1.jpg"
          className="h-50 w-50 object-cover"
        />
        <div className="bg-white dark:bg-gray-800 w-full p-4">
          <div className="flex flex-row items-center">
            <p className="text-gray-800 dark:text-white text-xl font-medium">
              {props.Name}
            </p>
            <p className="px-4 text-base rounded-full text-blue-600  bg-blue-200 ml-auto">
              {props.Standard}
            </p>
          </div>
          <p className="text-blue-500 text-sm font-medium mb-2">
            NFT ID: {props.NFTID}
          </p>
          <p className="text-gray-400 dark:text-gray-300 font-light text-md">
            {props.Description}
          </p>
          <div className="flex items-center mt-4">
            <div className="flex flex-col justify-between text-sm">
              <p className="text-gray-400 dark:text-gray-300">
                {props.CreatedTime}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default NftCard;
