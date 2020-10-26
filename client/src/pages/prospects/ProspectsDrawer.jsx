import React, { useContext } from 'react';

import SearchInput from '../../components/SearchInput';
import FilterContext from '../../contexts/FilterContext';

const ProspectsDrawer = () => {
  const [filter, setFilter] = useContext(FilterContext);
  return (
    <>
      <SearchInput search={filter} setSearch={setFilter} />
    </>
  );
};

export default ProspectsDrawer;
