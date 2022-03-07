import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import {
  Column,
  TableOptions,
  UsePaginationOptions,
  UseSortByOptions,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface IDetailsTable<T extends object> {
  tableTitle: string;
  columns: readonly Column<T>[];
  data: readonly T[];
}

export interface ReactTableOptions<D extends Record<string, unknown>>
  extends TableOptions<D>,
    UsePaginationOptions<D>,
    UseSortByOptions<D> {}

const pageSize = 20;

export default function DetailsTable<T extends object>({ tableTitle, columns, data }: IDetailsTable<T>) {
  const { endpoint, isEditMode } = useResourceDetailsContext()!;

  const detailsTableInstance = useTable(
    {
      columns,
      data,
      // Below functions aren't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      initialState: {
        hiddenColumns: ['action-btn-group'],
        pageSize: pageSize,
      },
      autoResetPage: false,
    } as TableOptions<T>,
    useSortBy,
    usePagination
  );

  const { setHiddenColumns } = detailsTableInstance;

  useEffect(
    () => (isEditMode ? setHiddenColumns([]) : setHiddenColumns(['action-btn-group'])),
    [isEditMode, setHiddenColumns]
  );

  const { getTableProps, headerGroups, footerGroups, getTableBodyProps, prepareRow, page } =
    detailsTableInstance as any;
  const {
    pageOptions,
    gotoPage,
    state: { pageIndex },
  } = detailsTableInstance as any;

  useEffect(() => {
    gotoPage(0);
  }, [endpoint, gotoPage]);

  // Used to automatically go to next page if add row is clicked and max page size is reached
  useEffect(() => {
    // If remainder = 0 then should switch to next page or previous page
    const addRowRemainder = (data.length - 1) % ((pageIndex + 1) * pageSize);
    const deleteRowRemainder = (data.length + pageSize) % ((pageIndex + 1) * pageSize);

    if (isEditMode && addRowRemainder === 0) {
      gotoPage(pageIndex + 1);
    }
    if (isEditMode && deleteRowRemainder === 0) {
      gotoPage(pageIndex - 1);
    }
  }, [isEditMode, data.length, gotoPage, pageIndex]);

  return (
    <Paper elevation={6} sx={{ py: '20px' }}>
      <Stack direction='column'>
        <Typography variant='h6' sx={{ marginLeft: '16px' }}>
          {tableTitle}
        </Typography>

        <TableContainer>
          <Table {...getTableProps()} size='small' padding='checkbox'>
            <TableHead>
              {headerGroups.map((headerGroup: any) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row: any) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell: any) => {
                      if (isEditMode) {
                        return (
                          <TableCell {...cell.getCellProps()} sx={{ '&.MuiTableCell-root': { px: '5px' } }}>
                            {cell.render('Cell')}
                          </TableCell>
                        );
                      } else {
                        return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                      }
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              {footerGroups.map((group: any) => (
                <TableRow {...group.getFooterGroupProps()}>
                  {group.headers.map((column: any) => (
                    <TableCell {...column.getFooterProps()} variant='head'>
                      {column.render('Footer')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </TableContainer>
        <Stack alignItems='center'>
          {data.length > pageSize && (
            <Pagination
              //  sx={{display: 'flex', alignItems: 'center'}}
              count={pageOptions.length}
              color='secondary'
              page={pageIndex + 1}
              onChange={(event, value) => gotoPage(value - 1)}
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
