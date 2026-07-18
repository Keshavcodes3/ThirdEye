import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createWorkflowRepository = async () => {
  return await prisma.$transaction([]);
};

export const getAllWorkflowsRepository = async () => {
  return await prisma.$transaction([]);
};

export const getWorkflowByIdRepository = async () => {
  return await prisma.$transaction([]);
};

export const updateWorkflowRepository = async () => {
  return await prisma.$transaction([]);
};

export const deleteWorkflowRepository = async () => {
  return await prisma.$transaction([]);
};
