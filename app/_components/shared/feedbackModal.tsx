import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { classNames } from "@/app/_utils/classNames";
import LargeButton from "./buttons/largeButton";
import { toast } from "react-hot-toast";
import { PopupButton } from "react-calendly";
import { UserContext } from "@/app/(application)/_components/userProvider";
import { usePathname } from "next/navigation";

interface FeedbackModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, setIsOpen }) => {
  /*-------------------------------- RENDER ------------------------------*/

  const [feedbackText, setFeedbackText] = useState("");
  const _userContext = useContext(UserContext);
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!_userContext) return null;

  const { user } = _userContext;

  const handleSubmit = () => {
    setIsSubmitting(true);
    const res = fetch("/api/settings/feedback", {
      method: "POST",
      body: JSON.stringify({ feedback: feedbackText, pathname }),
    });

    res
      .then(() => {
        toast.success(
          <p className="font-normal">
            Thank you for your feedback! You will have an update on email within
            24 hrs.
            <br />
            <br />
            If you have additional feedback and can spare time,{" "}
            <PopupButton
              url="https://calendly.com/swapnika/hashdocs"
              prefill={{
                name: user?.user_metadata?.name ?? "",
                email: user?.email,
              }}
              className="text-stratos-default underline"
              /*
               * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
               * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
               */
              rootElement={document.getElementById("app")!}
              text="we'd love to chat with you"
            />
          </p>,
          {
            duration: 5000,
          }
        );
      })
      .catch((err) => {
        toast.error(
          "Something went wrong in submitting the feedback. Please try again"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsOpen(false);
      });

    // toast.promise(feedbackPromise, {
    //   loading: "Submitting feedback...",
    //   success: (
    //     <p>
    //       Thank you for your feedback! You will have an update on email within
    //       24 hrs. If you have more feedback and can spare time, we'd love to
    //       chat with you for 20 min{" "}
    //       <PopupButton
    //         url="https://calendly.com/swapnika/hashdocs"
    //         prefill={{
    //           name: user?.user_metadata?.name ?? "",
    //           email: user?.email,
    //         }}
    //         className="text-stratos-default underline"
    //         /*
    //          * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
    //          * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
    //          */
    //         rootElement={document.getElementById("app")!}
    //         text="we'd love to chat with you"
    //       />
    //     </p>
    //   ),
    //   error: "Something went wrong in submitting the feedback.",
    // });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="z-100 relative" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-shade-overlay bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <form
          className="z-100 fixed inset-0 overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <div className="flex min-h-full items-center justify-center text-left">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {
                <Dialog.Panel className="relative flex w-full max-w-xl transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
                  <div className="flex flex-col items-start justify-between gap-y-6">
                    <div className="flex flex-col justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-left font-semibold uppercase leading-6"
                      >
                        {"Feedback"}
                      </Dialog.Title>
                      <Dialog.Description className="text-left text-xs text-shade-pencil-light">
                        {
                          "We really appreciate your feedback. Please suggest features, improvements, bugs or anything else you'd like to solve for you."
                        }
                      </Dialog.Description>
                    </div>
                    <textarea
                      name="feedback"
                      id="feedback"
                      autoFocus
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className={classNames(
                        "w-full rounded-md border-0 py-2 text-sm shadow-inner ring-1 ring-inset ring-shade-line placeholder:text-shade-disabled focus:ring-inset focus:ring-stratos-default "
                      )}
                      placeholder="Tell us your feedback"
                      style={{
                        height: `${128}px`,
                        maxHeight: `128px`,
                        minHeight: `128px`,
                      }}
                    />
                    <div className="flex w-full items-center justify-end">
                      <LargeButton
                        ButtonId={""}
                        ButtonText={
                          isSubmitting ? "Submitting..." : "Submit feedback"
                        }
                        onClick={handleSubmit}
                        ButtonClassName="bg-stratos-default hover:bg-stratos-default/80 disabled:bg-stratos-default/50"
                        disabled={feedbackText.length == 0 || isSubmitting}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              }
            </Transition.Child>
          </div>
        </form>
      </Dialog>
    </Transition.Root>
  );
};

export default FeedbackModal;
