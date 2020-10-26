import React, { useState } from 'react';

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState('');
  return <FilterContext.Provider value={[filter, setFilter]}>{children}</FilterContext.Provider>;
};

export default FilterContext;
