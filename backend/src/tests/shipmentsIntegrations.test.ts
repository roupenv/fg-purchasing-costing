import { prisma } from '../services/prismaClient';
import { app } from '../app';
import request from 'supertest';

// beforeAll(async () => {
//   const deleteVendors = prisma.vendor.deleteMany();
//   const deleteTarrifs = prisma.tarrif.deleteMany();
//   const deleteDutyLineItems = prisma.duty_line_items.deleteMany();
//   const deleteProducts = prisma.product.deleteMany();
//   const deleteShipmentInvoice = prisma.shipment_invoice.deleteMany();
//   const deleteInvoiceLineItems = prisma.invoice_line_items.deleteMany();
//   const deleteInvoice = prisma.invoice.deleteMany();
//   const deleteShipment = prisma.shipment.deleteMany();

//   await prisma.$transaction([
//     deleteVendors,
//     deleteTarrifs,
//     deleteProducts,
//     deleteDutyLineItems,
//     deleteShipmentInvoice,
//     deleteInvoiceLineItems,
//     deleteInvoice,
//     deleteShipment,
//   ]);
//   await prisma.$disconnect();
// });

describe.only('Shipment Integration Tests', () => {
  beforeAll(async () => {
    const newVendor = [{ name: 'ABC', type: 'Shipping' }];
    const vendorResponse = await request(app).post('/vendors').send(newVendor);
    expect(vendorResponse.status).toEqual(201);
    expect(vendorResponse.body).toEqual({ message: 'Added successfully' });

    const newTarrif = [{ tarrif_code: '1234', description: '10% Duty', material: 'Leather' }];
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
    const productResponse = await request(app).post('/products').send(newProduct);
    expect(productResponse.status).toEqual(201);
    expect(productResponse.body).toEqual({ message: 'Added Successfully' });

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

    expect(response.body).toEqual({
      message: 'Created New Invoice Successfully',
      newId: expect.any(Number),
    });

    // const expectedResponse = {
    //   header: {
    //     id: expect.any(Number),
    //     invoice_number: '1/1',
    //     date: '2021-09-20T00:00:00.000Z',
    //     vendor: 'ABC',
    //   },
    //   data: expect.arrayContaining([
    //     expect.objectContaining({
    //       id: expect.any(Number),
    //       po_ref: expect.any(String),
    //       product: expect.any(String),
    //       color: expect.any(String),
    //       quantity: expect.any(Number),
    //       price: expect.any(String),
    //       discount: expect.any(String),
    //       line_total: expect.any(String),
    //       sample: expect.any(Boolean),
    //     }),
    //   ]),
    // };
    // const newResponse = await request(app).get(`/invoices/${invoiceId}`);
    // invoiceLineItemId = newResponse.body.data[0].id;
    // invoiceLineItemId2 = newResponse.body.data[1].id;

    // expect(newResponse.status).toEqual(200);
    // expect(newResponse.body).toEqual(expectedResponse);
  });

  afterAll(async () => {
    const deleteDutyLineItems = prisma.duty_line_items.deleteMany();
    const deleteVendors = prisma.vendor.deleteMany();
    const deleteTarrifs = prisma.tarrif.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    const deleteShipmentInvoice = prisma.shipment_invoice.deleteMany();
    const deleteInvoiceLineItems = prisma.invoice_line_items.deleteMany();
    const deleteInvoice = prisma.invoice.deleteMany();
    const deleteShipment = prisma.shipment.deleteMany();

    await prisma.$transaction([
      deleteDutyLineItems,
      deleteVendors,
      deleteTarrifs,
      deleteProducts,
      deleteShipmentInvoice,
      deleteInvoiceLineItems,
      deleteInvoice,
      deleteShipment,
    ]);
    await prisma.$disconnect();
  });

  let shipmentId: string;
  let shipmentId2: string;
  let shipmentId3: string;

  let shipmentLineItemId: string;
  let shipmentLineItemId2: string;

  it('Checks that Shipments Should Be Empty ', async () => {
    const response = await request(app).get('/shipments');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [] });
  });

  it('Creates Shipment', async () => {
    const newShipment = {
      header: {
        shipment_ref: '123456',
        vendor: 'ABC',
        departure_date: '2021-09-20T00:00:00.000Z',
        arrival_date: '2021-09-20T00:00:00.000Z',
        trans_method: 'AIR',
        weight: 500,
        weight_unit: 'kg',
        volume: 20,
        volume_unit: 'M3',
        chargeable_weight: 600,
        chargeable_weight_unit: 'kg',
        packs: 20,
        packs_type: 'CTN',
        units_shipped: 500,
        shipping_costs: 10000,
        duty_costs: 1000,
        insurance_costs: 50,
        euro_value: 20000,
        us_value: 25000,
        shipment_exch_rate: 0.25,
      },
      data: [
        {
          tarrif: '1234',
          units_entered: 5,
          value_entered: 200,
          duty_percentage: 0.1,
          processing_fee_percentage: 0.35,
          line_total: 90.0,
        },
      ],
    };

    const response = await request(app).post('/shipments/new').send(newShipment);
    expect(response.status).toEqual(201);
    shipmentId = response.body.newId;
    expect(response.body).toEqual({
      message: 'Created New Shipment Successfully',
      newId: shipmentId,
    });

    const expectedResponse = {
      header: {
        id: shipmentId,
        shipment_ref: '123456',
        shipment_invoice: '1/1',
        vendor: 'ABC',
        departure_date: '2021-09-20T00:00:00.000Z',
        arrival_date: '2021-09-20T00:00:00.000Z',
        trans_method: 'AIR',
        weight: 500,
        weight_unit: 'kg',
        volume: 20,
        volume_unit: 'M3',
        chargeable_weight: 600,
        chargeable_weight_unit: 'kg',
        packs: 20,
        packs_type: 'CTN',
        units_shipped: 500,
        shipping_costs: String(10000),
        duty_costs: String(1000),
        insurance_costs: String(50),
        euro_value: String(20000),
        us_value: String(25000),
        shipment_exch_rate: 0.25,
      },
      data: [
        {
          id: expect.any(Number),
          tarrif: '1234',
          units_entered: 5,
          value_entered: String(200),
          duty_percentage: 0.1,
          processing_fee_percentage: 0.35,
          line_total: String(90.0),
        },
      ],
    };

    const newResponse = await request(app).get(`/shipments/${shipmentId}`);
    shipmentLineItemId = newResponse.body.data[0].id;

    expect(newResponse.status).toEqual(200);
    expect(newResponse.body).toEqual(expectedResponse);
  });

  it('Updates Newly Created Shipment and Line Item ', async () => {
    const updatedShipment = {
      formData: {
        shipment_ref: 'Updated',
        vendor: 'ABC',
        departure_date: '2022-09-20T00:00:00.000Z',
        arrival_date: '2022-09-20T00:00:00.000Z',
        trans_method: 'SEA',
        weight: 500,
        weight_unit: 'kg',
        volume: 25,
        volume_unit: 'M3',
        chargeable_weight: 600,
        chargeable_weight_unit: 'kg',
        packs: 20,
        packs_type: 'CTN',
        units_shipped: 500,
        shipping_costs: 10000,
        duty_costs: 1000,
        insurance_costs: 75,
        euro_value: 20000,
        us_value: 25000,
        shipment_exch_rate: 0.25,
      },
      updatedList: [
        {
          id: shipmentLineItemId,
          tarrif: '1234',
          units_entered: 10,
          value_entered: 400,
          duty_percentage: 0.1,
          processing_fee_percentage: 0.35,
          line_total: 90.0,
        },
      ],
    };
    const response = await request(app)
      .put(`/shipments/${shipmentId}`)
      .send(updatedShipment);
    // expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Updated Successfully' });

    const newResponse = await request(app).get(`/shipments/${shipmentId}`);

    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.header.shipment_ref).toEqual('Updated');
    expect(newResponse.body.header.departure_date).toEqual('2022-09-20T00:00:00.000Z');
    expect(newResponse.body.header.weight).toEqual(500);
    expect(newResponse.body.header.insurance_costs).toEqual("75");
    expect(newResponse.body.data[0].units_entered).toEqual(10);
    expect(newResponse.body.data[0].value_entered).toEqual("400");
  });

  it('Adds Line Item and Checks if All Properties Added', async () => {
    const addLineItem = [
      {
        tarrif: '1234',
        units_entered: 1,
        value_entered: 200.20,
        duty_percentage: 0.2,
        processing_fee_percentage: 0.0035,
        line_total: 300,
      },
    ];
    const response = await request(app)
      .post(`/shipments/${shipmentId}`)
      .send(addLineItem);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Added Successfully' });

    const newResponse = await request(app).get(`/shipments/${shipmentId}`);
    shipmentLineItemId2 = newResponse.body.data[1].id;
    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.data).toHaveLength(2);
  });

  it('Deletes 2nd Line Item and Checks if Deleted', async () => {
    const lineItemToDelete = [{ id: shipmentLineItemId2 }];
    const response = await request(app)
      .delete(`/shipments/${shipmentId}/delete-line-items`)
      .send(lineItemToDelete);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });

    const newResponse = await request(app).get(`/shipments/${shipmentId}`);
    expect(newResponse.status).toEqual(200);
    expect(newResponse.body.data).toHaveLength(1);
    expect(newResponse.body.data[0].id).toEqual(shipmentLineItemId);
  });

  it('Gets New Empty Invoice', async () => {
    const newEmptyShipment = {
      header: {
        shipment_ref: '',
        vendor: '',
        shipment_invoice: '',
        departure_date: '',
        arrival_date: '',
        trans_method: 'AIR',
        weight: 0,
        weight_unit: 'M3',
        volume: 0,
        volume_unit: 'M3',
        chargeable_weight: 0,
        chargeable_weight_unit: 'KG',
        packs: 0,
        packs_type: 'CTN',
        units_shipped: 0,
        shipping_costs: 0,
        duty_costs: 0,
        insurance_costs: 0,
        euro_value: 0,
        us_value: 0,
        shipment_exch_rate: 0,
      },
      data: [
        {
          id: 0,
          tarrif: '',
          units_entered: 0,
          value_entered: 0 ,
          duty_percentage: 0,
          processing_fee_percentage: 0,
          line_total: 0,
        },
      ],
    }; 
    const response = await request(app).get(`/shipments/new`);
    expect(response.body).toMatchObject(newEmptyShipment);
  });

  it('Creates 2 Additional New Shipments ', async () => {
    const newShipment2 = {
      header: {
        shipment_ref: '2',
        vendor: 'ABC',
        departure_date: '2021-09-20T00:00:00.000Z',
        arrival_date: '2021-09-20T00:00:00.000Z',
        trans_method: 'AIR',
        weight: 500,
        weight_unit: 'kg',
        volume: 20,
        volume_unit: 'M3',
        chargeable_weight: 600,
        chargeable_weight_unit: 'kg',
        packs: 20,
        packs_type: 'CTN',
        units_shipped: 500,
        shipping_costs: 10000,
        duty_costs: 1000,
        insurance_costs: 50,
        euro_value: 20000,
        us_value: 25000,
        shipment_exch_rate: 0.25,
      },
      data: [
        {
          tarrif: '1234',
          units_entered: 5,
          value_entered: 200,
          duty_percentage: 0.1,
          processing_fee_percentage: 0.35,
          line_total: 90.0,
        },
      ],
    };

    const newShipment3 = {
      header: {
        shipment_ref: '2',
        vendor: 'ABC',
        departure_date: '2021-09-20T00:00:00.000Z',
        arrival_date: '2021-09-20T00:00:00.000Z',
        trans_method: 'AIR',
        weight: 500,
        weight_unit: 'kg',
        volume: 20,
        volume_unit: 'M3',
        chargeable_weight: 600,
        chargeable_weight_unit: 'kg',
        packs: 20,
        packs_type: 'CTN',
        units_shipped: 500,
        shipping_costs: 10000,
        duty_costs: 1000,
        insurance_costs: 50,
        euro_value: 20000,
        us_value: 25000,
        shipment_exch_rate: 0.25,
      },
      data: [
        {
          tarrif: '1234',
          units_entered: 5,
          value_entered: 200,
          duty_percentage: 0.1,
          processing_fee_percentage: 0.35,
          line_total: 90.0,
        },
      ],
    };

    const newResponse2 = await request(app)
      .post('/shipments/new')
      .send(newShipment2);
    expect(newResponse2.status).toEqual(201);
    shipmentId2 = newResponse2.body.newId;

    const newResponse3 = await request(app)
      .post('/shipments/new')
      .send(newShipment3);
    expect(newResponse3.status).toEqual(201);
    shipmentId3 = newResponse3.body.newId;

  });

  it('Goes to Next Record', async () => {
    const response = await request(app).get(`/shipments/${shipmentId}/next`);
    expect(response.body.id).toEqual(shipmentId2);

    const nextResponse = await request(app).get(`/shipments/${shipmentId2}/next`);
    expect(nextResponse.body.id).toEqual(shipmentId3);
  });

  it('Goes to Previous Record', async () => {
    const response = await request(app).get(`/shipments/${shipmentId3}/previous`);
    expect(response.body.id).toEqual(shipmentId2);

    const nextResponse = await request(app).get(
      `/shipments/${shipmentId2}/previous`
    );
    expect(nextResponse.body.id).toEqual(shipmentId);
  });

  it('Goes to First Record', async () => {
    const response = await request(app).get(`/shipments/${shipmentId3}/first`);
    expect(response.body.id).toEqual(shipmentId);

    const anotherResponse = await request(app).get(
      `/shipments/${shipmentId2}/first`
    );
    expect(anotherResponse.body.id).toEqual(shipmentId);
  });

  it('Goes to Last Record', async () => {
    const response = await request(app).get(`/shipments/${shipmentId}/last`);
    expect(response.body.id).toEqual(shipmentId3);

    const anotherResponse = await request(app).get(
      `/shipments/${shipmentId2}/last`
    );
    expect(anotherResponse.body.id).toEqual(shipmentId3);
  });


  it('Try to go past Last Record, return Reached Last Record', async () => {
    const response = await request(app).get(`/shipments/${shipmentId3}/next`);
    expect(response.body).toEqual({"message": "Reached Last Record"});
  });

  
  it('Try to go before First Record, return Reached First Record', async () => {
    const response = await request(app).get(`/shipments/${shipmentId}/previous`);
    expect(response.body).toEqual({"message": "Reached First Record"});
  });

  it('Deletes a Shipment and Checks there is only 2 Shipments', async () => {
    const response = await request(app).delete(`/shipments/${shipmentId3}`);
    expect(response.body).toEqual({ message: 'Deleted Successfully' });

    const newResponse = await request(app).get('/shipments');
    expect(newResponse.body.data).toHaveLength(2);
  });
});

