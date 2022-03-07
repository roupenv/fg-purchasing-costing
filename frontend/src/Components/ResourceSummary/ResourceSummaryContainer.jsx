import { useMemo, useState } from 'react';

import { matchSorter } from 'match-sorter';

import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination } from 'react-table';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Pagination from '@mui/material/Pagination';

import PaginationTable from './PaginationTable';
import TableViewOptions from './TableViewOptions';

export default function ResourceSummaryContainer({ columns, data, dateSortById }) {
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: (rows, id, filterValue) => matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] }),
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    pageOptions,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
    setSortBy,
  } = tableInstance;

  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setGlobalFilter(e.target.value);
  };

  const [selectedSortBy, setSelectedSortBy] = useState(true);

  const handleSortDateChange = (e) => {
    setSelectedSortBy(e.target.value === 'true' ? true : false);
    setSortBy([{ id: dateSortById, desc: e.target.value === 'true' ? true : false }]);
  };

  return (
    <Box>
      <Paper elevation={6} sx={{ paddingBottom: '20px' }}>
        <Grid container spacing={2}>
          <TableViewOptions
            filter={filter}
            handleFilterChange={handleFilterChange}
            selectedSortBy={selectedSortBy}
            handleSortDateChange={handleSortDateChange}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
          <Grid item xs={12}>
            <PaginationTable tableInstance={tableInstance} />
          </Grid>

          <Grid item xs={3} />
          <Grid item container justifyContent='center' xs>
            <Pagination
              count={pageOptions.length}
              color='secondary'
              page={pageIndex + 1}
              onChange={(event, value) => gotoPage(value - 1)}
            />
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </Paper>
    </Box>
  );
}
