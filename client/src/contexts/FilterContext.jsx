import React, { useState } from 'react';

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <FilterContext.Provider
      value={{
        filterContext: [filter, setFilter],
        campaignContext: [selectedCampaign, setSelectedCampaign],
        itemContext: [selectedItems, setSelectedItems],
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
