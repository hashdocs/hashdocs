import { IconType } from "react-icons";
import CustomTooltip from "../tooltip";
import { ButtonHTMLAttributes } from "react";
import { classNames } from "@/app/_utils/classNames";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface IconButtonProps extends BaseButtonProps {
  ButtonId: string;
  ButtonText: string;
  ButtonIcon: React.ForwardRefExoticComponent<any> | IconType;
  ButtonSize?: number;
  ButtonClassName?: string;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  let {
    ButtonId,
    ButtonText,
    ButtonIcon,
    ButtonSize,
    ButtonClassName,
    onClick,
    ...restProps
  } = props;

  const handleClick = (event: any) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type="button"
      key={ButtonId}
      onClick={handleClick}
      className={classNames(
        "relative inline-flex items-center rounded-md px-2 py-2 text-shade-pencil-dark  hover:bg-stratos-overlay hover:text-stratos-default focus:z-10",
        ButtonClassName ?? ""
      )}
      data-tooltip-id={ButtonId}
      data-tooltip-content={ButtonText}
      {...restProps}
    >
      <span className="sr-only">{ButtonText}</span>
      <ButtonIcon
        className={`h-${ButtonSize ?? 5} w-${ButtonSize ?? 5}`}
        aria-hidden="true"
      />
      {CustomTooltip(ButtonId)}
    </button>
  );
};

export default IconButton;
