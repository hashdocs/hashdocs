import React from 'react';
import Button from '../button';

import { CgClose } from 'react-icons/cg';

type HeaderProps = {
  title: string;
  onClose: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <Button
        size="sm"
        variant="white"
        className="text-gray-400 !p-1 focus:outline-none"
        onClick={onClose}
      >
        <CgClose />
      </Button>
    </div>
  );
};

export default Header;
