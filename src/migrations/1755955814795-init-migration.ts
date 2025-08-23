import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1755955814795 implements MigrationInterface {
    name = 'InitMigration1755955814795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commands" ("id" SERIAL NOT NULL, "command" character varying(20) NOT NULL, CONSTRAINT "UQ_1a8c40f0a581447776c325cb4f6" UNIQUE ("command"), CONSTRAINT "PK_7ac292c3aa19300482b2b190d1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("display_name" character varying(32) NOT NULL, "email" character varying(32) NOT NULL, "password" character varying(64) NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_commands" ("id" SERIAL NOT NULL, "command" integer NOT NULL, "user_id" integer NOT NULL, "arguments" text NOT NULL, "note" text DEFAULT '', "created_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_145dfaddc251c80b1ba26cd5e50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_commands_tags" ("tag_id" integer NOT NULL, "user_command_id" integer NOT NULL, CONSTRAINT "PK_399e6de4c9d41f60d880eaa36ce" PRIMARY KEY ("tag_id", "user_command_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb7a383f96069e5ca1b765abb5" ON "user_commands_tags" ("tag_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d472f679d733a0dc6dc14edd5" ON "user_commands_tags" ("user_command_id") `);
        await queryRunner.query(`ALTER TABLE "user_commands" ADD CONSTRAINT "FK_f4f4c907ba63d3773158431a5b6" FOREIGN KEY ("command") REFERENCES "commands"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_commands" ADD CONSTRAINT "FK_6ab12eb8f8dbd4ac609b38b0888" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_commands_tags" ADD CONSTRAINT "FK_eb7a383f96069e5ca1b765abb51" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_commands_tags" ADD CONSTRAINT "FK_3d472f679d733a0dc6dc14edd52" FOREIGN KEY ("user_command_id") REFERENCES "user_commands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_commands_tags" DROP CONSTRAINT "FK_3d472f679d733a0dc6dc14edd52"`);
        await queryRunner.query(`ALTER TABLE "user_commands_tags" DROP CONSTRAINT "FK_eb7a383f96069e5ca1b765abb51"`);
        await queryRunner.query(`ALTER TABLE "user_commands" DROP CONSTRAINT "FK_6ab12eb8f8dbd4ac609b38b0888"`);
        await queryRunner.query(`ALTER TABLE "user_commands" DROP CONSTRAINT "FK_f4f4c907ba63d3773158431a5b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d472f679d733a0dc6dc14edd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb7a383f96069e5ca1b765abb5"`);
        await queryRunner.query(`DROP TABLE "user_commands_tags"`);
        await queryRunner.query(`DROP TABLE "user_commands"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "commands"`);
    }

}
