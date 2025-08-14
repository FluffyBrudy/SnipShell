import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1689456789012 implements MigrationInterface {
  name = 'CreateInitialTables1689456789012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "commands" (
                "id" SERIAL NOT NULL,
                "command" character varying(20) NOT NULL,
                CONSTRAINT "PK_commands_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_tags_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('owner', 'admin', 'user')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "display_name" character varying(32) NOT NULL,
                "email" character varying(32) NOT NULL,
                "password" character varying(64) NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'owner',
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "user_commands" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "command" integer NOT NULL,
                "arguments" text NOT NULL,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_commands_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_user_commands_command" FOREIGN KEY ("command") REFERENCES "commands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "user_commands_tags" (
                "user_command_id" integer NOT NULL,
                "tag_id" integer NOT NULL,
                CONSTRAINT "PK_user_commands_tags" PRIMARY KEY ("user_command_id", "tag_id"),
                CONSTRAINT "FK_user_commands_tags_user_command" FOREIGN KEY ("user_command_id") REFERENCES "user_commands"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_user_commands_tags_tag" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_commands_tags"`);
    await queryRunner.query(`DROP TABLE "user_commands"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "commands"`);
  }
}
