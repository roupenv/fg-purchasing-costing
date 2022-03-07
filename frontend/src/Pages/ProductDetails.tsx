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
import SelectInfoField from '../Components/ResourceDetails/InfoCardFields/SelectInfoField';
import TextInfoField from '../Components/ResourceDetails/InfoCardFields/TextInfoField';
import YearInfoField from '../Components/ResourceDetails/InfoCardFields/YearInfoField';
import RecordActionBtnGroup from '../Components/ResourceDetails/RecordActionBtnGroup';
import { ResourceDetailsContext } from '../Components/ResourceDetails/state/context';
import useFetchApi from '../Hooks/useFetchApi';

interface ProductDetailsApi {
  id: number;
  product_name: string;
  bottom: string;
  collection: string;
  season: string;
  tarrif_code: string;
}

let productDetailsSchema = yup.object().shape({
  id: yup.number().integer(),
  product_name: yup.string().required('Must Specify Product Name').uppercase(),
  bottom: yup.string().uppercase().nullable(),
  collection: yup.string(),
  season: yup.string().nullable(),
  tarrif_code: yup.string().nullable(),
});

const seasonList = [
  { value: 'F/W', label: 'F/W' },
  { value: 'S/S', label: 'S/S' },
];

export default function ProductDetails() {
  const { data: tarrifsList, loading: tarrifsLoading } = useFetchApi('/api/tarrifs/context-link', true, undefined, [
    { value: '', label: '' },
  ]);

  const context = useResourceDetails<ProductDetailsApi>();

  const { resourceData, isLoading } = context;

  return (
    <ResourceDetailsContext.Provider value={context}>
      <Box>
        <DeleteDialog />
        <AlertDialog />
        {!isLoading && !tarrifsLoading && (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h4'>Product Details</Typography>
            </Grid>
            <Grid item container xs={6} justifyContent='flex-end'>
              <RecordActionBtnGroup schemaValidation={productDetailsSchema} />
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
                          id='product_name'
                          label='Name'
                          initialValue={resourceData.product_name}
                          sx={{ width: 250 }}
                        />
                        <TextInfoField
                          id='bottom'
                          label='Name'
                          initialValue={resourceData.bottom}
                          sx={{ width: 250 }}
                        />
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        divider={<Divider orientation='vertical' flexItem />}
                      >
                        <SelectInfoField
                          id='collection'
                          label='Collection'
                          value={resourceData.collection}
                          options={seasonList}
                          sx={{ width: 100 }}
                        />
                        <YearInfoField id='season' label='Year' data={resourceData.season} width='150px' />
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        divider={<Divider orientation='vertical' flexItem />}
                      >
                        <SelectInfoField
                          id='tarrif_code'
                          label='Tarrif Code'
                          value={resourceData.tarrif_code}
                          options={tarrifsList!}
                          sx={{ width: 350 }}
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
