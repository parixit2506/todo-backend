module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNo: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100)
        },
        password: {
            type: DataTypes.STRING
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
    });

    return user;
}