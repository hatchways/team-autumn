import React from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import TemplatesDrawer from './TemplatesDrawer';
import TemplatesContent from './TemplatesContent';

const TemplatesPage = () => (
  <DrawerAndContent drawer={<TemplatesDrawer />} content={<TemplatesContent />} />
);

export default TemplatesPage;
