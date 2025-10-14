import { prisma } from "../prisma";

describe("User Integration", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  it("should create and find a user", async () => {
    const user = await prisma.user.create({
      data: {
        mezonId: "mezon_id",
      },
    });

    const foundUser = await prisma.user.findUniqueOrThrow({
      where: {
        mezonId: "mezon_id",
      },
    });

    expect(foundUser).toBeDefined();
    expect(foundUser.mezonId).toBe("mezon_id");
  });
});
