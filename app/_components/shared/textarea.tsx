import React, { useState, useEffect } from "react";

const DomainsTextArea = ({
  defaultHeight,
  maxHeight,
  domains = "",
  setDomains
}: {
  defaultHeight: number;
  maxHeight: number;
  domains:string;
  setDomains: Function
}) => {
  const [height, setHeight] = useState(defaultHeight);

  const handleChange = (e:any) => {
    setDomains(e.target.value);

    if (e.target.scrollHeight > height && e.target.scrollHeight < maxHeight) {
      setHeight(e.target.scrollHeight);
    }
  };

  useEffect(() => {
    setHeight(defaultHeight);
  }, [defaultHeight]);

  return (
    <textarea
      value={domains}
      onChange={handleChange}
      className="w-full max-w-[20rem] rounded-md border-0 ml-7 py-1.5 text-sm shadow-inner ring-1 ring-inset ring-shade-line placeholder:text-shade-disabled focus:ring-inset focus:ring-stratos-default "
      placeholder="Add email domains (separated by commas)"
      style={{ height: `${height}px`, maxHeight: `${maxHeight}px`, minHeight: `${height}px` }}
    />
  );
};

export default DomainsTextArea;
