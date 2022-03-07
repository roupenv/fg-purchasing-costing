import { prisma, Prisma } from './prismaClient';
import Services from './baseServicesClass';
import { PaymentInterface } from '../interfaces/PaymentInterface';

export class PaymentPrismaServices extends Services implements PaymentInterface {
  async getAllPayments() {
    const allPayments = await prisma.payment.findMany({
      orderBy: {
        date_booked: 'desc',
      },
      select: {
        id: true,
        reference_number: true,
        date_booked: true,
        payment_exch_rate: true,
        payment_line_item: {
          select: {
            usd_cost: true,
            euro_payment: true,
          },
        },
      },
    });
    const data = allPayments.map((payment) => {
      return {
        id: payment.id,
        reference_number: payment.reference_number,
        date_booked: payment.date_booked,
        payment_exch_rate: payment.payment_exch_rate,
        total_usd_cost: payment.payment_line_item
          .reduce((prev, cur) => Number(prev) + Number(cur.usd_cost), 0)
          .toFixed(2),
        total_euro_payment: payment.payment_line_item
          .reduce((prev, cur) => Number(prev) + Number(cur.euro_payment), 0)
          .toFixed(2),
        number_payees: payment.payment_line_item.length,
      };
    });

    return data;
  }

  async getPayment() {
    const payment = await prisma.payment.findUnique({
      where: {
        id: this.id,
      },
      select: {
        id: true,
        reference_number: true,
        date_booked: true,
        payment_exch_rate: true,
      },
    });

    const header = {
      id: payment?.id,
      reference_number: payment?.reference_number,
      date_booked: payment?.date_booked,
      payment_exch_rate: payment?.payment_exch_rate,
    };

    const paymentLineItems = await this.getPaymentLineItems();

    return {
      header: header,
      data: paymentLineItems,
    };
  }

  async getPaymentLineItems() {
    const paymentLineItems = await prisma.payment.findUnique({
      where: {
        id: this.id,
      },
      select: {
        payment_line_item: {
          orderBy: {
            id: 'asc',
          },
          select: {
            id: true,
            vendor: {
              select: {
                name: true,
              },
            },
            usd_cost: true,
            euro_payment: true,
            tracking_number: true,
            description: true,
          },
        },
      },
    });

    const paymentLineItemsFlattened = paymentLineItems?.payment_line_item.map((lineItem) => {
      return {
        id: lineItem.id,
        vendor: lineItem.vendor.name,
        usd_cost: lineItem.usd_cost,
        euro_payment: lineItem.euro_payment,
        tracking_number: lineItem.tracking_number,
        description: lineItem.description,
      };
    });
    return paymentLineItemsFlattened;
  }

  async getNewPayment() {
    const getNewPayment = {
      header: {
        reference_number: '',
        date_booked: null,
        payment_exch_rate: 0,
      },
      data: [
        {
          id: 0,
          vendor: '',
          usd_cost: 0,
          euro_payment: 0,
          tracking_number: '',
          description: '',
        },
      ],
    };
    return getNewPayment;
  }

  async createNewPayment() {
    const header = this.payload.header;
    const data = this.payload.data;
    const paymentLineItems = data.map((line: any) => {
      return {
        vendor: {
          connect: {
            name: line.vendor,
          },
        },
        usd_cost: Number(line.usd_cost),
        euro_payment: Number(line.euro_payment),
        tracking_number: line.tracking_number,
        description: line.description,
      };
    });

    try {
      const newPayment = await prisma.payment.create({
        data: {
          reference_number: header.reference_number,
          date_booked: header.date_booked,
          payment_exch_rate: Number(header.payment_exch_rate),
          payment_line_item: {
            create: paymentLineItems.reverse(),
          },
        },
      });
      const newId = newPayment.id;
      return newId;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async updateEntirePayment() {
    const header = this.payload.header;
    const data = this.payload.data;

    const updatedDataList = data.map((lineItem: any) => {
      return {
        vendor: {
          connect: {
            name: lineItem.vendor,
          },
        },
        usd_cost: Number(lineItem.usd_cost),
        euro_payment: Number(lineItem.euro_payment),
        tracking_number: lineItem.tracking_number,
        description: lineItem.description,
      };
    });

    try {
      const deleteAllNestedRecords = this.context.payment.update({
        where: {
          id: this.id,
        },
        data: {
          payment_line_item: {
            deleteMany: {},
          },
        },
      });

      const updatePayment = prisma.payment.update({
        where: {
          id: this.id,
        },
        data: {
          reference_number: header.reference_number,
          date_booked: header.date_booked,
          payment_exch_rate: Number(header.payment_exch_rate),
          payment_line_item: {
            create: updatedDataList.reverse(),
          },
        },
      });

      const transaction = await this.context.$transaction([deleteAllNestedRecords, updatePayment]);
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async deletePayment() {
    const paymentId = this.id;
    const paymentLineItemsToDelete = prisma.payment_line_item.deleteMany({
      where: {
        payment_fk: paymentId,
      },
    });
    const paymentToDelete = prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });

    try {
      const transaction = await prisma.$transaction([paymentLineItemsToDelete, paymentToDelete]);
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async getNextRecord() {
    const allPayments = await this.getAllPayments();
    const currentIndex = allPayments.findIndex((payment) => payment.id === this.id);
    let nextId;
    try {
      nextId = allPayments[currentIndex + 1].id;
    } catch (error) {
      nextId = allPayments[allPayments.length - 1].id;
      throw new Error('Reached Last Record');
    }
    return { id: nextId };
  }

  async getPreviousRecord() {
    const allPayments = await this.getAllPayments();
    const currentIndex = allPayments.findIndex((invoice) => invoice.id === this.id);
    let prevId;
    try {
      prevId = allPayments[currentIndex - 1].id;
    } catch (error) {
      prevId = allPayments[0].id;
      throw new Error('Reached First Record');
    }
    return { id: prevId };
  }
}
