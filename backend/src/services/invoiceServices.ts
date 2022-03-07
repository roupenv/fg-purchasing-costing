import Services from './baseServicesClass';
import { InvoiceInterface } from '../interfaces/InvoiceInterface';
import { Prisma } from '.prisma/client';

export class InvoicePrismaServices extends Services implements InvoiceInterface {
  async getAllInvoices() {
    const allInvoices = await this.context.invoice.findMany({
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        invoice_number: true,
        date: true,
        vendor: {
          select: {
            name: true,
          },
        },
        invoice_line_items: {
          select: {
            quantity: true,
            line_total: true,
          },
        },
      },
    });
    const data = allInvoices.map((invoice) => {
      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        date: invoice.date,
        vendor: invoice.vendor?.name,
        total_quantity: invoice.invoice_line_items
          .reduce((prev, cur: { quantity: number | null }) => Number(prev) + Number(cur.quantity), 0)
          .toFixed(2),
        invoice_total: invoice.invoice_line_items
          .reduce((prev, cur: { line_total: Prisma.Decimal | null }) => Number(prev) + Number(cur.line_total), 0)
          .toFixed(2),
      };
    });

    return data;
  }

  async getInvoice() {
    const invoice = await this.context.invoice.findUnique({
      where: {
        id: this.id,
      },
      select: {
        id: true,
        invoice_number: true,
        date: true,
        vendor: {
          select: {
            name: true,
          },
        },
      },
    });
    const header = {
      id: invoice?.id,
      invoice_number: invoice?.invoice_number,
      date: invoice?.date,
      vendor: invoice?.vendor?.name,
    };
    const invoiceLineItems = await this.getInvoiceLineItems();

    return {
      header: header,
      data: invoiceLineItems,
    };
  }

  async getInvoiceLineItems() {
    const invoiceLineItems = await this.context.invoice.findUnique({
      where: {
        id: this.id,
      },
      select: {
        invoice_number: false,
        date: false,
        invoice_line_items: {
          orderBy: { id: 'asc' },
          select: {
            id: true,
            po_ref: true,
            product: {
              select: {
                product_name: true,
              },
            },
            color: true,
            quantity: true,
            price: true,
            discount: true,
            line_total: true,
            sample: true,
          },
        },
      },
    });
    if (invoiceLineItems && typeof invoiceLineItems === 'object') {
      //If not null && type is an object (Null is a JS object)
      const invoiceLineItemsFlattened = invoiceLineItems['invoice_line_items'].map((lineItem) => {
        return {
          id: lineItem.id,
          po_ref: lineItem.po_ref,
          product: lineItem.product?.product_name,
          color: lineItem.color,
          quantity: lineItem.quantity,
          price: lineItem.price,
          discount: lineItem.discount,
          line_total: lineItem.line_total,
          sample: lineItem.sample,
        };
      });
      return invoiceLineItemsFlattened;
    }
  }

  async getNewInvoice() {
    const getNewInvoice = {
      header: {
        invoice_number: '',
        date: new Date(),
        vendor: '',
      },
      data: [
        {
          id: 0,
          po_ref: '',
          product: '',
          color: '',
          quantity: 0,
          price: new Prisma.Decimal(0.0),
          discount: new Prisma.Decimal(0.0),
          line_total: new Prisma.Decimal(0.0),
          sample: false,
        },
      ],
    };
    return getNewInvoice;
  }

  async createNewInvoice() {
    const header = this.payload.header;
    const data = this.payload.data;

    const lineItems = data.map((line: any) => {
      return {
        po_ref: line.po_ref,
        product: {
          connect: {
            product_name: line.product,
          },
        },
        color: line.color,
        quantity: Number(line.quantity),
        price: Number(line.price),
        discount: Number(line.discount),
        line_total: (Number(line.quantity) * (Number(line.price) - Number(line.discount))).toFixed(2),
        sample: line.sample,
      };
    });
    try {
      const newInvoice = await this.context.invoice.create({
        data: {
          invoice_number: header.invoice_number,
          date: header.date,
          vendor: {
            connect: {
              name: header.vendor,
            },
          },
          invoice_line_items: {
            create: lineItems.reverse(),
          },
        },
      });
      const newId = newInvoice.id;
      return newId;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async updateEntireInvoice() {
    const header = this.payload.header;
    const data = this.payload.data;
    const updateDataList = data.map((lineItem: any) => {
      return {
        po_ref: lineItem.po_ref,
        product: {
          connect: {
            product_name: lineItem.product,
          },
        },
        color: lineItem.color,
        quantity: Number(lineItem.quantity),
        price: Number(lineItem.price),
        discount: Number(lineItem.discount),
        line_total: (Number(lineItem.quantity) * (Number(lineItem.price) - Number(lineItem.discount))).toFixed(2),
        sample: lineItem.sample,
      };
    });
    try {
      const deleteAllNestedRecords = this.context.invoice.update({
        where: {
          id: this.id,
        },
        data: {
          invoice_line_items: {
            deleteMany: {},
          },
        },
      });

      const updateInvoice = this.context.invoice.update({
        where: {
          id: this.id,
        },
        data: {
          invoice_number: header.invoice_number,
          date: header.date,
          vendor: {
            connect: {
              name: header.vendor,
            },
          },
          invoice_line_items: {
            create: updateDataList.reverse(),
          },
        },
      });

      const transaction = await this.context.$transaction([deleteAllNestedRecords, updateInvoice]);
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async deleteInvoice() {
    const invoiceId = this.id;
    const invoiceLineItemsToDelete = this.context.invoice_line_items.deleteMany({
      where: {
        invoice_fk: invoiceId,
      },
    });
    const invoiceToDelete = this.context.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    try {
      const transaction = await this.context.$transaction([invoiceLineItemsToDelete, invoiceToDelete]);
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async getNextRecord() {
    const allInvoices = await this.getAllInvoices();
    const currentIndex = allInvoices.findIndex((invoice) => invoice.id === this.id);
    let nextId: number;
    try {
      nextId = allInvoices[currentIndex + 1].id;
    } catch (error) {
      nextId = allInvoices[allInvoices.length - 1].id;
      throw new Error('Reached Last Record');
    }
    return { id: nextId };
  }

  async getPreviousRecord() {
    const allInvoices = await this.getAllInvoices();
    const currentIndex = allInvoices.findIndex((invoice) => invoice.id === this.id);
    let prevId: number;
    try {
      prevId = allInvoices[currentIndex - 1].id;
    } catch (error) {
      prevId = allInvoices[0].id;
      throw new Error('Reached First Record');
    }
    return { id: prevId };
  }

  async contextLink() {
    const allInvoices = await this.getAllInvoices();
    const contextLink = allInvoices.map((invoice: any) => {
      const date = new Date(invoice.date);
      return {
        value: invoice.invoice_number,
        label: invoice.invoice_number + '-' + date.toDateString(),
      };
    });
    return contextLink;
  }
}
