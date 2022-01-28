const config = require('../Config/config.json')
const Data = require("../Config/data.json");
const user = require('./userRoles');

function scopedFolders(role, country, userId) {
    if (user.isAdmin(role) || user.isGlobalAdmin(role)) {
        return Data[country];
    } else {
        return Data[country].find(element => element.userId === userId);
    }
}

function globalFolders(role) {
    if (user.isGlobalAdmin(role)) {
        return [...Data.FR, ...Data.BR]
    }
    return [];
}

module.exports = {
    scopedFolders,
    globalFolders,
}