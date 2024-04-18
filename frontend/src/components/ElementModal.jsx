import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { FormControl } from '@mui/base';

function parsePercentage (value) {
  if (value) {
    return parseInt(value);
  }
  return '';
}
function getInitialState (type) {
  switch (type) {
    case 'text':
      return {
        text: '',
        fontSize: '',
        color: '',
        position: { x: 0, y: 0 },
        zIndex: 0,
      };
    case 'image':
      return {
        url: '',
        alt: '',
        position: { x: 0, y: 0 },
        zIndex: 0,
      };
    case 'video':
      return {
        url: '',
        autoPlay: false,
        position: { x: 0, y: 0 },
        zIndex: 0,
      };
    case 'code':
      return {
        code: '',
        language: 'javascript',
        position: { x: 0, y: 0 },
        zIndex: 0,
      };
    case 'audio':
      return {
        url: '',
        autoPlay: false,
        position: { x: 0, y: 0 },
        zIndex: 0,
      };

    default:
      return {};
  }
}

function ElementModal ({ type, open, handleClose, update, isEditing = false, initialData = null }) {
  // console.log('modal', initialData);
  const [data, setData] = useState(initialData || getInitialState(type));
  useEffect(() => {
    if (isEditing && initialData) {
      setData(initialData);
    } else {
      setData(getInitialState(type));
    }
  }, [isEditing, initialData, type]);
  // console.log('modal-data', data);
  const handleSubmit = () => {
    update(data);
    handleClose();
  };
  switch (type) {
    case 'text':
      return (
        <Modal open={open} onClose={handleClose}>
          <Box sx={{
            position: 'absolute',
            top: '200px',
            left: '10px',
            background: 'white',
            padding: '20px',
            display: 'flex',
            width: '270px',
            flexDirection: 'column',
            gap: 2
          }}>
            <Typography variant="h6">{isEditing ? 'Edit text' : 'Add text'}</Typography>
            {!isEditing && (
              <TextField
                label="size (%)"
                data-cy="edit-slide-text-size"
                value={parsePercentage(data.width)}
                onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })}
              />
            )}
            <TextField
              label="text"
              data-cy="edit-slide-text-text"
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
            />
            <TextField
              label="font size (em)"
              data-cy="edit-slide-text-fontsize"
              value={data.fontSize}
              onChange={(e) => setData({ ...data, fontSize: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel id="font-family-select-label">Font</InputLabel>
              <Select
                labelId="font-family-select-label"
                id="font-family-select"
                value={data.fontFamily || 'Arial'}
                onChange={(e) => setData({ ...data, fontFamily: e.target.value })}
                fullWidth
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Verdana">Verdana</MenuItem>
                <MenuItem value="Helvetica">Helvetica</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="color (#HEX)"
              value={data.color}
              onChange={(e) => setData({ ...data, color: e.target.value })}
            />
            <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
          </Box>
        </Modal>
      );
    case 'image':
      return (
        <>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '200px',
              left: '10px',
              width: '270px',
              background: 'white',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6">{isEditing ? 'Edit image' : 'Add image'}</Typography>
              {!isEditing && (
              <TextField
                label="size (%)"
                value={parsePercentage(data.width)}
                onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })}/>
              )}
              <TextField
                fullWidth
                label="image URL or Base64"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
              <TextField
                fullWidth
                label="description"
                value={data.alt}
                onChange={(e) => setData({ ...data, alt: e.target.value })}
              />
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
            </Box>
          </Modal>
        </>
      )
    case 'video':
      return (
        <>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '200px',
              left: '10px',
              width: '270px',
              background: 'white',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6">{isEditing ? 'Edit video' : 'Add video'}</Typography>
              <TextField
                fullWidth
                label="video URL"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
              {!isEditing && (
              <TextField label="size (%)"
                         value={parsePercentage(data.width)}
                         onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })}/>
              )}
              <FormControlLabel
                control={<Switch checked={data.autoPlay}
                                 value={data.autoPlay}
                                 onChange={(e) => setData({ ...data, autoPlay: e.target.checked })}/>}
                label="autoPlay"
              />
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
            </Box>
          </Modal>
        </>
      );

    case 'code':
      return (
        <>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '200px',
              left: '10px',
              width: '270px',
              background: 'white',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6">{isEditing ? 'Edit code' : 'Add code'}</Typography>
              <Select
                fullWidth
                value={data.language}
                onChange={(e) => setData({ ...data, language: e.target.value })}
                displayEmpty
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="c">C</MenuItem>
              </Select>
              <TextField
                fullWidth
                label="Font Size (em)"
                value={data.fontSize}
                onChange={(e) => setData({ ...data, fontSize: e.target.value })}
              />
              {!isEditing && (
              <TextField label="size (%)"
                         value={parsePercentage(data.width)}
                         onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })}/>
              )}
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Code"
                value={data.code}
                onChange={(e) => setData({ ...data, code: e.target.value })}
              />
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
            </Box>
          </Modal>
        </>
      );
    case 'audio':
      return (
        <>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '200px',
              left: '10px',
              width: '270px',
              background: 'white',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6">{isEditing ? 'Edit audio' : 'Add audio'}</Typography>
              <TextField
                fullWidth
                label="Audio URL"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
              {!isEditing && (
                <TextField label="size (%)"
                           value={parsePercentage(data.width)}
                           onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })}/>
              )}
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
            </Box>
          </Modal>
        </>
      );
    default:
      return null;
  }
}

export default ElementModal;
