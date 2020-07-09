const mysql = require('../models/mysql');

module.exports = {
    findUserBySocial,
    addUserSocial,
    findOneWhere
};

function findUserBySocial(where, whereUser) {
    return mysql.userSocial.findOne({
        where: where || {},
        include: [{
            model: mysql.users,
            as: 'user',
            where: whereUser || {}
        }]
    });
}

function addUserSocial(social) {
    return mysql.userSocial.create(social);
}

function findOneWhere(where) {
    return mysql.userSocial.findOne({where});
}
