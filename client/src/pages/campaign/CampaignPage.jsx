import React from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignContent from './CampaignContent';
import CampaignDrawer from './CampaignDrawer';
import { StepProvider } from '../../contexts/StepContext';

const CampaignPage = () => (
  <StepProvider>
    <DrawerAndContent drawer={<CampaignDrawer />} content={<CampaignContent />} />
  </StepProvider>
);

export default CampaignPage;
