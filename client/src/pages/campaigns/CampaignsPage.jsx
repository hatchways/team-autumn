import React from 'react';
import { useLocation } from 'react-router-dom';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignsDrawer from './CampaignsDrawer';
import CampaignsContent from './CampaignsContent';
import CampaignDrawer from '../campaign/CampaignDrawer';
import CampaignContent from '../campaign/CampaignContent';
import { FilterProvider } from '../../contexts/FilterContext';
import { MessageProvider } from '../../contexts/MessageContext';

const CampaignsPage = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  console.log(pathSegments);
  return (
    <FilterProvider>
      <MessageProvider>
        <DrawerAndContent
          drawer={pathSegments.length > 2 ? <CampaignDrawer /> : <CampaignsDrawer />}
          content={pathSegments.length > 2 ? <CampaignContent /> : <CampaignsContent />}
        />
      </MessageProvider>
    </FilterProvider>
  );
};

export default CampaignsPage;
