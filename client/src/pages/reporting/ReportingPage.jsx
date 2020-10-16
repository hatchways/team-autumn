import React from 'react';

import DrawerAndContent from '../../components/DrawerAndContent';
import ReportingDrawer from './ReportingDrawer';
import ReportingContent from './ReportingContent';

const ReportingPage = () => (
  <DrawerAndContent drawer={<ReportingDrawer />} content={<ReportingContent />} />
);

export default ReportingPage;
