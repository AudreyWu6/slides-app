// ParentComponent.jsx
import React, { useState } from 'react';
import TextModal from './TextModal';
import { Button } from '@mui/material';

function ModalBtn ({ update }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
      <>
        <Button onClick={() => setModalOpen(true)}>Add Text</Button>
        <TextModal
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
            update={update}
            isEditing={false}
        />
      </>
  );
}

export default ModalBtn;
