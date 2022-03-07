import { prisma } from '../services/prismaClient';
import { app } from '../app';
import request from 'supertest';

beforeAll(async ()=>{
  await prisma.vendor.deleteMany();
  await prisma.$disconnect()
})


describe('Vendor Integration Tests', () => {
  let vendorId: string;

  afterAll(async () =>{
    await prisma.vendor.deleteMany();
    await prisma.$disconnect()
  })

  it('Checks that Vendors Should Be Empty ', async () => {
    const response = await request(app).get('/vendors');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });

  it('Creates Vendor', async () => {
    const newVendor = [{ name: 'ABC', type: 'RETAIL' }];
    const response = await request(app).post('/vendors').send(newVendor);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added successfully' });

    const newResponse = await request(app).get('/vendors');
    expect(newResponse.status).toEqual(200);
    vendorId = await newResponse.body.data[0].id;
    expect(newResponse.body.data[0].name).toEqual('ABC');
    expect(newResponse.body.data[0].type).toEqual('RETAIL');
  });


  it('Updates Newly Created Vendor', async () => {
    const updatedVendor = {
      updatedList: [{ id: vendorId, name: 'CDE', type: 'WHOLESALE' }],
    };
    const response = await request(app).put('/vendors').send(updatedVendor);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Updated Successfully' });

    const newResponse = await request(app).get('/vendors');
    expect(newResponse.status).toEqual(200);
    vendorId = newResponse.body.data[0].id;
    expect(newResponse.body.data[0].name).toEqual('CDE');
    expect(newResponse.body.data[0].type).toEqual('WHOLESALE');
  });


  it('Checks if Context Link is Working', async () => {
    const response = await request(app).get('/vendors/context-link');
    expect(response.status).toEqual(200);
    expect(response.body[0]['value']).toEqual('CDE');
    expect(response.body[0].label).toEqual('CDE');
  });

  it('Deletes Vendor', async () => {
    const vendorToDelete = [{ id: vendorId }];
    const response = await request(app)
      .delete('/vendors/delete-line-items')
      .send(vendorToDelete);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });
  });

  it('Checks if there are no Vendors', async () => {
    const response = await request(app).get('/vendors');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });
});
