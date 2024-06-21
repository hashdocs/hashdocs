"use client";
import useMobile from "@/app/_utils/useMobile";
import { Fragment } from "react";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const HashdocsToast = () => {
  const { isMobile } = useMobile();
  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#FFFFF",
          fontWeight: "bolder",
          fontSize: "12px",
          borderRadius: "8px",
          width: "fit-content",
          maxWidth: isMobile ? "90%" : "50%",
        },
      }}
      position="top-center"
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <Fragment>
              {icon}
              {message}

              {
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                >
                  <IoClose className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600 " />
                </button>
              }
            </Fragment>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default HashdocsToast;
