import React, { useContext } from 'react';

import SearchInput from '../../components/SearchInput';
import ProspectsContext from '../../contexts/ProspectsContext';

const ProspectsDrawer = () => {
  const [search, setSearch] = useContext(ProspectsContext);
  return (
    <>
      <form>
        <SearchInput search={search} setSearch={setSearch} />
      </form>
    </>
  );
};

export default ProspectsDrawer;
