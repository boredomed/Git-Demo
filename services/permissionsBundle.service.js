const mysql = require('../models/mysql');

module.exports = {
    findAllBundlesWithPermissions
};


function findAllBundlesWithPermissions() {
    return mysql.permissionsBundle.findAll({
        include: [{
            model: mysql.permissions,
            as: "permissionsBundlePermissions",
        }]
    });
}
