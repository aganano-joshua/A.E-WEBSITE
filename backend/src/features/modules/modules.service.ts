import { prisma } from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export interface UpsertModuleInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  order?: number;
  estimatedMinutes?: number;
  isPublished?: boolean;
  resources?: Array<{
    title: string;
    type: "VIDEO" | "LINK" | "DOCUMENT" | "NOTE";
    url?: string;
    content?: string;
    sortOrder?: number;
  }>;
}

export const modulesService = {
  listPublicModules: async () => {
    return prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" }
    });
  },

  getPublicModuleBySlug: async (input: { slug: string }) => {
    const moduleItem = await prisma.module.findUnique({
      where: { slug: input.slug, isPublished: true },
      include: { resources: { orderBy: { sortOrder: "asc" } } }
    });

    if (!moduleItem) {
      throw new AppError(404, "Module not found.", "NOT_FOUND");
    }

    return moduleItem;
  },

  listUserModules: async (input: { userId: string }) => {
    return prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        userProgresses: {
          where: { userId: input.userId }
        }
      }
    });
  },

  getUserModuleDetail: async (input: { userId: string; slug: string }) => {
    const moduleItem = await prisma.module.findUnique({
      where: { slug: input.slug },
      include: {
        resources: { orderBy: { sortOrder: "asc" } },
        userProgresses: {
          where: { userId: input.userId }
        },
        quiz: true
      }
    });

    if (!moduleItem) {
      throw new AppError(404, "Module not found.", "NOT_FOUND");
    }

    return moduleItem;
  },

  updateProgress: async (input: {
    userId: string;
    moduleId: string;
    status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    progressPercent?: number;
  }) => {
    return prisma.userModuleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: input.userId,
          moduleId: input.moduleId
        }
      },
      update: {
        status: input.status,
        progressPercent: input.progressPercent,
        lastAccessedAt: new Date(),
        completedAt: input.status === "COMPLETED" ? new Date() : undefined
      },
      create: {
        userId: input.userId,
        moduleId: input.moduleId,
        status: input.status ?? "IN_PROGRESS",
        progressPercent: input.progressPercent ?? 0,
        startedAt: new Date(),
        lastAccessedAt: new Date()
      }
    });
  },

  listAdminModules: async () => {
    return prisma.module.findMany({
      orderBy: { order: "asc" }
    });
  },

  getAdminModuleById: async (input: { moduleId: string }) => {
    const moduleItem = await prisma.module.findUnique({
      where: { id: input.moduleId },
      include: { resources: { orderBy: { sortOrder: "asc" } } }
    });

    if (!moduleItem) {
      throw new AppError(404, "Module not found.", "NOT_FOUND");
    }

    return moduleItem;
  },

  createModule: async (input: UpsertModuleInput) => {
    const { resources, ...moduleData } = input;

    return prisma.module.create({
      data: {
        ...moduleData,
        order: moduleData.order ?? 0,
        resources: {
          create: resources?.map((r) => ({
            ...r,
            sortOrder: r.sortOrder ?? 0
          }))
        }
      },
      include: { resources: true }
    });
  },

  updateModule: async (input: { moduleId: string } & UpsertModuleInput) => {
    const { moduleId, resources, ...moduleData } = input;

    // Check if exists
    await modulesService.getAdminModuleById({ moduleId });

    // For simplicity, we delete existing resources and recreate them
    // In a more robust implementation, we'd sync them by ID
    return prisma.$transaction(async (tx) => {
      if (resources) {
        await tx.moduleResource.deleteMany({
          where: { moduleId }
        });
      }

      return tx.module.update({
        where: { id: moduleId },
        data: {
          ...moduleData,
          resources: {
            create: resources?.map((r) => ({
              ...r,
              sortOrder: r.sortOrder ?? 0
            }))
          }
        },
        include: { resources: true }
      });
    });
  },

  deleteModule: async (input: { moduleId: string }) => {
    // Check if exists
    await modulesService.getAdminModuleById({ moduleId: input.moduleId });

    return prisma.module.delete({
      where: { id: input.moduleId }
    });
  }
};
