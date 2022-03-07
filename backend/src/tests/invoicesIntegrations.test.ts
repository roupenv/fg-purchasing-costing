import { prisma } from '../services/prismaClient';
import { app } from '../app';
import request from 'supertest';

beforeAll(async ()=>{
  const deleteVendors = prisma.vendor.deleteMany();
  const deleteTarrifs = prisma.tarrif.deleteMany();
  const deleteProducts = prisma.product.deleteMany();
  const deleteLineItems = prisma.invoice_line_items.deleteMany();
  const deleteInvoice = prisma.invoice.deleteMany();

  await prisma.$transaction([
    deleteVendors,
    deleteTarrifs,
    deleteProducts,
    deleteLineItems,
    deleteInvoice,
  ]);
  await prisma.$disconnect();
})



describe('Invoice Integration Tests', () => {
  beforeAll(async () => {
    const newVendor = [{ name: 'ABC', type: 'RETAIL' }];
    const vendorResponse = await request(app).post('/vendors').send(newVendor);
    expect(vendorResponse.status).toEqual(201);
    expect(vendorResponse.body).toEqual({ message: 'Added successfully' });

    const newTarrif = [
      { tarrif_code: '1234', description: '10% Duty', material: 'Leather' },
    ];
    const tarrifResponse = await request(app).post('/tarrifs').send(newTarrif);
    expect(tarrifResponse.status).toEqual(201);
    expect(tarrifResponse.body).toEqual({ message: 'Added Successfully' });

    const newProduct = [
      {
        product_name: 'Test',
        bottom: '4567',
        collection: 'F/W',
        season: '2021',
        tarrif_code: '1234',
      },
      {
        product_name: 'Test2',
        bottom: '4567',
        collection: 'F/W',
        season: '2021',
        tarrif_code: '1234',
      },
    ];
    const productResponse = await request(app)
      .post('/products')
      .send(newProduct);
    expect(productResponse.status).toEqual(201);
    expect(productResponse.body).toEqual({ message: 'Added Successfully' });
  });

  afterAll(async () => {
    const deleteVendors = prisma.vendor.deleteMany();
    const deleteTarrifs = prisma.tarrif.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    const deleteLineItems = prisma.invoice_line_items.deleteMany();
    const deleteInvoice = prisma.invoice.deleteMany();

    await prisma.$transaction([
      deleteVendors,
      deleteTarrifs,
      deleteProducts,
      deleteLineItems,
      deleteInvoice,
    ]);
    await prisma.$disconnect();
  });

  let invoiceId: string;
  let invoiceId2: string;
  let invoiceId3: string;

  let invoiceLineItemId: string;
  let invoiceLineItemId2: string;
  let invoiceLineItemId3: string;

  it('Checks that Invoices Should Be Empty ', async () => {
    const response = await request(app).get('/invoices');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });

  it('Creates Invoice', async () => {
    const newInvoice = {
      header: {
        invoice_number: '1/1',
        date: '2021-09-20T00:00:00.000Z',
        vendor: 'ABC',
      },
      data: [
        {
          po_ref: '05100',
          product: 'Test',
          color: 'Black',
          quantity: '2',
          price: '4',
          discount: '0',
          line_total: '8',
          sample: 'true',
        },
        {
          po_ref: '05200',
          product: 'Test2',
          color: 'White',
          quantity: '3',
          price: '5',
          discount: '1',
          line_total: '12',
          sample: '',
        },
      ],
    };

    const response = await request(app).post('/invoices/new').send(newInvoice);
    expect(response.status).toEqual(201);
    invoiceId = response.body.newId;

    expect(response.body).toEqual({
      message: 'Created New Invoice Successfully',
      newId: invoiceId,
    });

    const expectedResponse = {
      header: {
        id: expect.any(Number),
        invoice_number: '1/1',
        date: '2021-09-20T00:00:00.000Z',
        vendor: 'ABC',
      },
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          po_ref: expect.any(String),
          product: expect.any(String),
          color: expect.any(String),
          quantity: expect.any(Number),
          price: expect.any(String),
          discount: expect.any(String),
          line_total: expect.any(String),
          sample: expect.any(Boolean),
        }),
      ]),
    };
    const newResponse = await request(app).get(`/invoices/${invoiceId}`);
    invoiceLineItemId = newResponse.body.data[0].id;
    invoiceLineItemId2 = newResponse.body.data[1].id;

    expect(newResponse.status).toEqual(200);
    expect(newResponse.body).toEqual(expectedResponse);
  });

  it('Updates Newly Created Invoice and Line Item ', async () => {
    const updatedInvoice = {
      formData: {
        invoice_number: '1/2',
        date: '2022-09-20T00:00:00.000Z',
        vendor: 'ABC',
      },
      updatedList: [
        {
          id: invoiceLineItemId,
          po_ref: '05100',
          product: 'Test',
          color: 'Silver',
          quantity: '4',
          price: '5',
          discount: '0',
          line_total: '20',
          sample: 'false',
        },
      ],
    };
    const response = await request(app)
      .put(`/invoices/${invoiceId}`)
      .send(updatedInvoice);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Updated Successfully' });

    const newResponse = await request(app).get(`/invoices/${invoiceId}`);

    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.header.invoice_number).toEqual('1/2');
    expect(newResponse.body.header.date).toEqual('2022-09-20T00:00:00.000Z');
    expect(newResponse.body.data[0].color).toEqual('Silver');
    expect(newResponse.body.data[0].quantity).toEqual(4);
    expect(newResponse.body.data[0].price).toEqual('5');
    expect(newResponse.body.data[0].line_total).toEqual('20');
    expect(newResponse.body.data[0].sample).toEqual(false);
  });

  it('Adds Line Item and Checks if All Properties Added', async () => {
    const addLineItem = [
      {
        po_ref: '12345',
        product: 'Test',
        color: 'Platinum',
        quantity: '1',
        price: '1',
        discount: '0',
        line_total: '1',
        sample: 'true',
      },
    ];
    const response = await request(app)
      .post(`/invoices/${invoiceId}`)
      .send(addLineItem);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added Successfully' });

    const newResponse = await request(app).get(`/invoices/${invoiceId}`);
    invoiceLineItemId3 = newResponse.body.data[2].id;
    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.data).toHaveLength(3);
  });

  it('Deletes 2nd Line Item and Checks if Deleted', async () => {
    const lineItemToDelete = [{ id: invoiceLineItemId2 }];
    const response = await request(app)
      .delete(`/invoices/${invoiceId}/delete-line-items`)
      .send(lineItemToDelete);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });

    const newResponse = await request(app).get(`/invoices/${invoiceId}`);
    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.data).toHaveLength(2);
    expect(newResponse.body.data[0].id).toEqual(invoiceLineItemId);
    expect(newResponse.body.data[1].id).toEqual(invoiceLineItemId3);
  });

  it('Gets New Empty Invoice', async () => {
    const newEmptyInvoice = {
      header: {
        invoice_number: '',
        date: expect.any(String),
        vendor: '',
      },
      data: [
        {
          id: 0,
          po_ref: '',
          product: '',
          color: '',
          quantity: 0,
          price: "0",
          discount: "0",
          line_total: "0",
          sample: false,
        },
      ],
    };
    const response = await request(app).get(`/invoices/new`);
    expect(response.body).toMatchObject(newEmptyInvoice);
  });

  it('Creates 2 Additional New Payments ', async () => {
    const newInvoice2 = {
      header: {
        invoice_number: '1/1',
        date: '2021-09-20T00:00:00.000Z',
        vendor: 'ABC',
      },
      data: [
        {
          po_ref: '05100',
          product: 'Test',
          color: 'Black',
          quantity: '2',
          price: '4',
          discount: '0',
          line_total: '8',
          sample: 'true',
        },
      ],
    };
    const newInvoice3 = {
      header: {
        invoice_number: '1/5',
        date: '2021-09-20T00:00:00.000Z',
        vendor: 'ABC',
      },
      data: [
        {
          po_ref: '05100',
          product: 'Test',
          color: 'Black',
          quantity: '2',
          price: '4',
          discount: '0',
          line_total: '8',
          sample: 'true',
        },
      ],
    };
    const newResponse2 = await request(app)
      .post('/invoices/new')
      .send(newInvoice2);
    expect(newResponse2.status).toEqual(201);
    invoiceId2 = newResponse2.body.newId;

    const newResponse3 = await request(app)
      .post('/invoices/new')
      .send(newInvoice3);
    expect(newResponse3.status).toEqual(201);
    invoiceId3 = newResponse3.body.newId;
  });

  it('Goes to Next Record', async () => {
    console.log(invoiceId, invoiceId2, invoiceId3);

    const response = await request(app).get(`/invoices/${invoiceId}/next`);
    expect(response.body.id).toEqual(invoiceId2);

    const nextResponse = await request(app).get(`/invoices/${invoiceId2}/next`);
    expect(nextResponse.body.id).toEqual(invoiceId3);
  });

  it('Goes to Previous Record', async () => {
    const response = await request(app).get(`/invoices/${invoiceId3}/previous`);
    expect(response.body.id).toEqual(invoiceId2);

    const nextResponse = await request(app).get(
      `/invoices/${invoiceId2}/previous`
    );
    expect(nextResponse.body.id).toEqual(invoiceId);
  });

  it('Goes to First Record', async () => {
    const response = await request(app).get(`/invoices/${invoiceId3}/first`);
    expect(response.body.id).toEqual(invoiceId);

    const anotherResponse = await request(app).get(
      `/invoices/${invoiceId2}/first`
    );
    expect(anotherResponse.body.id).toEqual(invoiceId);
  });

  it('Goes to Last Record', async () => {
    const response = await request(app).get(`/invoices/${invoiceId}/last`);
    expect(response.body.id).toEqual(invoiceId3);

    const anotherResponse = await request(app).get(
      `/invoices/${invoiceId2}/last`
    );
    expect(anotherResponse.body.id).toEqual(invoiceId3);
  });

  it('Try to go past Last Record, return Reached Last Record', async () => {
    const response = await request(app).get(`/invoices/${invoiceId3}/next`);
    expect(response.body).toEqual({"message": "Reached Last Record"});
  });

  
  it('Try to go before First Record, return Reached First Record', async () => {
    const response = await request(app).get(`/invoices/${invoiceId}/previous`);
    expect(response.body).toEqual({"message": "Reached First Record"});
  });


  it('Deletes a Payment and Checks there is only 2 payments', async () => {
    const response = await request(app).delete(`/invoices/${invoiceId3}`);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });

    const newResponse = await request(app).get('/invoices');
    expect(newResponse.body.data).toHaveLength(2);
  });
});
