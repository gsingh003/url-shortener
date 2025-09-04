import { DataTypes, Model } from "sequelize";
import sql from "../internal/db/db";

class ShortUrl extends Model {
    public id!: number;
    public url!: string;
    public shortCode!: string;
    public accessCount!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ShortUrl.init(
    {
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true,
            },
        },
        shortCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        accessCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        modelName: "ShortUrl",
        sequelize: sql,
        indexes: [
            {
                unique: true,
                fields: ["shortCode"],
            },
        ],
    }
);

export default ShortUrl;
