import { prisma } from '../services/prismaClient';
import { app } from '../app';
import request from 'supertest';


beforeAll(async ()=> {
  await prisma.tarrif.deleteMany();
  await prisma.$disconnect()
})

describe('Tarrif Integration Tests', () => {
  afterAll(async () =>{
    await prisma.tarrif.deleteMany();
    await prisma.$disconnect()
  })

  let tarrifId: string;
  it('Checks that Tarrifs Should Be Empty ', async () => {
    const response = await request(app).get('/tarrifs');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });
  it('Creates Tarrif ', async () => {
    const newTarrif = [
      { tarrif_code: '1234', description: '10% Duty', material: 'Leather' },
    ];
    const response = await request(app).post('/tarrifs').send(newTarrif);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added Successfully' });
  });

  it('Checks Newly Created Tarrif', async () => {
    const response = await request(app).get('/tarrifs');
    expect(response.status).toEqual(200);
    tarrifId = await response.body.data[0].id;
    expect(response.body.data[0].tarrif_code).toEqual('1234');
    expect(response.body.data[0].description).toEqual('10% Duty');
    expect(response.body.data[0].material).toEqual('Leather');
  });

  it('Updates Newly Created Tarrif', async () => {
    const updatedTarrif = {
      updatedList: [
        { id: tarrifId, description: '20% Duty', material: 'Fabric' },
      ],
    };
    const response = await request(app).put('/tarrifs').send(updatedTarrif);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Updated Successfully' });
  });

  it('Checks If  Tarrif is Updated', async () => {
    const response = await request(app).get('/tarrifs');
    expect(response.status).toEqual(200);
    expect(response.body.data[0].tarrif_code).toEqual('1234');
    expect(response.body.data[0].description).toEqual('20% Duty');
    expect(response.body.data[0].material).toEqual('Fabric');
  });

  it('Checks if Context Link is Working', async () => {
    const response = await request(app).get('/tarrifs/context-link');
    expect(response.status).toEqual(200);
    expect(response.body[0]['value']).toEqual('1234');
    expect(response.body[0].label).toEqual('1234 Fabric');
  });

  it('Deletes Tarrif', async () => {
    const tarrifToDelete = [{ id: tarrifId }];
    const response = await request(app)
      .delete('/tarrifs/delete-line-items')
      .send(tarrifToDelete);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });
  });

  it('Checks that there are no Tarrifs ', async () => {
    const response = await request(app).get('/tarrifs');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });
});
