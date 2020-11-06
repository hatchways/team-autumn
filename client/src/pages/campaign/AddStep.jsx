import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useLocation, useHistory } from 'react-router-dom';

import StepEditor from '../../components/StepEditor';
import ContentTemplate from '../../components/ContentTemplate';
import StepContext from '../../contexts/StepContext';
import MessageContext from '../../contexts/MessageContext';
import { buttonStyles } from '../../assets/styles';

const AddStep = () => {
  const classes = buttonStyles();

  const [data] = useState();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { variablesContext } = useContext(StepContext);
  const [variables, setVariables] = variablesContext;

  const [message, setMessage] = useContext(MessageContext);

  const history = useHistory();
  const location = useLocation();

  const campaignId = location.pathname.split('/')[2];

  const handleAddStep = () => {
    if (variables.step.subject === '') {
      setMessage({ type: 'warning', text: 'Subject cannot be blank' });
    } else if (variables.step.body === '') {
      setMessage({ type: 'warning', text: 'Email body cannot be blank' });
    } else {
      setSubmitting(true);
      fetch(`/campaign/${campaignId}/steps_add`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: variables.step.body, subject: variables.step.subject }),
      })
        .then((response) => response.json())
        .then(() => {
          setSubmitting(false);
          setMessage({ type: 'success', text: 'Email successfully added!' });
          history.push(`/campaigns/${campaignId}`);
        })
        .catch(() => {
          setSubmitting(false);
          setMessage({ type: 'error', text: 'There was a problem uploading your email' });
        });
    }
    // upload step
  };

  return (
    <ContentTemplate
      pageTitle="Add Email Step"
      data={data || []}
      actionSlots={[
        <div />,
        <Button
          className={`${classes.base} ${classes.action} ${classes.extraWide}`}
          onClick={handleAddStep}
          disabled={submitting}
        >
          Finish Step
        </Button>,
      ]}
      content={
        <StepEditor variables={variables} setVariables={setVariables} setMessage={setMessage} />
      }
      snackbarOpen={open}
      handleClose={() => setOpen(false)}
      message={message}
    />
  );
};
export default AddStep;
