import { Select } from 'components/ui';

function SelectOptions({ options, placehol }) {
  return (
    <Select className="w-[12%]" placeholder={placehol} options={options} />
  );
}

export default SelectOptions;
