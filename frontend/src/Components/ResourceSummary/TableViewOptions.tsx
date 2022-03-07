import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React from 'react';

interface ITableViewOptions {
  filter: any;
  handleFilterChange: any;
  selectedSortBy: any;
  handleSortDateChange: any;
  pageSize: any;
  setPageSize: any;
}

export default function TableViewOptions({
  filter,
  handleFilterChange,
  selectedSortBy,
  handleSortDateChange,
  pageSize,
  setPageSize,
}: ITableViewOptions) {
  return (
    <>
      <Grid item xs={3} xl={2} sx={{ marginLeft: '20px' }}>
        <TextField id='global-search' label='Global Search' value={filter} onChange={handleFilterChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id='date-sort-by'
          select
          value={selectedSortBy === true ? 'true' : 'false'}
          label='Date Sort By'
          onChange={handleSortDateChange}
        >
          <MenuItem value={'true'}>Newest</MenuItem>
          <MenuItem value={'false'}>Oldest</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs />
      <Grid item container justifyContent='right' xs={2} sx={{ marginRight: '20px' }}>
        <Select
          id='page-select'
          value={pageSize}
          label='Age'
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <MenuItem key={pageSize} value={pageSize}>
              Show {pageSize}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </>
  );
}
