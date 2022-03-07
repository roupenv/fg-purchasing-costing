import { prisma, Prisma } from './prismaClient';
import Services from './baseServicesClass';
import { ShipmentsInterface } from '../interfaces/ShipmentsInterface';

export class ShipmentPrismaService extends Services implements ShipmentsInterface {
  async getAllShipments() {
    const allShipments = await prisma.shipment.findMany({
      orderBy: {
        arrival_date: 'desc',
      },
      select: {
        id: true,
        shipment_ref: true,
        arrival_date: true,
        trans_method: true,
        packs: true,
        units_shipped: true,
        shipping_costs: true,
        shipment_invoice: {
          select: {
            invoice: {
              select: {
                invoice_number: true,
              },
            },
          },
        },
        duty_costs: true,
        insurance_costs: true,
        vendor: {
          select: {
            name: true,
          },
        },
      },
    });

    const data = allShipments.map((shipment) => {
      let invoice;
      if (shipment.shipment_invoice.length === 0) {
        invoice = null;
      } else {
        invoice = shipment.shipment_invoice[0].invoice?.invoice_number;
      }
      return {
        id: shipment.id,
        shipment_ref: shipment.shipment_ref,
        invoice_number: invoice,
        arrival_date: shipment.arrival_date,
        trans_method: shipment.trans_method,
        packs: shipment.packs,
        units_shipped: shipment.units_shipped,
        shipping_costs: shipment.shipping_costs,
        duty_costs: shipment.duty_costs,
        insurance_costs: shipment.insurance_costs,
        vendor: shipment.vendor?.name,
      };
    });

    return data;
  }

  async getShipment() {
    const shipment = await prisma.shipment.findUnique({
      where: {
        id: this.id,
      },
      select: {
        id: true,
        shipment_ref: true,
        vendor: {
          select: {
            name: true,
          },
        },
        shipment_invoice: {
          select: {
            invoice: {
              select: {
                invoice_number: true,
              },
            },
          },
        },
        departure_date: true,
        arrival_date: true,
        trans_method: true,
        weight: true,
        weight_unit: true,
        volume: true,
        volume_unit: true,
        chargeable_weight: true,
        chargeable_weight_unit: true,
        packs: true,
        packs_type: true,
        units_shipped: true,
        shipping_costs: true,
        duty_costs: true,
        insurance_costs: true,
        euro_value: true,
        us_value: true,
      },
    });

    let shipmentInvoice;
    if (shipment?.shipment_invoice.length === 0) {
      shipmentInvoice = '';
    } else {
      shipmentInvoice = shipment?.shipment_invoice[0].invoice?.invoice_number;
    }

    let header;
    if (shipment) {
      header = {
        id: shipment.id,
        shipment_ref: shipment.shipment_ref,
        vendor: shipment.vendor?.name,
        shipment_invoice: shipmentInvoice,
        departure_date: shipment.departure_date,
        arrival_date: shipment.arrival_date,
        trans_method: shipment.trans_method,
        weight: shipment.weight,
        weight_unit: shipment.weight_unit,
        volume: shipment.volume,
        volume_unit: shipment.volume_unit,
        chargeable_weight: shipment.chargeable_weight,
        chargeable_weight_unit: shipment.chargeable_weight_unit,
        packs: shipment.packs,
        packs_type: shipment.packs_type,
        units_shipped: shipment.units_shipped,
        shipping_costs: shipment.shipping_costs,
        duty_costs: shipment.duty_costs,
        insurance_costs: shipment.insurance_costs,
        euro_value: shipment.euro_value,
        us_value: shipment.us_value,
      };
    }

    const dutyLineItems = await this.getShipmentDutyLines();

    return {
      header: header,
      data: dutyLineItems,
    };
  }

  async getShipmentDutyLines() {
    const dutyLineItems = await prisma.shipment.findUnique({
      where: {
        id: this.id,
      },
      select: {
        duty_line_items: {
          orderBy: { id: 'asc' },
          select: {
            id: true,
            tarrif: {
              select: {
                tarrif_code: true,
              },
            },
            units_entered: true,
            value_entered: true,
            duty_percentage: true,
            processing_fee_percentage: true,
            line_total: true,
          },
        },
      },
    });

    const dutyLineItemsFlat = dutyLineItems?.duty_line_items.map((item) => {
      return {
        id: item.id,
        tarrif: item.tarrif.tarrif_code,
        units_entered: item.units_entered,
        value_entered: item.value_entered,
        duty_percentage: item.duty_percentage,
        processing_fee_percentage: item.processing_fee_percentage,
        line_total: item.line_total,
      };
    });
    return dutyLineItemsFlat;
  }

  async getNewShipment() {
    const getNewShipment = {
      header: {
        shipment_ref: '',
        vendor: '',
        shipment_invoice: '',
        departure_date: '',
        arrival_date: '',
        trans_method: 'AIR',
        weight: 0,
        weight_unit: 'KG',
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
      },
      data: [
        {
          id: 0,
          tarrif: '',
          units_entered: 0,
          value_entered: 0,
          duty_percentage: 0,
          processing_fee_percentage: 0.003464,
          line_total: 0,
        },
      ],
    };
    return getNewShipment;
  }

  async createNewShipment() {
    const header = this.payload.header;
    const data = this.payload.data;

    const dutyLineItems = data.map((line: any) => {
      if (line.tarrif) {
        return {
          tarrif: {
            connect: {
              tarrif_code: line.tarrif,
            },
          },
          units_entered: Number(line.units_entered),
          value_entered: Number(line.value_entered),
          duty_percentage: Number(line.duty_percentage),
          processing_fee_percentage: Number(line.processing_fee_percentage),
          line_total: Number(line.line_total),
        };
      } else {
        return undefined;
      }
    });

    const invoiceId = await this.getRelatedInvoiceId(header.shipment_invoice);
    try {
      const newShipment = await prisma.shipment.create({
        data: {
          shipment_ref: header.shipment_ref,
          vendor:
            header.vendor === ''
              ? undefined
              : {
                  connect: {
                    name: header.vendor,
                  },
                },
          shipment_invoice:
            invoiceId === undefined
              ? invoiceId
              : {
                  create: {
                    invoice: {
                      connect: {
                        id: invoiceId,
                      },
                    },
                  },
                },
          departure_date: header.departure_date === '' ? undefined : header.departure_date,
          arrival_date: header.arrival_date === '' ? undefined : header.arrival_date,
          trans_method: header.trans_method,
          weight: Number(header.weight),
          weight_unit: header.weight_unit,
          volume: Number(header.volume),
          volume_unit: header.volume_unit,
          chargeable_weight: Number(header.chargeable_weight),
          chargeable_weight_unit: header.chargeable_weight_unit,
          packs: Number(header.packs),
          packs_type: header.packs_type,
          units_shipped: Number(header.units_shipped),
          shipping_costs: Number(header.shipping_costs),
          duty_costs: Number(header.duty_costs),
          insurance_costs: Number(header.insurance_costs),
          euro_value: Number(header.euro_value),
          us_value: Number(header.us_value),
          duty_line_items:
            data[0].tarrif === ''
              ? undefined
              : {
                  create: dutyLineItems.reverse(),
                },
        },
      });
      return newShipment.id;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async getNextRecord() {
    const allShipments = await this.getAllShipments();
    const currentIndex = allShipments.findIndex((shipment) => shipment.id === this.id);
    let nextId;
    try {
      nextId = allShipments[currentIndex + 1].id;
    } catch (error) {
      nextId = allShipments[allShipments.length - 1].id;
      throw new Error('Reached Last Record');
    }
    return { id: nextId };
  }

  async getPreviousRecord() {
    const allShipments = await this.getAllShipments();
    const currentIndex = allShipments.findIndex((shipment) => shipment.id === this.id);
    let prevId;
    try {
      prevId = allShipments[currentIndex - 1].id;
    } catch (error) {
      prevId = allShipments[0].id;
      throw new Error('Reached First Record');
    }
    return { id: prevId };
  }

  async getShipmentInvoiceId() {
    const shipmentInvoiceId = await prisma.shipment.findFirst({
      where: {
        id: this.id,
      },
      select: {
        shipment_invoice: {
          select: {
            id: true,
          },
        },
      },
    });
    return shipmentInvoiceId;
  }

  async getRelatedInvoiceId(shipmentInvoice: string) {
    try {
      const invoice = await prisma.invoice.findFirst({
        where: {
          invoice_number: shipmentInvoice,
        },
      });
      return invoice?.id;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }


  async updateEntireShipment() {
    const header = this.payload.header;
    const data = this.payload.data;
    const shipmentInvoiceId = await this.getShipmentInvoiceId();

    const updateDataList = await data.map((lineItem: any) => {
      return {
        tarrif: {
          connect: {
            tarrif_code: lineItem.tarrif,
          },
        },
        units_entered: Number(lineItem.units_entered),
        value_entered: Number(lineItem.value_entered),
        duty_percentage: Number(lineItem.duty_percentage),
        processing_fee_percentage: Number(lineItem.processing_fee_percentage),
        line_total: (
          Number(lineItem.value_entered) * Number(lineItem.duty_percentage) +
          Number(lineItem.value_entered) * Number(lineItem.processing_fee_percentage)
        ).toFixed(2),
      };
    });
    const invoiceId = await this.getRelatedInvoiceId(header.shipment_invoice);

    try {
      const deleteAllNestedRecords = this.context.shipment.update({
        where: {
          id: this.id,
        },
        data: {
          shipment_invoice: {
            deleteMany: {},
          },
          duty_line_items: {
            deleteMany: {},
          },
        },
      });

      const updateShipment = prisma.shipment.update({
        where: {
          id: this.id,
        },
        data: {
          shipment_ref: header.shipment_ref,
          vendor: {
            connect: {
              name: header.vendor,
            },
          },
          shipment_invoice: {
            upsert: {
              where: {
                id: shipmentInvoiceId?.shipment_invoice[0].id,
              },
              update: {
                invoice: {
                  connect: {
                    id: invoiceId,
                  },
                },
              },
              create: {
                invoice: {
                  connect: {
                    id: invoiceId,
                  },
                },
              },
            },
          },
          departure_date: header.departure_date,
          arrival_date: header.arrival_date,
          trans_method: header.trans_method,
          weight: Number(header.weight),
          weight_unit: header.weight_unit,
          volume: Number(header.volume),
          volume_unit: header.volume_unit,
          chargeable_weight: Number(header.chargeable_weight),
          chargeable_weight_unit: header.chargeable_weight_unit,
          packs: Number(header.packs),
          packs_type: header.packs_type,
          units_shipped: Number(header.units_shipped),
          shipping_costs: Number(header.shipping_costs),
          duty_costs: Number(header.duty_costs),
          insurance_costs: Number(header.insurance_costs),
          euro_value: Number(header.euro_value),
          us_value: Number(header.us_value),
          duty_line_items: {
            create: updateDataList.reverse(),
          },
        },
      });

      const transaction = await this.context.$transaction([deleteAllNestedRecords, updateShipment]);
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async deleteShipment() {
    const shipmentId = this.id;
    const dutyLineItemsToDelete = prisma.duty_line_items.deleteMany({
      where: {
        shipment_fk: shipmentId,
      },
    });
    const shipmentToDelete = prisma.shipment.delete({
      where: {
        id: shipmentId,
      },
    });
    const shipmentInvoiceToDelete = prisma.shipment_invoice.deleteMany({
      where: {
        shipment_id: shipmentId,
      },
    });
    try {
      const transaction = await prisma.$transaction([dutyLineItemsToDelete, shipmentInvoiceToDelete, shipmentToDelete]);
    } catch (e: any) {
      this.errorHandler(e);
    }
  }
}
