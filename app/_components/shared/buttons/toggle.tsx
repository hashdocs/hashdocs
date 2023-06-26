"use client";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import toast from "react-hot-toast";
import CustomTooltip from "../tooltip";
import {
  classNames,
} from "@/app/_utils/classNames";

type ToggleProps = {
  toggleId: string;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  onToggle?: (checked: boolean) => Promise<unknown>;
  DisabledHoverText?: string;
  EnabledHoverText?: string;
  SuccessToastText?: JSX.Element | string;
  LoadingToastText?: JSX.Element | string;
  ErrorToastText?: JSX.Element | string;
  isDisabled?: boolean;
  Label?: string | null;
};

const Toggle: React.FC<ToggleProps> = ({
  toggleId,
  isChecked,
  setIsChecked,
  onToggle,
  EnabledHoverText,
  DisabledHoverText,
  SuccessToastText,
  LoadingToastText,
  ErrorToastText,
  isDisabled = false,
  Label = null,
}) => {
  const [isLoading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (!onToggle) return;
    // Set loading to true
    setLoading(true);

    setIsChecked(checked);

    const toastPromiseText = {
      loading: LoadingToastText ?? "Updating...",
      success: SuccessToastText ?? "Successfully updated",
      error: ErrorToastText ?? "Error in updating. Please try again!",
    };


    toast
      .promise(onToggle(checked), toastPromiseText)
      .catch((error) => {
        console.error(error);
        setIsChecked(!checked);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Switch.Group key={toggleId}>
      <div
        className={classNames(
          "flex items-center",
          Label
            ? "rounded-xl border border-b-shade-line px-2 py-1 shadow-inner"
            : ""
        )}
      >
        <Switch
          checked={isChecked}
          onChange={handleToggle}
          disabled={isLoading || isDisabled || !onToggle}
          data-tooltip-id={toggleId}
          data-tooltip-content={
            isChecked ? EnabledHoverText : DisabledHoverText
          }
          className={classNames(
            isChecked
              ? !isDisabled
                ? "bg-stratos-gradient"
                : "bg-shade-disabled"
              : "bg-shade-line",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer",
            "pointer-events-auto relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
          )}
        >
          <span
            className={classNames(
              isChecked ? "translate-x-5" : "translate-x-0",
              "pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          >
            <span
              className={classNames(
                isChecked
                  ? "opacity-0 duration-100 ease-out"
                  : "opacity-100 duration-200 ease-in",
                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
              )}
              aria-hidden="true"
            >
              <svg
                className="h-3 w-3 text-shade-pencil-light"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={classNames(
                isChecked
                  ? "opacity-100 duration-200 ease-in"
                  : "opacity-0 duration-100 ease-out",
                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
              )}
              aria-hidden="true"
            >
              <svg
                className={`h-3 w-3 ${
                  !isDisabled
                    ? "text-stratos-default"
                    : "text-shade-pencil-light"
                }}`}
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            </span>
          </span>
          {CustomTooltip(toggleId)}
        </Switch>
        {Label ? (
          <Switch.Label
            className={classNames(
              "ml-4 text-xs text-left font-semibold leading-6 w-[120px] truncate",
              isChecked ? "text-stratos-default" : "text-shade-pencil-light"
            )}
          >
            {Label}
          </Switch.Label>
        ) : null}
      </div>
    </Switch.Group>
  );
};

export default Toggle;
