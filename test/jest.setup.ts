require("dotenv").config();

import { prisma } from "./prisma";

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});
