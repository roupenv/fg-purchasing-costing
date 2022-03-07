import { prisma } from '../prismaClient';
import { InvoiceInterface } from '../../interfaces/InvoiceInterface';
import Services from '../baseServicesClass';
import e from 'express';

// export class MockInvoicePrismaServices extends Services implements InvoiceInterface {   // Temporarily Not implementing Interface
export class MockInvoicePrismaServices extends Services {
  constructor(id: number | undefined = undefined, payload: any | undefined = undefined, context: any = prisma) {
    super(id, payload, context);
  }

  async getAllInvoices() {
    const data = [
      {
        id: 72,
        invoice_number: '1/70 2021',
        date: '2021-07-26T00:00:00.000Z',
        vendor: 'FADEL',
        total_quantity: '377.00',
        invoice_total: '8270.85',
      },
      {
        id: 71,
        invoice_number: '1/69 2021',
        date: '2021-07-21T00:00:00.000Z',
        vendor: 'FADEL',
        total_quantity: '272.00',
        invoice_total: '6186.50',
      },
      {
        id: 70,
        invoice_number: '1/68 2021',
        date: '2021-07-15T00:00:00.000Z',
        vendor: 'FADEL',
        total_quantity: '590.00',
        invoice_total: '12820.75',
      },
    ];
    return {
      data: data,
    };
  }

  async getInvoice() {
    return {
      header: {
        id: 2,
        invoice_number: '1/102',
        date: '2018-12-24T00:00:00.000Z',
        vendor: 'FADEL',
      },
      data: [
        {
          id: 268,
          po_ref: null,
          product: 'ALFIE',
          color: 'BLACK',
          quantity: 75,
          price: '19',
          discount: '0',
          line_total: '1425',
          sample: false,
        },
        {
          id: 269,
          po_ref: null,
          product: 'ALFIE',
          color: 'TAN',
          quantity: 50,
          price: '19',
          discount: '0',
          line_total: '950',
          sample: false,
        },
      ],
    };
  }

  async getInvoiceLineItems() {
    return;
  }

  async contextLink() {
    return [
      {
        value: '1/70 2021',
        label: '1/70 2021-Mon Jul 26 2021',
      },
      {
        value: '1/69 2021',
        label: '1/69 2021-Wed Jul 21 2021',
      },
    ];
  }

  async getNextRecord() {
    if (this.id === 2){
      return { id: 3 };
    }
    else{
      throw new Error('error')
    }
  }

  async getPreviousRecord() {
    if (this.id === 3){
      return { id: 2 };
    }
    else{
      throw new Error('error')
  }
}

  async getFirstRecord() {
    return { id: 1 };
  }

  async getLastRecord() {
    return { id: 3 };
  }

  async getNewInvoice() {
    return {
        header: {
          invoice_number: "",
          date: "2021-09-15T20:24:37.385Z",
          vendor: ""
        },
        data: [
          {
            id: 0,
            po_ref: "",
            product: "",
            color: "",
            quantity: 0,
            price: 0,
            discount: 0,
            line_total: 0,
            sample: false
          }
        ]
    };
  }

  async createNewInvoice() {
    if(this.payload === 'valid client input'){
      const newId = 5;
      return newId;
    }
    else{
      throw new Error('error')
    }
  }

  async updateInvoice() {
    if (this.id !== 2) {
      throw new Error('error');
    }
  }

  async deleteLineItems() {
    if (this.id !== 2) {
      throw new Error('error');
    }
  }

  async deleteInvoice() {
    if (this.id !== 2) {
      throw new Error('error');
    }
  }

  async addLineItems() {
    if (this.id !== 2) {
      throw new Error('error');
    }
  }
}
