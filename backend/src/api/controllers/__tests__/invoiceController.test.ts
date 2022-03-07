import {MockInvoicePrismaServices} from '../../../services/__mocks__/mockInvoiceServices'
import {InvoiceController} from '../invoiceController'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { prisma } from '../../../services/prismaClient'

const mockInvoiceService = new MockInvoicePrismaServices()
const invoice = new InvoiceController(mockInvoiceService)


const req = getMockReq()
const { res, next, mockClear  } = getMockRes()


beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mockClear() // can also use clearMockRes()
});

afterEach(async () => {
 await prisma.$disconnect()
})



describe('Tests Invoice Controller', () =>{
  it("Should 200 and Return Some Invoices", async () => {
    await invoice.getAllInvoices(req, res)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      {
        data: [
          {
            id: 72,
            invoice_number: "1/70 2021",
            date: "2021-07-26T00:00:00.000Z",
            vendor: "FADEL",
            total_quantity: '377.00',
            invoice_total: '8270.85'
          },
          {
            id: 71,
            invoice_number: "1/69 2021",
            date: "2021-07-21T00:00:00.000Z",
            vendor: "FADEL",
            total_quantity: '272.00',
            invoice_total: '6186.50'
          },
          {
            id: 70,
            invoice_number: "1/68 2021",
            date: "2021-07-15T00:00:00.000Z",
            vendor: "FADEL",
            total_quantity: '590.00',
            invoice_total: '12820.75'
          },
        ],
      }
     );

  
  });

  it("Should 200 and Return an Invoice", async () => {
    await invoice.getInvoice(req, res)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        header: {
          id: 2,
          invoice_number: "1/102",
          date: "2018-12-24T00:00:00.000Z",
          vendor: "FADEL"
        },
        data: [
          {
            id: 268,
            po_ref: null,
            product: "ALFIE",
            color: "BLACK",
            quantity: 75,
            price: "19",
            discount: "0",
            line_total: "1425",
            sample: false
          },
          {
            id: 269,
            po_ref: null,
            product: "ALFIE",
            color: "TAN",
            quantity: 50,
            price: "19",
            discount: "0",
            line_total: "950",
            sample: false
          },
        ]
    })
  })

  it('Should 200 and Return Context-link', async () => {
    await invoice.contextLink(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        value: '1/70 2021',
        label: '1/70 2021-Mon Jul 26 2021',
      },
      {
        value: '1/69 2021',
        label: '1/69 2021-Wed Jul 21 2021',
      },
    ]);
  });


  it('Should 200 and Return Blank New Invoice', async () => {
    await invoice.getNewInvoice(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      header: {
        invoice_number: '',
        date: '2021-09-15T20:24:37.385Z',
        vendor: '',
      },
      data: [
        {
          id: 0,
          po_ref: '',
          product: '',
          color: '',
          quantity: 0,
          price: 0,
          discount: 0,
          line_total: 0,
          sample: false,
        },
      ],
    });
  });

  it('Should 200 and Get Next Record', async () => {
    const req = getMockReq({ params: { id: '2' } })
    await invoice.getNextRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({id: 3});
  });

  it('Should 400 and Not Get Next Record', async () => {
    await invoice.getNextRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'error'});
  });


  it('Should 200 and Get Previous Record', async () => {
    const req = getMockReq({ params: { id: '3' } })
    await invoice.getPreviousRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({id: 2});
  });


  it('Should 400 and Not Get Previous Record', async () => {
    await invoice.getPreviousRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'error'});
  });


  it('Should 200 and Get First Record', async () => {
    await invoice.getFirstRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({id: 1});
  });


  it('Should 200 and Get Last Record', async () => {
    await invoice.getLastRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({id: 3});
  });

  it('Should 201 and Add Line Items ', async () => {
    const req = getMockReq({ params: { id: '2' } })
    await invoice.addInvoiceLineItems(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: 'Added successfully' });
  });


  it('Should 201 and Add Line Items ', async () => {
    await invoice.addInvoiceLineItems(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'error' });
  });


  it('Should 201 and Update Line Items ', async () => {
    const req = getMockReq({ params: { id: '2' } })
    await invoice.updateInvoice(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: 'Updated Successfully' });
  });

  it('Should 400 and Not Update Line Items ', async () => {
    const error = await invoice.updateInvoice(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Could Not Update: ' + 'error' });
  });

  
  it('Should 201 and Delete Line Items ', async () => {
    const req = getMockReq({ params: { id: '2' } })
    await invoice.deleteInvoiceLineItems(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: 'Deleted Successfully' });
  });


  it('Should 400 and Not Delete Line Items ', async () => {
    await invoice.deleteInvoiceLineItems(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'error' });
  });

  it('Should 201 and Delete Invoice', async () => {
    const req = getMockReq({ params: { id: '2' } })
    await invoice.deleteInvoice(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: 'Deleted Successfully' });
  });

  it('Should 400 and Not Delete Invoice', async () => {
    await invoice.deleteInvoice(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'error' });
  });


  
  it('Should 201 and Create New Invoice', async () => {
    const req = getMockReq({ body: 'valid client input' })
    const response = await invoice.createNewInvoice(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: 'Created New Invoice Successfully', newId: 5 });
  });
  
  
    it('Should 400 and Not Create New Invoice ', async () => {
      const response = await invoice.createNewInvoice(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: 'error'});
    });
  
})