import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTableGenres1631722721329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "genres",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "gameId",
                        type: "uuid",
                    },
                    {
                        name: "generos",
                        type: "varchar"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKGameGenrer",
                        columnNames: ["gameId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "games",
                        onDelete: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("genres")
    }

}
