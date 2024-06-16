import { classNames } from "@/app/_utils/classNames";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface MediumButtonProps extends BaseButtonProps {
  ButtonId: string;
  ButtonText: string;
  ButtonIcon: React.ForwardRefExoticComponent<any>;
  ButtonSize?: number;
  ButtonHref?: Url;
  ButtonClassName?: string;
}

const MediumButton: React.FC<MediumButtonProps> = (props) => {
  let {
    ButtonId,
    ButtonText,
    ButtonIcon,
    ButtonSize,
    ButtonHref = "",
    ButtonClassName = "",
    ...restProps
  } = props;

  return (
    <Link href={ButtonHref}>
      <button
        type="button"
        key={ButtonId}
        className={classNames(
          "flex shrink-0 items-center space-x-2 rounded-md border border-shade-line bg-white px-2  py-1 text-xs font-semibold text-shade-pencil-dark  hover:border-stratos-50 hover:bg-gray-50 hover:text-stratos-default",
          ButtonClassName
        )}
        data-tooltip-id={ButtonId}
        data-tooltip-content={ButtonText}
        {...restProps}
      >
        <ButtonIcon
          className={`h-${ButtonSize ?? 5} w-${ButtonSize ?? 5}`}
          aria-hidden="true"
        />
        <span className="">{ButtonText}</span>
        {/* {CustomTooltip(ButtonId)} */}
      </button>
    </Link>
  );
};

export default MediumButton;
