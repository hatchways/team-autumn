/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';

import SearchInput from '../../components/SearchInput';
import FilterContext from '../../contexts/FilterContext';

const CampaignsDrawer = () => {
  const { filterContext } = useContext(FilterContext);

  const [filter, setFilter] = filterContext;
  return (
    <>
      <SearchInput search={filter} setSearch={setFilter} />
    </>
  );
};

export default CampaignsDrawer;
