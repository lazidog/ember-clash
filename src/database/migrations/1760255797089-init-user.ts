import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUser1760255797089 implements MigrationInterface {
  name = "InitUser1760255797089";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mezon_id" character varying NOT NULL, "resources" jsonb NOT NULL DEFAULT '{"gold":100,"elixir":50,"gems":10}', "trophies" integer NOT NULL DEFAULT '0', "state_stack" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_7a81f05a88126e050f27efe5ae5" UNIQUE ("mezon_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
