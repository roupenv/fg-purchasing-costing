import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';

interface apiWithDetails {
  header: {}
  data: [{}]
}

export default function ActionButtonsCell(tableObj: any) {
  const { dispatch, resourceData, defaultNewRow }  = useResourceDetailsContext()! 
  
  const tableData = resourceData as apiWithDetails

  const currentRowIndex = tableObj.row.index;
  const rowsLength = tableObj.rows.length;

  const handleOnDelete = () => {
    dispatch({
      type: 'deletedTableRow',
      payload: {
        rowIndex: currentRowIndex,
        value: tableData.data.length  === 1 ? defaultNewRow : undefined, //If there is 1 row left, instead of deleting it, effectively clear it
      },
    });
  };

  const handleOnAdd = () => {
    dispatch({
      type: 'addedTableRow',
      payload: {
        value: defaultNewRow,
      },
    });
  };

  return (
    <ButtonGroup variant='outlined' size='small'>
      {currentRowIndex === rowsLength - 1 && (
        <Button onClick={handleOnAdd}>
          <AddIcon fontSize='small' />
        </Button>
      )}
      <Button onClick={handleOnDelete}>
        <DeleteIcon fontSize='small' />
      </Button>
    </ButtonGroup>
  );
}

