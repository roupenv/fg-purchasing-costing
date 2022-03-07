import { prisma } from './prismaClient';
import Services from './baseServicesClass';
import { VendorInterface } from '../interfaces/VendorInterface';

export class VendorPrismaServices extends Services implements VendorInterface {
  async getAllVendors() {
    const allVendors = await prisma.vendor.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    return allVendors;
  }

  async getVendor() {
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: this.id,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    return vendor;
  }

  async getNewVendor() {
    const newEmptyVendor = {
      name: '',
      type: '',
    };
    return newEmptyVendor;
  }

  async createNewVendor() {
    const addVendorData = this.payload;
    try {
      const addVendor = await prisma.vendor.create({
        data: {
          name: addVendorData.name,
          type: addVendorData.type,
        },
      });
      const newId = addVendor.id;
      return newId;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async updateVendor() {
    const updateData = this.payload;
    try {
      const updateVendor = await prisma.vendor.update({
        where: {
          id: updateData.id,
        },
        data: {
          name: updateData.name,
          type: updateData.type,
        },
      });
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async deleteVendor() {
    const deleteVendorId = this.id;

    try {
      const deleteVendor = await prisma.vendor.delete({
        where: {
          id: deleteVendorId,
        },
      });
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async getNextRecord() {
    const allVendors = await this.getAllVendors();
    const currentIndex = allVendors?.findIndex((vendor) => vendor.id === this.id);
    let nextId: number;
    try {
      nextId = allVendors[currentIndex + 1].id;
    } catch (error) {
      nextId = allVendors[allVendors.length - 1].id;
      throw new Error('Reached Last Record');
    }
    return { id: nextId };
  }

  async getPreviousRecord() {
    const allVendors = await this.getAllVendors();
    const currentIndex = allVendors.findIndex((vendor) => vendor.id === this.id);
    let prevId: number;
    try {
      prevId = allVendors[currentIndex - 1].id;
    } catch (error) {
      prevId = allVendors[0].id;
      throw new Error('Reached First Record');
    }
    return { id: prevId };
  }

  async contextLink() {
    const allVendors = await this.getAllVendors();
    if (allVendors) {
      const contextLink = allVendors.map((vendor) => {
        return {
          value: vendor.name,
          label: vendor.name,
        };
      });
      return contextLink;
    }
  }
}
