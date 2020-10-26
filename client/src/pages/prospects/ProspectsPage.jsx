import React from 'react';
import { useLocation } from 'react-router-dom';

import DrawerAndContent from '../../components/DrawerAndContent';
import ProspectsDrawer from './ProspectsDrawer';
import ProspectsContent from './ProspectsContent';
import { SearchProvider } from '../../contexts/SearchContext';
import { ProspectUploadProvider } from '../../contexts/ProspectUploadContext';
import ProspectUpload from './ProspectUpload';

const ProspectsPage = () => {
  const location = useLocation();
  return (
    <SearchProvider>
      <ProspectUploadProvider>
        <DrawerAndContent
          drawer={<ProspectsDrawer />}
          content={location.pathname.includes('upload') ? <ProspectUpload /> : <ProspectsContent />}
        />
      </ProspectUploadProvider>
    </SearchProvider>
  );
};

export default ProspectsPage;
