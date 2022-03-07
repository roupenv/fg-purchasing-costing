import { prisma } from './prismaClient';
import Services from './baseServicesClass';
import { ProductInterface } from '../interfaces/ProductInterface';
import { product } from '.prisma/client';

export class ProductPrismaServices extends Services implements ProductInterface {
  async getAllProducts() {
    const allProducts = await prisma.product.findMany({
      orderBy: {
        product_name: 'asc',
      },
      select: {
        id: true,
        product_name: true,
        bottom: true,
        collection: true,
        season: true,
        tarrif: {
          select: {
            tarrif_code: true,
          },
        },
      },
    });

    const allProductsFlattened = allProducts.map((product) => {
      return {
        id: product.id,
        product_name: product.product_name,
        bottom: product.bottom,
        collection: product.collection,
        season: product.season,
        tarrif_code: product.tarrif?.tarrif_code ?? null,
      };
    });

    return allProductsFlattened;
  }

  async getProduct() {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: this.id,
        },
        select: {
          id: true,
          product_name: true,
          bottom: true,
          collection: true,
          season: true,
          tarrif: {
            select: {
              tarrif_code: true,
            },
          },
        },
      });

      const productFlattened = {
        id: product?.id,
        product_name: product?.product_name,
        bottom: product?.bottom,
        collection: product?.collection,
        season: product?.season,
        tarrif_code: product?.tarrif?.tarrif_code ?? null,
      };

      return productFlattened;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async getNewProduct() {
    const newEmptyProduct = {
      product_name: '',
      bottom: '',
      collection: '',
      season: '',
      tarrif_code: '',
    };
    return newEmptyProduct;
  }

  async updateProduct() {
    const updateData = this.payload;
    try {
      const updateProduct: product = await prisma.product.update({
        where: {
          id: updateData.id,
        },
        data: {
          product_name: updateData.product_name,
          collection: updateData.collection,
          season: updateData.season,
          tarrif: updateData.tarrif_code
            ? {
                connect: {
                  tarrif_code: updateData.tarrif_code,
                },
              }
            : undefined,
        },
      });
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async createNewProduct() {
    const newProductData = this.payload;

    try {
      const newProduct = await prisma.product.create({
        data: {
          product_name: newProductData.product_name,
          bottom: newProductData.bottom,
          collection: newProductData.collection,
          season: newProductData.season,
          tarrif: newProductData.tarrif_code
            ? {
                connect: {
                  tarrif_code: newProductData.tarrif_code,
                },
              }
            : undefined,
        },
      });
      const newId = newProduct.id;
      return newId;
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async deleteProduct() {
    const deleteProductId = this.id;

    try {
      const deleteProduct = await prisma.product.delete({
        where: {
          id: deleteProductId,
        },
      });
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async contextLink() {
    const allProducts = await this.getAllProducts();
    if (allProducts) {
      const contextLink = allProducts.map((product) => {
        return {
          value: product.product_name,
          label: product.product_name,
        };
      });
      return contextLink;
    }
  }

  async getNextRecord() {
    const allProducts = await this.getAllProducts();
    const currentIndex = allProducts.findIndex((product) => product.id === this.id);
    let nextId: number;
    try {
      nextId = allProducts[currentIndex + 1].id;
    } catch (error) {
      nextId = allProducts[allProducts.length - 1].id;
      throw new Error('Reached Last Record');
    }
    return { id: nextId };
  }

  async getPreviousRecord() {
    const allProducts = await this.getAllProducts();
    const currentIndex = allProducts.findIndex((product) => product.id === this.id);
    let prevId: number;
    try {
      prevId = allProducts[currentIndex - 1].id;
    } catch (error) {
      prevId = allProducts[0].id;
      throw new Error('Reached First Record');
    }
    return { id: prevId };
  }
}
