import React, { useContext, useEffect, useState } from 'react';

import { Button } from '@material-ui/core';
import LoadingSpinner from '../../components/LoadingSpinner';
import transformDate from '../../util/transformDate';
import ContentTemplate from '../../components/ContentTemplate';
import buttonStyles from '../../assets/styles/buttonStyles';
import MessageContext from '../../contexts/MessageContext';

const headCells = [
  { id: '_id', numeric: false, disablePadding: false, label: 'id' },
  { id: 'campaignName', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Creation Date' },
  { id: 'numProspects', numeric: false, disablePadding: false, label: 'Prospects' },
  { id: 'numReplies', numeric: false, disablePadding: false, label: 'Replies' },
  { id: 'numSteps', numeric: false, disablePadding: false, label: 'Steps' },
];

const transformCampaigns = (campaignList) =>
  campaignList.map((campaign) => ({
    _id: campaign._id,
    campaignName: campaign.name,
    createdAt: transformDate(campaign.creation_date),
    numProspects: campaign.prospects.length,
    numReplies: 0,
    numSteps: campaign.steps.length,
  }));

const CampaignsContent = () => {
  const buttonClasses = buttonStyles();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState();

  const [message, setMessage] = useContext(MessageContext);

  useEffect(() => {
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
      .catch((err) => {
        setMessage('There was a problem fetching your campaigns');
        setLoading(false);
      });
  }, [setMessage]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setMessage('');
  };

  const tableProps = {
    headCells,
    data: campaigns,
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
      onClick={() => setFormDialogOpen(true)}
    >
      Add New Campaign
    </Button>,
  ];

  if (!loading) {
    return (
      <ContentTemplate
        pageTitle="Campaigns"
        data={campaigns}
        actionSlots={actionSlots}
        tableProps={tableProps}
        snackbarOpen={open}
        handleClose={handleClose}
        message={message}
      />
    );
  }

  return <LoadingSpinner />;
};

export default CampaignsContent;
