// ParentComponent.jsx
import React, { useState } from 'react';
import ElementModal from './ElementModal';
import { Button } from '@mui/material';

function ModalBtn ({ update, type }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button data-cy="edit-slide" onClick={() => setModalOpen(true)}>Add {type}</Button>
      <ElementModal
        type={type}
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        update={update}
        isEditing={false}
      />
    </>
  );
}

export default ModalBtn;
