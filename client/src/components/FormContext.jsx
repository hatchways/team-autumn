import React, { useState } from 'react';

const FormContext = React.createContext();

export const FormProvider = ({ children }) => {
  const [values, setValues] = useState({});
  return <FormContext.Provider value={[values, setValues]}>{children}</FormContext.Provider>;
};

export default FormContext;
