import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import DrawerAndContent from '../../components/DrawerAndContent';
import CampaignsDrawer from './CampaignsDrawer';
import CampaignsContent from './CampaignsContent';
import CampaignDrawer from '../campaign/CampaignDrawer';
import CampaignContent from '../campaign/CampaignContent';
import GoogleAuthPopup from '../../components/GoogleAuthPopup';
import AddStep from '../campaign/AddStep';
import { FilterProvider } from '../../contexts/FilterContext';
import { MessageProvider } from '../../contexts/MessageContext';
import UserContext from '../../contexts/UserContext';
import { StepProvider } from '../../contexts/StepContext';

const CampaignsPage = () => {
  const [open, setOpen] = useState(false);
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (user.hasOwnProperty('gmail_oauthed') && !user.gmail_oauthed) {
      const timeout = setTimeout(() => {
        setOpen(true);
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [user]);

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  return (
    <FilterProvider>
      <MessageProvider>
        <StepProvider>
          {pathSegments.length > 2 ? (
            <DrawerAndContent
              drawer={<CampaignDrawer />}
              content={pathSegments.includes('add_step') ? <AddStep /> : <CampaignContent />}
            />
          ) : (
            <DrawerAndContent drawer={<CampaignsDrawer />} content={<CampaignsContent />} />
          )}
          <GoogleAuthPopup open={open} />
        </StepProvider>
      </MessageProvider>
    </FilterProvider>
  );
};

export default CampaignsPage;
