import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface ImgPreviewModalAPI {
  previewImg: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ImgPreviewModal = (props: ImgPreviewModalAPI) => {

  // handle modal click overlay events
  const overlay = useRef(null);
  useEffect(() => {
    if (!props.showModal) return;
    function handleClick(event) {
      if (overlay.current === event.target) props.setShowModal(false);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [props.showModal]);

  return (
    <div>
      {props.showModal ? (
        <div>
          <div
            ref={overlay}
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col items-center justify-center w-full bg-white outline-none focus:outline-none">
                <div className="relative p-6 flex-auto">
                  <img
                    alt="preview image"
                    src={props.previewImg}
                    className="mx-auto object-cover rounded-lg max-h-96"
                  ></img>
                </div>
                <div className="flex items-center justify-center mb-4 w-full">
                  <button
                    onClick={() => props.setShowModal(false)}
                    type="button"
                    className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 w-full mx-8 text-white text-center text-base font-semibold shadow-md rounded-lg "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}
    </div>
  );
};

export default ImgPreviewModal;
