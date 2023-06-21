import CustomTooltip from "../tooltip";
import { ButtonHTMLAttributes } from "react";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface IconButtonProps extends BaseButtonProps {
  ButtonId: string;
  ButtonText: string;
  ButtonIcon: React.ForwardRefExoticComponent<any>;
  ButtonSize?: number;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  let { ButtonId, ButtonText, ButtonIcon, ButtonSize, onClick, ...restProps } =
    props;

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
      className="relative inline-flex items-center rounded-md px-2 py-2 text-shade-pencil-dark  hover:bg-stratos-overlay hover:text-stratos-default focus:z-10"
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
