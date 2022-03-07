import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import React, { useEffect } from 'react';
import useLocationHistory from '../../Hooks/useLocationHistory';
import useResourceDetailsContext from './Hooks/useResourceDetailsContext';
import * as yup from 'yup';
interface IRecordActionBtnGroup<T extends yup.AnyObjectSchema> {
  schemaValidation: yup.InferType<T>;
}

const authorizationToken = 'Bearer ' + localStorage.getItem('token');

export default function RecordActionBtnGroup<T extends yup.AnyObjectSchema>({ schemaValidation }: IRecordActionBtnGroup<T>) {
  const { resourceData, isEditMode, originalData, dispatch } = useResourceDetailsContext()!;

  const { currentResource, endpoint, history } = useLocationHistory();

  const fetchResource = '/api' + currentResource + '/' + endpoint;

  const handleOnEdit = () => {
    dispatch({ type: 'clickedEdited' });
  };

  useEffect(() => {
    if (endpoint === 'new') {
      dispatch({ type: 'startedNewRecord' });
    }
  }, [endpoint, dispatch]);

  const handleChangeRecord = async (direction: string) => {
    const response = await fetch(`${fetchResource}/${direction}`, {
      headers: {
        Authorization: authorizationToken,
      },
    });
    const responseData = await response.json();
    if (response.status === 400) {
      dispatch({
        type: 'clickedChangeRecord',
        payload: {
          fetchResourceStatus: 'warning',
          dialog: {
            title: 'Warning!',
            body: responseData.message,
          },
        },
      });
    } else {
      history.push(`/admin${currentResource}/${responseData.id}`);
    }
  };

  const handleOnCancel = () => {
    dispatch({ type: 'clickedCancelEdit' });
  };

  const handleOnDeleteRecord = () => {
    dispatch({ type: 'clickedDeleteRecord' });
  };

  const handleOnSave = async () => {
    const sendData = async (payload: object) => {
      const sendData = await fetch(fetchResource, {
        method: endpoint === 'new' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationToken,
        },
        body: JSON.stringify(payload),
      });
      const response = await sendData.json();
      if (!sendData.ok) {
        throw new Error(response.message);
      }
      return response;
    };

    const newResourceTimeoutAction = (saveConfirmed: 'success' | 'error', newId?: string) => {
      setTimeout(() => {
        dispatch({
          type: 'saveConfirmed',
          payload: {
            status: saveConfirmed,
          },
        });
        history.push(`/admin${currentResource}/${newId ? newId : 'new'}`);
      }, 3000);
    };

    const existingResourceTimeoutAction = (saveConfirmed: 'success' | 'error') => {
      setTimeout(() => {
        dispatch({
          type: 'saveConfirmed',
          payload: {
            status: saveConfirmed,
          },
        });
      }, 3000);
    };

    if (resourceData === originalData && endpoint !== 'new') {
      dispatch({
        type: 'clickedSave',
        payload: {
          dialog: {
            title: 'Heads Up!',
            body: 'Nothing to Save',
          },
        },
      });
      return;
    } else {
      try {
        const validatedResourceData = await schemaValidation.validate(resourceData);
        const response = await sendData(validatedResourceData);
        dispatch({
          type: 'clickedSave',
          payload: {
            fetchResourceStatus: 'success',
            dialog: {
              title: 'Success!',
              body: response.message,
            },
          },
        });
        endpoint === 'new'
          ? newResourceTimeoutAction('success', response.newId)
          : existingResourceTimeoutAction('success');
      } catch (e: any) {
        if (e.name === 'ValidationError') {
          console.log(e.path);
          console.log(e.errors);
        } else {
          console.log('There has been a problem creating new resource: ' + e.message);
        }
        dispatch({
          type: 'clickedSave',
          payload: {
            fetchResourceStatus: 'error',
            dialog: {
              title: 'Oh No!',
              body: e.message,
            },
          },
        });
        endpoint === 'new' ? newResourceTimeoutAction('error') : existingResourceTimeoutAction('error');
      }
    }
  };

  return (
    <Stack direction='row' spacing={1}>
      <ButtonGroup variant='outlined' size='small'>
        <Button
          variant='contained'
          color={isEditMode ? 'primary' : 'secondary'}
          startIcon={isEditMode ? <SaveIcon /> : <EditIcon />}
          onClick={isEditMode ? handleOnSave : handleOnEdit}
        >
          {isEditMode ? 'save' : 'edit'}
        </Button>
        {!isEditMode && (
          <Button variant='contained' color='error' onClick={handleOnDeleteRecord}>
            <DeleteIcon />
          </Button>
        )}
        {isEditMode && (
          <Button
            variant='contained'
            color={isEditMode ? 'primary' : 'secondary'}
            startIcon={<CancelIcon />}
            onClick={handleOnCancel}
          >
            Cancel
          </Button>
        )}
      </ButtonGroup>

      <ButtonGroup variant='outlined' size='small'>
        <Button onClick={() => handleChangeRecord('previous')}>
          <ArrowBackIosIcon />
        </Button>{' '}
        <Button onClick={() => handleChangeRecord('next')}>
          <ArrowForwardIosIcon />
        </Button>
      </ButtonGroup>
    </Stack>
  );
}
