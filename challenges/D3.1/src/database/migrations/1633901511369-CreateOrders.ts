import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateOrders1631723149298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "orders",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "userId",
                        type: "uuid"
                    },
                    {
                        name: "gamesId",
                        type: "varchar"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKOrderUser",
                        columnNames: ["userId"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("orders")
    }

}
