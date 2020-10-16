import React from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignsDrawer from './CampaignsDrawer';
import CampaignsContent from './CampaignsContent';

const CampaignsPage = () => (
  <DrawerAndContent drawer={<CampaignsDrawer />} content={<CampaignsContent />} />
);

export default CampaignsPage;
