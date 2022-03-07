import { TarrifInterface } from '../interfaces/TarrifInterface';
import Services from './baseServicesClass';
import { prisma } from './prismaClient';

export class TarrifPrismaServices extends Services implements TarrifInterface {
  async getAllTarrifs() {
    const allTarrifs = await prisma.tarrif.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        tarrif_code: true,
        description: true,
        material: true,
      },
    });

    return allTarrifs;
  }

  async getTarrif() {
    const tarrif = await prisma.tarrif.findUnique({
      where: {
        id: this.id,
      },
      select: {
        id: true,
        tarrif_code: true,
        description: true,
        material: true,
      },
    });

    return tarrif;
  }

  async getNewTarrif() {
    const newEmptyTarrif = {
      tarrif_code: '',
      description: '',
      material: '',
    };
    return newEmptyTarrif;
  }

  async updateTarrif() {
    const updateData = this.payload;

    try {
      const updateTarrif = await prisma.tarrif.update({
        where: {
          id: updateData.id,
        },
        data: {
          tarrif_code: updateData.tarrif_code,
          description: updateData.description,
          material: updateData.material,
        },
      });
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async createNewTarrif() {
    const newData = this.payload;

    try {
      const newTarrif = await prisma.tarrif.create({
        data: {
          tarrif_code: newData.tarrif_code,
          description: newData.description,
          material: newData.material,
        },
      });
      const newId = newTarrif.id;
      return newId;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async deleteTarrif() {
    const deleteTarrifId = this.id;

    try {
      const deleteTarrif = await prisma.tarrif.delete({
        where: {
          id: deleteTarrifId,
        },
      });
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async getNextRecord() {
    const allTarrifs = await this.getAllTarrifs();
    const currentIndex = allTarrifs?.findIndex((tarrif) => tarrif.id === this.id);
    let nextId: number;
    try {
      nextId = allTarrifs[currentIndex + 1].id;
    } catch (error) {
      nextId = allTarrifs[allTarrifs.length - 1].id;
      throw new Error('Reached Last Record');
    }
    return { id: nextId };
  }

  async getPreviousRecord() {
    const allTarrifs = await this.getAllTarrifs();
    const currentIndex = allTarrifs.findIndex((tarrif) => tarrif.id === this.id);
    let prevId: number;
    try {
      prevId = allTarrifs[currentIndex - 1].id;
    } catch (error) {
      prevId = allTarrifs[0].id;
      throw new Error('Reached First Record');
    }
    return { id: prevId };
  }

  async contextLink() {
    const allTarrifs = await this.getAllTarrifs();
    const contextLink = allTarrifs?.map((item) => {
      return {
        value: item.tarrif_code,
        label: item.tarrif_code + ' ' + item.material,
      };
    });
    return contextLink;
  }
}
