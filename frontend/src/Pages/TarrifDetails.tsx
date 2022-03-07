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

interface TarrifDetailsApi {
  description: string;
  id: number;
  material: string;
  tarrif_code: string;
}

let tarrifDetailsSchema = yup.object().shape({
  id: yup.number().integer(),
  tarrif_code: yup.string().required('Must Specify Tarrif Code').uppercase(),
  description: yup.string(),
  material: yup.string(),
});

export default function TarrifDetails() {
  const context = useResourceDetails<TarrifDetailsApi>();

  const { resourceData, isLoading } = context;

  return (
    <ResourceDetailsContext.Provider value={context}>
      <Box>
        <DeleteDialog />
        <AlertDialog />
        {!isLoading && (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h4'>Tarrif Details</Typography>
            </Grid>
            <Grid item container xs={6} justifyContent='flex-end'>
              <RecordActionBtnGroup schemaValidation={tarrifDetailsSchema} />
            </Grid>
            <Grid item container xs={12}>
              <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                <Grid item sm={12}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Info</Typography>
                    <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        divider={<Divider orientation='vertical' flexItem />}
                      >
                        <TextInfoField
                          id='tarrif_code'
                          label='Tarrif Code'
                          initialValue={resourceData.tarrif_code}
                          sx={{ width: 250 }}
                        />
                        <TextInfoField
                          id='material'
                          label='Material'
                          initialValue={resourceData.material}
                          sx={{ width: 250 }}
                        />
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        divider={<Divider orientation='vertical' flexItem />}
                      >
                        <TextInfoField
                          id='description'
                          label='Description'
                          initialValue={resourceData.description}
                          sx={{ width: { xs: 400, sm: 600 } }}
                          multiline
                          rows={4}
                        />
                      </Stack>
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
