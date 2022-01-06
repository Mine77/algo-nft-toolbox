import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface GroupEditModalAPI {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onSave: (data: { name: string; unit: string; description: string }) => void;
}

const GroupEditModal = (props: GroupEditModalAPI) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSaveClick = () => {
    props.onSave({
      name: nameRef.current.value,
      unit: unitRef.current.value,
      description: descriptionRef.current.value,
    });
    props.setShowModal(false);
  };

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
                <div className="relative py-6 flex-auto">
                  <form className="container max-w-xl mx-auto md:w-3/4">
                    <div className="p-4 rounded-lg bg-opacity-5">
                      <div className="flex flex-col max-w-sm mx-auto md:w-full md:mx-0">
                        <div className="items-center space-x-4">
                          <h1 className="text-gray-800 text-3xl">Group Edit</h1>
                        </div>
                        <div className="items-center space-x-4 py-2">
                          <p className="text-gray-600">
                            Use [id] and [name] to replace part of the
                            string
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 bg-white">
                      <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Name</h2>
                        <div className="max-w-sm mx-auto md:w-2/3">
                          <div className=" relative ">
                            <input
                              ref={nameRef}
                              type="text"
                              className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Unit</h2>
                        <div className="max-w-sm mx-auto md:w-2/3">
                          <div className=" relative ">
                            <input
                              ref={unitRef}
                              type="text"
                              className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">
                          Description
                        </h2>
                        <div className="max-w-sm mx-auto md:w-2/3">
                          <div className=" relative ">
                            <textarea
                              ref={descriptionRef}
                              className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none text-md focus:ring-2 focus:border-transparent resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-center mb-4 w-3/4">
                  <button
                    onClick={handleSaveClick}
                    type="button"
                    className="py-2 px-10 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 w-full mx-8 text-white text-center text-base font-semibold shadow-md rounded-lg "
                  >
                    Save
                  </button>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <button
                    onClick={() => props.setShowModal(false)}
                    type="button"
                    className="py-2 px-10  w-full mx-8 text-blue-600 text-center text-base font-semibold rounded-lg "
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

export default GroupEditModal;
