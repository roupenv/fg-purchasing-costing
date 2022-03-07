import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

export default function AlertDialog() {
  const { alertDialog, isAlert, dispatch } = useResourceDetailsContext()!;

  return (
    <Dialog open={isAlert} onClose={() => dispatch({ type: 'exitedWarning' })}>
      <DialogTitle id='alert-dialog-title'>{alertDialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{alertDialog.body}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
