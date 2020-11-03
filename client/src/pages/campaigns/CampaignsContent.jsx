import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../../components/LoadingSpinner';
import EnhancedDataTable from '../../components/EnhancedDataTable';
import transformDate from '../../util/transformDate';

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
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState();

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
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (!loading) {
    return (
      <EnhancedDataTable
        headCells={headCells}
        data={campaigns}
        requiresCheckbox={false}
        initialSortBy="createdAt"
        rowsAsLinks
      />
    );
  }

  return <LoadingSpinner />;
};

export default CampaignsContent;
