import React, { useState } from 'react';

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState();
  const [selectedCampaign, setSelectedCampaign] = useState();
  return (
    <FilterContext.Provider
      value={{
        filterContext: [filter, setFilter],
        campaignContext: [selectedCampaign, setSelectedCampaign],
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
