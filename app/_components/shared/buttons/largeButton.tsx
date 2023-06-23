import { ButtonHTMLAttributes } from "react";
import CustomTooltip from "../tooltip";
import { classNames } from "@/app/_utils/classNames";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface LargeButtonProps extends BaseButtonProps {
  ButtonId: string;
  ButtonText: string;
  ButtonIcon?: React.ForwardRefExoticComponent<any>;
  ButtonClassName?: string;
}

const LargeButton: React.FC<LargeButtonProps> = (props) => {
  const { ButtonId, ButtonText, ButtonIcon, ButtonClassName = "", ...restProps } = props;

  return (
    <button
      type="button"
      key={ButtonId}
      className={classNames("flex items-center rounded-md bg-stratos-default px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stratos-default/80",ButtonClassName)}
      // data-tooltip-id="button-tooltip"
      // data-tooltip-content="test tooltip"
      {...restProps}
    >
      {ButtonText}
      {ButtonIcon && <ButtonIcon className="ml-2 h-5 w-5" />}
      {/* {CustomTooltip(ButtonId)} */}
    </button>
  );
};

export default LargeButton;
