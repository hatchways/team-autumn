import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import ContentTemplate from '../../components/ContentTemplate';
import CampaignsAdd from './CampaignsAdd';
import EnhancedDataTable from '../../components/EnhancedDataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import MessageContext from '../../contexts/MessageContext';
import FilterContext from '../../contexts/FilterContext';
import { buttonStyles } from '../../assets/styles';
import transformDate from '../../util/transformDate';
import DialogPopup from '../../components/DialogPopup';

const headCells = [
  { id: '_id', numeric: false, disablePadding: false, label: 'id' },
  { id: 'campaignName', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Creation Date' },
  { id: 'numProspects', numeric: false, disablePadding: false, label: 'Prospects' },
  { id: 'numReached', numeric: false, disablePadding: false, label: 'Reached' },
  { id: 'numReplies', numeric: false, disablePadding: false, label: 'Replies' },
  { id: 'numSteps', numeric: false, disablePadding: false, label: 'Steps' },
];

const transformCampaigns = (campaignList) =>
  campaignList.map((campaign) => ({
    _id: campaign._id,
    campaignName: campaign.name,
    createdAt: transformDate(campaign.creation_date),
    numProspects: campaign.prospects?.length || 0,
    numReached: campaign.num_reached,
    numReplies: campaign.num_reply,
    numSteps: campaign.steps?.length || 0,
  }));

const CampaignsContent = () => {
  const buttonClasses = buttonStyles();

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [campaigns, setCampaigns] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [message, setMessage] = useContext(MessageContext);
  const { filterContext } = useContext(FilterContext);
  const [filter] = filterContext;

  useEffect(() => {
    if (!dialogOpen) {
      setLoading(true);
      fetch('/user/campaigns_list', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((d) => {
          setCampaigns(transformCampaigns(d.response));
          setLoading(false);
        })
        .catch(() => {
          setMessage('There was a problem fetching your campaigns');
          setCampaigns([]);
          setLoading(false);
        });
    }
  }, [setMessage, dialogOpen]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
    setMessage('');
  };

  const filteredCampaigns = campaigns?.filter((c) => c.campaignName.includes(filter));

  const tableProps = {
    headCells,
    data: filteredCampaigns,
    requiresCheckbox: false,
    ariaLabel: 'campaigns',
    initialSortBy: 'createdAt',
    rowsAsLinks: true,
  };

  const actionSlots = [
    <div />,
    <Button
      variant="contained"
      className={`${buttonClasses.base} ${buttonClasses.action}`}
      onClick={() => setDialogOpen(true)}
    >
      Add New Campaign
    </Button>,
  ];

  if (!loading) {
    return (
      <>
        <ContentTemplate
          pageTitle="Campaigns"
          data={filteredCampaigns}
          actionSlots={actionSlots}
          content={<EnhancedDataTable {...tableProps} />}
          snackbarOpen={snackbarOpen}
          handleClose={handleClose}
          message={message}
        />
        <DialogPopup
          actionItem={<CampaignsAdd setOpen={setDialogOpen} />}
          title="New Campaign"
          buttonText="Cancel"
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      </>
    );
  }

  return <LoadingSpinner />;
};

export default CampaignsContent;
