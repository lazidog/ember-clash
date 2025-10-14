import { truncateAllTables } from "test/utils/truncate";
import { prisma } from "../prisma";

describe("Database", () => {
  beforeAll(async () => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    await truncateAllTables();
  });

  afterAll(async () => {
    await truncateAllTables();
  });

  it("should create and find a user", async () => {
    const _user = await prisma.user.create({
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
