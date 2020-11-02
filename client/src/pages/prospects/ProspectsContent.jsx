import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import FilterContext from '../../contexts/FilterContext';
import ContentTemplate from '../../components/ContentTemplate';
import { buttonStyles, tableStyles } from '../../assets/styles';
import UserContext from '../../contexts/UserContext';
import MessageContext from '../../contexts/MessageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const headCells = [
  { id: '_id', numeric: false, disablePadding: false, label: '_id' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const ProspectsContent = () => {
  const buttonClasses = buttonStyles();
  const tableClasses = tableStyles();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { filterContext, itemContext, campaignContext } = useContext(FilterContext);

  const [filter] = filterContext;
  const [selectedItems, setSelectedItems] = itemContext;
  const [selectedCampaign] = campaignContext;

  const [message, setMessage] = useContext(MessageContext);

  useEffect(() => {
    const { text } = message;
    if (text) {
      setOpen(true);
    }
  }, [message, setOpen]);

  const [user] = useContext(UserContext);
  useEffect(() => {
    if (user) {
      fetch(`/prospects`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((d) => {
          const prospects = d.prospects.map((prospect) => ({
            _id: prospect._id,
            email: prospect.email,
            firstName: prospect.first_name,
            lastName: prospect.last_name,
            status: prospect.status,
          }));
          if (prospects.length > 0) {
            setData(prospects);
            setLoading(false);
          }
        })
        .catch((err) => {
          setMessage({ type: 'error', text: `There was a problem fetching prospects` });
          setLoading(false);
        });
    }
  }, [user, setMessage]);

  const filteredData = data.filter((d) => d.email.includes(filter));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setMessage('');
  };

  const handleUploadProspects = () => {
    if (selectedCampaign && selectedItems.length > 0) {
      fetch(`/campaign/${selectedCampaign._id}/prospects_add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prospect_ids: selectedItems }),
      })
        .then((response) => response.json())
        .then((d) => {
          if (d.response.new > 0 && d.response.dups === 0) {
            setMessage({
              type: 'success',
              text: `${d.response.new} prospects successfully added to campaign: ${selectedCampaign.name}`,
            });
          } else if (d.response.new > 0 && d.response.dups > 0) {
            setMessage({
              type: 'success',
              text: `${d.response.new} prospects successfully added to campaign: ${selectedCampaign.name}. Ignored ${d.response.dups} duplicate prospects`,
            });
          } else {
            setMessage({
              type: 'warning',
              text: `No new prospects added to campaign: ${selectedCampaign.name}`,
            });
          }
          setSelectedItems([]);
        })
        .catch((err) => {
          setMessage({ type: 'error', text: `There was a problem uplading the prospects: ${err}` });
        });
    } else if (!selectedCampaign) {
      setMessage({ type: 'warning', text: 'You must select a campaign first' });
    } else if (selectedItems.length === 0) {
      setMessage({ type: 'warning', text: 'You must select at least one prospect to upload' });
    }
  };

  const tableProps = {
    className: tableClasses.table,
    data: filteredData,
    ariaLabel: 'prospects',
    headCells,
    requiresCheckbox: true,
    initialSortBy: 'email',
  };

  const actionSlots = [
    <Button
      className={`${buttonClasses.base} ${buttonClasses.action} ${buttonClasses.extraWide}`}
      onClick={handleUploadProspects}
    >
      Add to Campaign
    </Button>,
    <Button
      variant="contained"
      className={`${buttonClasses.base} ${buttonClasses.action}`}
      onClick={() => history.push('/prospects/upload')}
    >
      Upload Prospects by File
    </Button>,
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ContentTemplate
      pageTitle="Prospects"
      data={data}
      tableProps={tableProps}
      actionSlots={actionSlots}
      snackbarOpen={open}
      handleClose={handleClose}
      message={message}
    />
  );
};

export default ProspectsContent;
