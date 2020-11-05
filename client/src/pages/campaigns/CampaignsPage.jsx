import React from 'react';
import { useLocation } from 'react-router-dom';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignsDrawer from './CampaignsDrawer';
import CampaignsContent from './CampaignsContent';
import CampaignDrawer from '../campaign/CampaignDrawer';
import CampaignContent from '../campaign/CampaignContent';
import AddStep from '../campaign/AddStep';
import { FilterProvider } from '../../contexts/FilterContext';
import { MessageProvider } from '../../contexts/MessageContext';

const CampaignsPage = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  return (
    <FilterProvider>
      <MessageProvider>
        {pathSegments.length > 2 ? (
          <DrawerAndContent
            drawer={<CampaignDrawer />}
            content={pathSegments.includes('add_step') ? <AddStep /> : <CampaignContent />}
          />
        ) : (
          <DrawerAndContent drawer={<CampaignsDrawer />} content={<CampaignsContent />} />
        )}
      </MessageProvider>
    </FilterProvider>
  );
};

export default CampaignsPage;
