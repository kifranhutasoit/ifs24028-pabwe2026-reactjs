import { useState } from 'react';

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  const onValueChangeHandler = (event) => {
    setValue(event.target.value);
  };

  const resetValue = () => {
    setValue(defaultValue);
  };

  return [value, onValueChangeHandler, resetValue];
}

export default useInput;