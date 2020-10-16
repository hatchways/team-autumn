import React from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import ProfileDrawer from './ProfileDrawer';
import ProfileContent from './ProfileContent';

const ProfilePage = () => (
  <DrawerAndContent drawer={<ProfileDrawer />} content={<ProfileContent />} />
);

export default ProfilePage;
