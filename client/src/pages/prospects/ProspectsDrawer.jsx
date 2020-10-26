import React, { useContext } from 'react';

import SearchInput from '../../components/SearchInput';
import SearchContext from '../../contexts/SearchContext';

const ProspectsDrawer = () => {
  const [search, setSearch] = useContext(SearchContext);
  return (
    <>
      <SearchInput search={search} setSearch={setSearch} />
    </>
  );
};

export default ProspectsDrawer;
