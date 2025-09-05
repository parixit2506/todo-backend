module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define("Todo", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: true,
        tableName: 'todos',
    });

    return Todo;
}