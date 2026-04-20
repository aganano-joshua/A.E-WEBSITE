import { prisma } from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export interface UpsertTeamMemberInput {
  fullName: string;
  roleTitle: string;
  bio: string;
  imageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export const teamService = {
  listPublicTeamMembers: async () => {
    return prisma.teamMember.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" }
    });
  },

  listAdminTeamMembers: async () => {
    return prisma.teamMember.findMany({
      orderBy: { sortOrder: "asc" }
    });
  },

  getTeamMemberById: async (input: { teamMemberId: string }) => {
    const member = await prisma.teamMember.findUnique({
      where: { id: input.teamMemberId }
    });

    if (!member) {
      throw new AppError(404, "Team member not found.", "NOT_FOUND");
    }

    return member;
  },

  createTeamMember: async (input: UpsertTeamMemberInput) => {
    return prisma.teamMember.create({
      data: {
        fullName: input.fullName,
        roleTitle: input.roleTitle,
        bio: input.bio,
        imageUrl: input.imageUrl,
        linkedinUrl: input.linkedinUrl,
        twitterUrl: input.twitterUrl,
        sortOrder: input.sortOrder ?? 0,
        isVisible: input.isVisible ?? true
      }
    });
  },

  updateTeamMember: async (input: { teamMemberId: string } & UpsertTeamMemberInput) => {
    // Check if exists
    await teamService.getTeamMemberById({ teamMemberId: input.teamMemberId });

    return prisma.teamMember.update({
      where: { id: input.teamMemberId },
      data: {
        fullName: input.fullName,
        roleTitle: input.roleTitle,
        bio: input.bio,
        imageUrl: input.imageUrl,
        linkedinUrl: input.linkedinUrl,
        twitterUrl: input.twitterUrl,
        sortOrder: input.sortOrder,
        isVisible: input.isVisible
      }
    });
  },

  deleteTeamMember: async (input: { teamMemberId: string }) => {
    // Check if exists
    await teamService.getTeamMemberById({ teamMemberId: input.teamMemberId });

    return prisma.teamMember.delete({
      where: { id: input.teamMemberId }
    });
  }
};
