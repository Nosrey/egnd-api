import React from 'react';

function SelectOptions({ options, periodo }) {
  return <Select placeholder={periodo} options={options} />;
}

export default SelectOptions;
