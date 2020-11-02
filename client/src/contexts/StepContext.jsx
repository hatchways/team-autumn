import React, { useState } from 'react';

const StepContext = React.createContext();

export const StepProvider = ({ children }) => {
  const [prospects, setProspects] = useState([]);
  const [variables, setVariables] = useState({
    prospects: { firstNames: [], lastNames: [], emails: [] },
    step: { subject: '', body: '' },
  });

  return (
    <StepContext.Provider
      value={{
        prospectsContext: [prospects, setProspects],
        variablesContext: [variables, setVariables],
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export default StepContext;
