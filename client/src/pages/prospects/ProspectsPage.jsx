import React, { useState } from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import ProspectsDrawer from './ProspectsDrawer';
import ProspectsContent from './ProspectsContent';
import ProspectsContext from '../../contexts/ProspectsContext';

const ProspectsPage = () => {
  const [search, setSearch] = useState('');
  return (
    <ProspectsContext.Provider value={[search, setSearch]}>
      <DrawerAndContent drawer={<ProspectsDrawer />} content={<ProspectsContent />} />
    </ProspectsContext.Provider>
  );
};

export default ProspectsPage;
