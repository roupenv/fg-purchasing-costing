import { useMemo, useState, useEffect } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import './Table.css';

import { useTable, useGroupBy, useExpanded, useSortBy } from 'react-table';

export default function Table({ columns, data, grouping, footer, ungroupedColumns, groupedColumns }) {
  const initialGroupBy = useMemo(() => [], []);
  const initialSortBy = useMemo(
    () => [
      { id: 'year', desc: false },
      { id: 'monthIndex', desc: false },
      { id: 'day', desc: false },
    ],
    []
  );
  const initialHiddenColumns = useMemo(() => ['monthIndex'], []);

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
    state: { groupBy, expanded, hiddenColumns },
  } = tableInstance;

  const [switchDisabled, setSwitchDisabled] = useState(true);

  useEffect(() => {
    if (grouping) {
      if (groupBy.length === 0 || groupBy[0] === '') {
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
    let nameOfClass;
    if (row.canExpand) {
      if (row.depth === 0) {
        nameOfClass = 'first-group';
      } else if (row.depth === 1) {
        nameOfClass = 'second-group';
      } else {
        nameOfClass = 'third-group';
      }
    } else {
      nameOfClass = 'detail';
    }
    return { className: nameOfClass };
  };

  return (
    <>
      <div className='table-container'>
        {grouping && (
          <div className='table-controls'>
            <h5>Group By:</h5>
            <select onChange={(e) => setGroupBy(e.target.value.split(','))}>
              <option value=''>None</option>
              {columns[0].columns
                .filter((key) => key.groupByControl === true)
                .map((column) => (
                  <option key={column.accessor} value={column.groupByValue}>
                    {column.Header}
                  </option>
                ))}
            </select>
            <h5>Show All:</h5>
            <Switch
              size='small'
              checked={checked}
              disabled={switchDisabled}
              onChange={() => (isAllRowsExpanded ? toggleAllRowsExpanded(false) : toggleAllRowsExpanded(true))}
            />
          </div>
        )}
        {
        (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
              <code>{JSON.stringify({ groupBy, expanded, hiddenColumns }, null, 2)}</code> : null
            
      }
        <table className='dynamic-table' {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {/* {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>{column.isGrouped ? '🛑 ' : '👊 '}</span>
                  ) : null} */}
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} {...dynamicRowRender(row)}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
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
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {footer && (
            <tfoot>
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map((column) => (
                    <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
}
