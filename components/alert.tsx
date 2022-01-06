import { useContext } from "react";
import AlertContext from "./context/alertContext";

const Alert = () => {
  const alert = useContext(AlertContext);

  const commonStyle = {
    divStyle: "border-l-4 p-4 max-w-md",
    svgStyle: "h-4 w-4",
  };
  const style = {
    success: {
      divStyle:
        "bg-green-200 border-green-600 text-green-600 " + commonStyle.divStyle,
      svgStyle: "text-green-700 " + commonStyle.svgStyle,
    },
    error: {
      divStyle:
        "bg-red-200 border-red-600 text-red-600 " + commonStyle.divStyle,
      svgStyle: "text-red-700 " + commonStyle.svgStyle,
    },
  };
  
  if (alert.alert !== "NONE") {
    return (
      <div className="bottom-0 left-0 border-0 m-10 fixed z-50 rounded-md shadow-lg overflow-y-auto">
        <div
          className={
            alert.alert === "SUCCESS"
              ? style.success.divStyle
              : style.error.divStyle
          }
          role="alert"
        >
          <div className="flex flex-row items-center justify-center">
            <p className="font-bold text-lg">
              {alert.alert === "SUCCESS" ? "Success" : "Error"}
            </p>
            <button
              className=" flex top-0 bottom-0 right-0 ml-auto px-2 py-1"
              onClick={() => {
                alert.clear();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                fill="currentColor"
                className={
                  alert.alert === "SUCCESS"
                    ? style.success.svgStyle
                    : style.error.svgStyle
                }
                viewBox="0 0 1792 1792"
              >
                <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"></path>
              </svg>
            </button>
          </div>
          <p className="text-sm break-all">{alert.alertText}</p>
        </div>
      </div>
    );
  } else return null;
};

export default Alert;
