const mysql = require('../models/mysql');

module.exports = {
    findOneWhereWithBlackListedBundles,
    addUser,
    findAllWhere,
    findOneExists,
    update,
    addProfileView,
    addEmailInUserChannel,
    getUserChanelId
};

function getUserChanelId(title){
    return mysql.channelTypes.findOne({
        where:title
    });

}

function addEmailInUserChannel(userId, channelTypeId,channelValue){
    return mysql.userChannels.create({
        userId: userId,
        channelTypeId: channelTypeId ,
        channelValue: channelValue
    });
}

function addProfileView(body) {
    let date = new Date();
    body.viewedAt = date;
    return mysql.profileViews.create(body);
}

function findOneWhereWithBlackListedBundles(where) {
    return mysql.users.findOne({
        where,
        include: [{
            model: mysql.userPermissionsBlackList,
            as: 'userPermissionsBlackList',
            include: [{
                model: mysql.permissionsBundle,
                as: 'permissionsBundle'
            }]
        }, {
            model: mysql.locations,
            as: 'userLocation'
        }]
    });
}

function addUser(user) {
    user.createdAt = new Date();
    user.isActive = 1;
    return mysql.users.create(user);
}

function findAllWhere(where) {
    return mysql.users.findAll(where);
}

function findOneExists(where) {
    return mysql.users.findOne({where});
}

async function update(update, userId) {
    const user = await mysql.users.findByPk(userId)
    if (user)
        return user.update(update);
    else return 0;
}

