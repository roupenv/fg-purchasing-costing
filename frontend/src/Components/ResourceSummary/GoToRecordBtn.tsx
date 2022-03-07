import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

interface IGoToRecordBtn {
  originalRow: any;
  rowIndex: number;
  urlResource: string;
}

export default function GoToRecordBtn({ originalRow, rowIndex, urlResource }:IGoToRecordBtn) {
  return (
    <ButtonGroup variant='text' size='small' sx={{ bgcolor: 'secondary.light' }}>
      <Button component={Link} to={'/admin' + urlResource + '/' + originalRow.id}>
        <ArrowForwardIcon sx={{ width: '15px', height: '20px' }} />
      </Button>
    </ButtonGroup>
  );
}
