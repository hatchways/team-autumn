import React from 'react';
import { useLocation } from 'react-router-dom';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignsDrawer from './CampaignsDrawer';
import CampaignsContent from './CampaignsContent';
import CampaignDrawer from '../campaign/CampaignDrawer';
import CampaignContent from '../campaign/CampaignContent';
import { FilterProvider } from '../../contexts/FilterContext';

const CampaignsPage = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  console.log(pathSegments);
  return (
    <FilterProvider>
      <DrawerAndContent
        drawer={pathSegments.length > 2 ? <CampaignDrawer /> : <CampaignsDrawer />}
        content={pathSegments.length > 2 ? <CampaignContent /> : <CampaignsContent />}
      />
    </FilterProvider>
  );
};

export default CampaignsPage;
