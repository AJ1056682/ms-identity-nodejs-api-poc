const config = require('../Config/config.json')
const Data = require("../Config/data.json");
const common = require('./common');

function scopedFolders(role, country, userId) {
    if (common.isAdmin(role) || common.isGlobalAdmin(role)) {
        return Data[country];
    } else {
        return Data[country].find(element => element.userId === userId);
    }
}

function globalFolders(role) {
    if (common.isGlobalAdmin(role)) {
        return [...Data.FR, ...Data.BR]
    }
    return [];
}

module.exports = {
    scopedFolders,
    globalFolders,
}