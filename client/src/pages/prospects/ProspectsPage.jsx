import React from 'react';
import { useLocation } from 'react-router-dom';

import DrawerAndContent from '../../components/DrawerAndContent';
import ProspectsDrawer from './ProspectsDrawer';
import ProspectsContent from './ProspectsContent';
import { FilterProvider } from '../../contexts/FilterContext';
import { ProspectUploadProvider } from '../../contexts/ProspectUploadContext';
import ProspectUploadContent from './ProspectUploadContent';
import ProspectUploadDrawer from './ProspectUploadDrawer';

const ProspectsPage = () => {
  const location = useLocation();
  return (
    <FilterProvider>
      <ProspectUploadProvider>
        {location.pathname.includes('upload') ? (
          <DrawerAndContent drawer={<ProspectUploadDrawer />} content={<ProspectUploadContent />} />
        ) : (
          <DrawerAndContent drawer={<ProspectsDrawer />} content={ProspectsContent} />
        )}
      </ProspectUploadProvider>
    </FilterProvider>
  );
};

export default ProspectsPage;
