'use client';

import clsx from 'clsx';
import React from 'react';

type ImageUploadProps = {
  className?: string;
  wrapperClassName?: string;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;
  fallback?: React.ReactNode;
  placeholder?: React.ReactNode;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  className,
  wrapperClassName,
  inputProps,
  fallback,
  placeholder = 'Upload Image',
}) => {
  const [file, setFile] = React.useState<File>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      setFile(filesArray[0]);
    }

    if (inputProps?.onChange) {
      inputProps.onChange(event);
    }
  };

  return (
    <div className={clsx('group rounded-md overflow-hidden', wrapperClassName)}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        {...inputProps}
        onChange={(e) => {
          handleFileChange(e);
          inputProps?.onChange?.(e);
        }}
      />
      <div className={clsx('relative', className)}>
        <div className="w-16 h-16">
          {file ? (
            <img src={URL.createObjectURL(file)} alt={`logo`} />
          ) : (
            fallback || <></>
          )}
        </div>
        <div className="absolute inset-0 w-full h-full opacity-0 transition-opacity group-hover:opacity-100 bg-black/40 flex justify-center items-center">
          <div className="text-white text-xs text-center font-medium">
            {placeholder}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
