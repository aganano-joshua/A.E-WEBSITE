// export interface UpsertProductInput {
//   name: string;
//   slug: string;
//   description: string;
//   link: string;
//   imageUrl?: string;
//   isPublished?: boolean;
// }

// export const productsService = {
//   listPublicProducts: async () => "This is productsService.listPublicProducts endpoint.",

//   getPublicProductBySlug: async (_input: { slug: string }) =>
//     "This is productsService.getPublicProductBySlug endpoint.",

//   listAdminProducts: async () => "This is productsService.listAdminProducts endpoint.",

//   getAdminProductById: async (_input: { productId: string }) =>
//     "This is productsService.getAdminProductById endpoint.",

//   createProduct: async (_input: UpsertProductInput) =>
//     "This is productsService.createProduct endpoint.",

//   updateProduct: async (_input: { productId: string } & UpsertProductInput) =>
//     "This is productsService.updateProduct endpoint.",

//   deleteProduct: async (_input: { productId: string }) =>
//     "This is productsService.deleteProduct endpoint."
// };

import { prisma } from "../../config/prisma-client";

export interface UpsertProductInput {
  name: string;
  slug: string;
  description: string;
  link: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export const productsService = {
  // Public: Get all published products
  listPublicProducts: async () => {
    return prisma.product.findMany({
      where: {
        isPublished: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  // Public: Get single product by slug
  getPublicProductBySlug: async ({ slug }: { slug: string }) => {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product || !product.isPublished) {
      throw new Error("Product not found");
    }

    return product;
  },

  // Admin: Get all products (including unpublished)
  listAdminProducts: async () => {
    return prisma.product.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  // Admin: Get single product by ID
  getAdminProductById: async ({ productId }: { productId: string }) => {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  //Admin: Create product
  createProduct: async (input: UpsertProductInput) => {
    return prisma.product.create({
      data: input
    });
  },

  // Admin: Update product
  updateProduct: async ({
    productId,
    ...data
  }: { productId: string } & UpsertProductInput) => {
    return prisma.product.update({
      where: { id: productId },
      data
    });
  },

  // Admin: Delete product
  deleteProduct: async ({ productId }: { productId: string }) => {
    return prisma.product.delete({
      where: { id: productId }
    });
  }
};