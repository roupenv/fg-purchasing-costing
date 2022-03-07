import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import useLocationHistory from '../../../Hooks/useLocationHistory';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

const authorizationToken = 'Bearer ' + localStorage.getItem('token');


export default function DeleteDialog() {
  const { currentResource, endpoint, history } = useLocationHistory();
  const fetchResource = '/api' + currentResource + '/' + endpoint;

  const { dispatch, isDeleteWarning } = useResourceDetailsContext()!;

  const handleNo = () => {
    dispatch({ type: 'clickedCancelDeleteRecord' });
  };

  const handleYes = () => {
    const deleteRecord = async () => {
      const recordToDelete = await fetch(fetchResource, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationToken,
        },
      });
      const response = await recordToDelete.json();
      return response;
    };

    deleteRecord()
      .then(() => {
        dispatch({
          type: 'clickedConfirmDeleteRecord',
          payload: {
            dialog: {
              title: 'Successful',
              body: 'Record Deleted',
            },
          },
        });
      })
      .then(() => {
        setTimeout(() => history.push('/admin' + currentResource), 2000);
      })
      .catch((e) => {
        console.log('There has been a problem creating new resource: ' + e.message);
      });
  };

  return (
    <Dialog open={isDeleteWarning} onClose={handleNo}>
      <DialogTitle id='delete-dialog-title'>{'Warning: Deleting Record!!'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-dialog-description'>
          Are you sure you want to delete this record?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo}>No</Button>
        <Button variant='contained' color='error' onClick={handleYes} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
