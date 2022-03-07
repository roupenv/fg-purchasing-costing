import { prisma } from '../services/prismaClient';
import { app } from '../app';
import request from 'supertest';

beforeAll(async () => {
  const deleteTarrifs = prisma.tarrif.deleteMany();
  const deleteProducts = prisma.product.deleteMany();

  await prisma.$transaction([deleteTarrifs, deleteProducts]);

  await prisma.$disconnect();
})


describe('Products Integration Tests', () => {
  let productId: string;

  afterAll(async () => {
    const deleteTarrifs = prisma.tarrif.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    await prisma.$transaction([deleteTarrifs, deleteProducts]);
    await prisma.$disconnect();
  });

  it('Checks that Product Should Be Empty ', async () => {
    const response = await request(app).get('/products');
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

  it('Creates Product ', async () => {
    const newProduct = [
      {
        product_name: 'Test',
        bottom: '4567',
        collection: 'F/W',
        season: '2021',
        tarrif_code: '1234',
      },
    ];
    const response = await request(app).post('/products').send(newProduct);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added Successfully' });
  });

  it('Checks Newly Created Product', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toEqual(200);
    productId = await response.body.data[0].id;
    expect(response.body.data[0].product_name).toEqual('Test');
    expect(response.body.data[0].bottom).toEqual('4567');
    expect(response.body.data[0].collection).toEqual('F/W');
    expect(response.body.data[0].season).toEqual('2021');
    expect(response.body.data[0].tarrif_code).toEqual('1234');
  });

  it('Updates Newly Created Product with Null Tarrif_Code', async () => {
    const updatedProduct = {
      updatedList: [
        {
          id: productId,
          product_name: 'Updated',
          bottom: '89',
          collection: 'S/S',
          season: '2022',
          tarrif_code: null,
        },
      ],
    };
    const response = await request(app).put('/products').send(updatedProduct);
    expect(response.status).toEqual(201)
    expect(response.body).toEqual({ message: 'Updated Successfully' });
  });

  it('Checks If  Product is Updated', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toEqual(200);
    productId = await response.body.data[0].id;
    expect(response.body.data[0].product_name).toEqual('Updated');
    expect(response.body.data[0].bottom).toEqual('89');
    expect(response.body.data[0].collection).toEqual('S/S');
    expect(response.body.data[0].season).toEqual('2022');
    expect(response.body.data[0].tarrif_code).toEqual('1234');
  });

  it('Checks if Context Link is Working', async () => {
    const response = await request(app).get('/products/context-link');
    expect(response.status).toEqual(200);
    expect(response.body[0]['value']).toEqual('Updated');
    expect(response.body[0].label).toEqual('Updated');
  });

  it('Deletes Product', async () => {
    const productToDelete = [{ id: productId }];
    const response = await request(app)
      .delete('/products/delete-line-items')
      .send(productToDelete);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });
  });

  it('Checks That here are no Products ', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });
});
