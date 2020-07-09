const mysql = require('../models/mysql');

module.exports = {
    findAllRolesForUserId,
    findAllRolesWithBundles
};


function findAllRolesForUserId(userId) {
    return mysql.roles.findAll({
        include: [{
            model: mysql.permissionsBundle,
            as: 'rolePermissionsBundle',
            required: true,
        }, {
            model: mysql.users,
            as: "roleUsers",
            where: {userId},
            attributes: ['userId', 'email'],
            required: true,
        }
        ]
    });
}

function findAllRolesWithBundles() {
    return mysql.roles.findAll({
        include: [{
            model: mysql.permissionsBundle,
            as: 'rolePermissionsBundle',
        }]
    });
}
