import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import AlertDialog from '../Components/ResourceDetails/Dialogs/AlertDialog';
import DeleteDialog from '../Components/ResourceDetails/Dialogs/DeleteDialog';
import useResourceDetails from '../Components/ResourceDetails/Hooks/useResourceDetails';
import TextInfoField from '../Components/ResourceDetails/InfoCardFields/TextInfoField';
import RecordActionBtnGroup from '../Components/ResourceDetails/RecordActionBtnGroup';
import { ResourceDetailsContext } from '../Components/ResourceDetails/state/context';

interface VendorDetailsApi {
  id: number;
  name: string;
  type: string;
}

let vendorDetailsSchema = yup.object().shape({
  id: yup.number().integer(),
  name: yup.string().required('Must Specify Vendor Name').uppercase(),
  type: yup.string().uppercase().nullable(),
});

export default function VendorDetails() {
  const context = useResourceDetails<VendorDetailsApi>();

  const { resourceData, isLoading, } = context;

  return (
    <ResourceDetailsContext.Provider value={context}>
      <Box>
        <DeleteDialog />
        <AlertDialog />
        {!isLoading && (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h4'>Vendor Details</Typography>
            </Grid>
            <Grid item container xs={6} justifyContent='flex-end'>
              <RecordActionBtnGroup schemaValidation={vendorDetailsSchema} />
            </Grid>
            <Grid item container xs={12}>
              <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                <Grid item sm={12}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Info</Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      divider={<Divider orientation='vertical' flexItem />}
                    >
                      <TextInfoField
                        id='name'
                        label='Vendor Name'
                        initialValue={resourceData.name}
                        sx={{ width: 250 }}
                      />
                      <TextInfoField id='type' label='Type' initialValue={resourceData.type} sx={{ width: 250 }} />
                    </Stack>
                  </Stack>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </ResourceDetailsContext.Provider>
  );
}
