import { AppDataSource } from "../../src/database/datasource";
import { User } from "../../src/entities/user.entity";

describe("User Integration", () => {
  it("should create and find a user", async () => {
    const userRepository = AppDataSource.getRepository(User);

    const user = new User();
    user.mezonId = "mezon_id";

    await userRepository.save(user);

    const foundUser = await userRepository.findOneByOrFail({
      mezonId: "mezon_id",
    });

    expect(foundUser).toBeDefined();
    expect(foundUser.mezonId).toBe("mezon_id");
    expect(foundUser.resources.gems).toBe(10);
  });
});
