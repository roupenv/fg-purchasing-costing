import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState, forwardRef } from 'react';
import { useExpanded, useGroupBy, useSortBy, useTable } from 'react-table';



function ReportsTable({ columns, data, grouping, footer, ungroupedColumns, groupedColumns}, ref) {
  const initialGroupBy = useMemo(() => ['none'], []);
  const initialSortBy = useMemo(
    () => [
      { id: 'year', desc: false },
      { id: 'monthIndex', desc: false },
      { id: 'day', desc: false },
    ],
    []
  );
  const initialHiddenColumns = useMemo(() => ['year','monthIndex'], []);

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetGroupBy: false,
      autoResetExpanded: false,
      initialState: {
        groupBy: initialGroupBy,
        sortBy: initialSortBy,
        hiddenColumns: initialHiddenColumns,
      },
    },
    useGroupBy,
    useSortBy,
    useExpanded
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    setHiddenColumns,
    setGroupBy,
    toggleAllRowsExpanded,
    isAllRowsExpanded,
    prepareRow,
    state: { groupBy },
  } = tableInstance;

  const [switchDisabled, setSwitchDisabled] = useState(true);

  useEffect(() => {
    if (grouping) {
      if (groupBy[0] === 'none') {
        //If no column is grouped
        setHiddenColumns(() => groupedColumns);
        setSwitchDisabled(true);
      } else {
        setHiddenColumns(() => ungroupedColumns);
        setSwitchDisabled(false);
      }
    }
  }, [grouping, groupBy, setHiddenColumns, toggleAllRowsExpanded, ungroupedColumns, groupedColumns]);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    isAllRowsExpanded ? setChecked(true) : setChecked(false);
  }, [isAllRowsExpanded]);

  const dynamicRowRender = (row) => {
    let sx;
    if (row.canExpand) {
      switch (row.depth) {
        case 0:
          sx = { bgcolor: '#6bb6fb' };
          break;
        case 1:
          sx = { bgcolor: '#ff9334' };
          break;
        case 2:
          sx = { bgcolor: '#88d356' };
          break;
        default:
          break;
      }
    } else {
      sx = {
        ':nth-of-type(odd)': { bgcolor: 'grey.300' },
      };
    }
    return { sx: sx };
  };
  return (
    <Paper elevation={6} sx={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} container justifyContent='flex-end' alignItems='center'>
          {grouping && (
            <Stack direction='row' spacing={2} >
              <TextField
                label='Group By'
                size='small'
                select
                sx={{ width: '125px' }}
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <MenuItem  value={['none'] }>None</MenuItem>
                {columns[0].columns
                  .filter((key) => key.groupByControl === true)
                  .map((column) => (
                    <MenuItem key={column.accessor} value={column.groupByValue}>
                      {column.Header}
                    </MenuItem>
                  ))}
              </TextField>
              <FormGroup sx={{justifyContent: 'center'}}>
                <FormControlLabel
                  label='Show All'
                  control={
                    <Switch
                      size='small'
                      checked={checked}
                      disabled={switchDisabled}
                      onChange={() => (isAllRowsExpanded ? toggleAllRowsExpanded(false) : toggleAllRowsExpanded(true))}
                    />
                  }
                />
              </FormGroup>
            </Stack>
          )}
        </Grid>
        <Grid item xs={12}>
          <TableContainer ref={ref} sx={{displayPrint: {px: '30px', pt: '5px'}}}>
            <Table {...getTableProps()} size='small' stickyHeader>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        {...column.getHeaderProps()}
                        sx={{
                          borderColor: 'common.black',
                          borderBottom: 1,
                          borderRight: 1,
                          borderRightColor: 'grey.400',
                          borderTop: 1,
                          borderTopColor: 'grey.400',
                        }}
                      >
                        {/* {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>{column.isGrouped ? '🛑 ' : '👊 '}</span>
                  ) : null} */}
                        {column.render('Header')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()} {...dynamicRowRender(row)}>
                      {row.cells.map((cell) => {
                        return (
                          <TableCell {...cell.getCellProps()} sx={{ borderBottom: 1, borderColor: 'grey.900' }}>
                            {cell.isGrouped ? (
                              // If it's a grouped cell, add an expander and row count
                              <>
                                <b>{cell.render('Cell')} </b>({row.subRows.length})
                                <span {...row.getToggleRowExpandedProps()}>
                                  {row.isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                                </span>{' '}
                              </>
                            ) : cell.isAggregated ? (
                              // If the cell is aggregated, use the Aggregated
                              // renderer for cell
                              cell.render('Aggregated')
                            ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                              // Otherwise, just render the regular cell
                              cell.render('Cell')
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
              {footer && (
                <TableFooter>
                  {footerGroups.map((group) => (
                    <TableRow
                      {...group.getFooterGroupProps()}
                      sx={{ ':first-of-type td': { borderTop: 1, borderColor: 'grey.900', bgcolor: 'grey.100' } }}
                    >
                      {group.headers.map((column) => (
                        <TableCell {...column.getFooterProps()} variant='head'>
                          {column.render('Footer')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableFooter>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default forwardRef(ReportsTable)
