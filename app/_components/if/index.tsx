import React from 'react';

type IfProps = {
  _condition: boolean;
  _then: React.ReactNode;
  _else?: React.ReactNode;
};

const If: React.FC<IfProps> = ({ _condition, _then, _else = null }) => {
  return _condition ? _then : _else;
};

export default If;
