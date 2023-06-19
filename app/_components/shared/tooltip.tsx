import { Tooltip } from "react-tooltip";

export default function CustomTooltip(TooltipId: string):React.JSX.Element {
    return <Tooltip
      id={TooltipId}
      style={{
        fontSize: 12,
        backgroundColor: "rgb(37,41,51)",
        opacity: 1,
        padding: "5px 10px 5px 10px",
        borderRadius: "6px",
      }}
      classNameArrow="hidden"
      place="bottom" />;
  }
  