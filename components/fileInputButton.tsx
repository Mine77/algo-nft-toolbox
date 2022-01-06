import { useContext, useRef, useState } from "react";
import AlertContext from "./context/alertContext";

const FileInputButton = (props) => {
  const alert = useContext(AlertContext)

  const buttonStyle =
    props.style +
    "outline-none py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg";
  const uploadSvg = (
    <svg
      width="20"
      height="20"
      fill="currentColor"
      className="mr-2"
      viewBox="0 0 1792 1792"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"></path>
    </svg>
  );
  const loadingSvg = (
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
  );
  const [loadingFiles, setLoadingFiles] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const ReadFile = (file) => {
    var p = new Promise<string | ArrayBuffer>((resolve) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        alert.error(`Error occurred reading file: ${file.name}`);
      };
    });
    return p;
  };

  const handleFiles = async (e) => {
    setLoadingFiles(true);
    const fileList = e.target.files;
    
    var dataSet = [];
    for (let i = 0; i < fileList.length; i++) {
      const image = await ReadFile(fileList[i]);
      const imageName = fileList[i].name.split(".")[0];
      const data = { name: imageName, image: image, imgFile:fileList[i] };
      dataSet.push(data);
    }
    inputFile.current.value = null;
    props.onDataChange(dataSet);
    setLoadingFiles(false);
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        accept="image/png, image/jpeg"
        multiple
        onChange={handleFiles}
      />
      {loadingFiles ? (
        <button type="button" className={buttonStyle}>
          {uploadSvg}
          {loadingSvg}
        </button>
      ) : (
        <button
          type="submit"
          className={buttonStyle}
          onClick={() => {
            inputFile.current.click();
          }}
        >
          {uploadSvg}
          {props.text}
        </button>
      )}
    </div>
  );
};

export default FileInputButton;
