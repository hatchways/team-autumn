import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import StepEditor from '../../components/StepEditor';
import ContentTemplate from '../../components/ContentTemplate';

const AddStep = () => {
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);

  const save = (contents) => {
    setData(JSON.parse(contents));
    console.log(JSON.parse(contents));
  };

  return (
    <ContentTemplate
      pageTitle="Add Email Step"
      data={data || []}
      actionSlots={[<Button>test</Button>, <Button>test 2</Button>]}
      content={<StepEditor save={save} />}
      snackbarOpen={open}
      handleClose={() => setOpen(false)}
      message="Hello World"
    />
  );
};
export default AddStep;
