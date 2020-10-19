import React, { useContext } from 'react';

import SearchInput from '../../components/SearchInput';
import ProspectsContext from '../../contexts/ProspectsContext';

const ProspectsDrawer = () => {
  const [search, setSearch] = useContext(ProspectsContext);
  return (
    <>
      <SearchInput search={search} setSearch={setSearch} />
    </>
  );
};

export default ProspectsDrawer;
