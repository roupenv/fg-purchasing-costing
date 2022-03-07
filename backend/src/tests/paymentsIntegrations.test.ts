import { prisma } from '../services/prismaClient';
import { app } from '../app';
import request from 'supertest';

beforeAll(async ()=> {
  const deletePaymentsLineItems = prisma.payment_line_item.deleteMany();
  const deleteVendors = prisma.vendor.deleteMany();
  const deletePayments = prisma.payment.deleteMany();
  await prisma.$transaction([
    deletePaymentsLineItems,
    deletePayments,
    deleteVendors,
  ]);
  await prisma.$disconnect();
})



describe('Payments Integration Tests', () => {
  afterAll(async () => {
    const deletePaymentsLineItems = prisma.payment_line_item.deleteMany();
    const deleteVendors = prisma.vendor.deleteMany();
    const deletePayments = prisma.payment.deleteMany();
    await prisma.$transaction([
      deletePaymentsLineItems,
      deletePayments,
      deleteVendors,
    ]);
    await prisma.$disconnect();
  });

  let paymentId: string;
  let paymentId2: string;
  let paymentId3: string;

  let paymentLineItemId: string;
  let secondPaymentLineItemId: string;

  it('Checks that Payments Should Be Empty ', async () => {
    const response = await request(app).get('/payments');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });

  it('Creates Vendor', async () => {
    const newVendor = [{ name: 'ABC', type: 'RETAIL' }];
    const response = await request(app).post('/vendors').send(newVendor);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added successfully' });
  });

  it('Creates Payment ', async () => {
    const newPayment = {
      header: {
        reference_number: '1',
        date_booked: '2021-09-20T00:00:00.000Z',
        payment_exch_rate: '1.23',
      },
      data: [
        {
          vendor: 'ABC',
          usd_cost: '20000.00',
          euro_payment: '15000.00',
          tracking_number: '1234-5678',
          description: 'some description',
        },
      ],
    };
    const response = await request(app).post('/payments/new').send(newPayment);
    expect(response.status).toEqual(201);
    paymentId = response.body.newId.id;
    expect(response.body.message).toEqual('Created New Invoice Successfully');
    expect(response.body.newId.date_booked).toEqual('2021-09-20T00:00:00.000Z');
    expect(response.body.newId.payment_exch_rate).toEqual(1.23);
    expect(response.body.newId.reference_number).toEqual('1');
  });

  it('Checks that Payment Created and gets LineItem Id ', async () => {
    const response = await request(app).get(`/payments/${paymentId}`);
    expect(response.status).toEqual(200);
    paymentLineItemId = response.body.data[0].id;

    const newPayment = {
      data: [
        {
          description: 'some description',
          euro_payment: '15000',
          id: paymentLineItemId,
          tracking_number: '1234-5678',
          usd_cost: '20000',
          vendor: 'ABC',
        },
      ],
      header: {
        date_booked: '2021-09-20T00:00:00.000Z',
        id: paymentId,
        payment_exch_rate: 1.23,
        reference_number: '1',
      },
    };
    expect(response.body).toEqual(newPayment);
  });

  it('Updates Newly Created Payment ', async () => {
    const updatedPayment = {
      formData: {
        id: paymentId,
        reference_number: '2',
        date_booked: '2022-09-20T00:00:00.000Z',
        payment_exch_rate: '2.34',
      },
      updatedList: [
        {
          id: paymentLineItemId,
          vendor: 'ABC',
          usd_cost: '40000.00',
          euro_payment: '30000.00',
          tracking_number: '5678-1234',
          description: 'description updated',
        },
      ],
    };

    const response = await request(app)
      .put(`/payments/${paymentId}`)
      .send(updatedPayment);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Updated Successfully' });
  });

  it('Checks that Payment was Updated', async () => {
    const response = await request(app).get(`/payments/${paymentId}`);
    expect(response.status).toEqual(200);
    paymentLineItemId = response.body.data[0].id;

    const updatedPayment = {
      header: {
        id: paymentId,
        reference_number: '2',
        date_booked: '2022-09-20T00:00:00.000Z',
        payment_exch_rate: 2.34,
      },
      data: [
        {
          id: paymentLineItemId,
          vendor: 'ABC',
          usd_cost: '40000',
          euro_payment: '30000',
          tracking_number: '5678-1234',
          description: 'description updated',
        },
      ],
    };
    expect(response.body).toEqual(updatedPayment);
  });

  it('Adds Line Item and Checks if All Properties Added', async () => {
    const addLineItem = [
      {
        vendor: 'ABC',
        usd_cost: '100000',
        euro_payment: '250000',
        tracking_number: '11111',
        description: 'additional line payment',
      },
    ];
    const response = await request(app)
      .post(`/payments/${paymentId}`)
      .send(addLineItem);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added Successfully' });

    const newResponse = await request(app).get(`/payments/${paymentId}`);
    expect(newResponse.status).toEqual(200);
    secondPaymentLineItemId = newResponse.body.data[1].id;
    const newResponseBody = newResponse.body.data[1];
    expect(newResponseBody.vendor).toEqual(addLineItem[0].vendor);
    expect(newResponseBody.usd_cost).toEqual(addLineItem[0].usd_cost);
    expect(newResponseBody.euro_payment).toEqual(addLineItem[0].euro_payment);
    expect(newResponseBody.tracking_number).toEqual(
      addLineItem[0].tracking_number
    );
    expect(newResponseBody.description).toEqual(addLineItem[0].description);
  });

  it('Deletes 2nd Line Item and Checks if Deleted', async () => {
    const lineItemToDelete = [{ id: secondPaymentLineItemId }];
    const response = await request(app)
      .delete(`/payments/${paymentId}/delete-line-items`)
      .send(lineItemToDelete);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });

    const newResponse = await request(app).get(`/payments/${paymentId}`);
    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.data).toHaveLength(1);
  });

  it('Gets New Empty Payment', async () => {
    const newEmptyPayment = {
      header: { reference_number: '', date_booked: '', payment_exch_rate: '' },
      data: [
        {
          id: 0,
          vendor: '',
          usd_cost: '',
          euro_payment: '',
          tracking_number: '',
          description: '',
        },
      ],
    };
    const response = await request(app).get(`/payments/new`);
    expect(response.body).toMatchObject(newEmptyPayment);
  });

  it('Creates 2 Additional New Payments ', async () => {
    const newPayment2 = {
      header: {
        reference_number: '2',
        date_booked: '2021-09-20T00:00:00.000Z',
        payment_exch_rate: '1.23',
      },
      data: [
        {
          vendor: 'ABC',
          usd_cost: '20000.00',
          euro_payment: '15000.00',
          tracking_number: '1234-5678',
          description: 'some description',
        },
      ],
    };
    const newPayment3 = {
      header: {
        reference_number: '3',
        date_booked: '2021-09-20T00:00:00.000Z',
        payment_exch_rate: '1.23',
      },
      data: [
        {
          vendor: 'ABC',
          usd_cost: '20000.00',
          euro_payment: '15000.00',
          tracking_number: '1234-5678',
          description: 'some description',
        },
      ],
    };
    const newResponse2 = await request(app)
      .post('/payments/new')
      .send(newPayment2);
    expect(newResponse2.status).toEqual(201);
    paymentId2 = newResponse2.body.newId.id;
    const newResponse3 = await request(app)
      .post('/payments/new')
      .send(newPayment3);
    expect(newResponse3.status).toEqual(201);
    paymentId3 = newResponse3.body.newId.id;
  });

  it('Goes to Next Record', async () => {
    const response = await request(app).get(`/payments/${paymentId}/next`);
    expect(response.body.id).toEqual(paymentId2);

    const nextResponse = await request(app).get(`/payments/${paymentId2}/next`);
    expect(nextResponse.body.id).toEqual(paymentId3);
  });

  it('Goes to Previous Record', async () => {
    const response = await request(app).get(`/payments/${paymentId3}/previous`);
    expect(response.body.id).toEqual(paymentId2);

    const nextResponse = await request(app).get(
      `/payments/${paymentId2}/previous`
    );
    expect(nextResponse.body.id).toEqual(paymentId);
  });

  it('Goes to First Record', async () => {
    const response = await request(app).get(`/payments/${paymentId3}/first`);
    expect(response.body.id).toEqual(paymentId);

    const anotherResponse = await request(app).get(
      `/payments/${paymentId2}/first`
    );
    expect(anotherResponse.body.id).toEqual(paymentId);
  });

  it('Goes to Last Record', async () => {
    const response = await request(app).get(`/payments/${paymentId}/last`);
    expect(response.body.id).toEqual(paymentId3);

    const anotherResponse = await request(app).get(
      `/payments/${paymentId2}/last`
    );
    expect(anotherResponse.body.id).toEqual(paymentId3);
  });

  it('Try to go past Last Record, return Reached Last Record', async () => {
    const response = await request(app).get(`/payments/${paymentId3}/next`);
    expect(response.body).toEqual({message: "Reached Last Record"});
  });

  
  it('Try to go before First Record, return Reached First Record', async () => {
    const response = await request(app).get(`/payments/${paymentId}/previous`);
    expect(response.body).toEqual({message: "Reached First Record"});
  });


  it('Deletes a Payment and Checks there is only 2 payments', async () => {
    const response = await request(app).delete(`/payments/${paymentId3}`);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });

    const newResponse = await request(app).get('/payments');
    expect(newResponse.body.data).toHaveLength(2);
  });
});

