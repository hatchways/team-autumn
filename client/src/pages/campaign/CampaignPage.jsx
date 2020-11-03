import React from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignContent from './CampaignContent';
import CampaignDrawer from './CampaignDrawer';

const CampaignPage = () => (
  <DrawerAndContent drawer={<CampaignDrawer />} content={<CampaignContent />} />
);

export default CampaignPage;
