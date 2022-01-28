const config = require("../Config/config.json");

function isAdmin(role) {
    return role.includes(config.roles.ADMIN);
}

function isUser(role) {
    return role.includes(config.roles.BASIC);
}

function isGlobalAdmin(role) {
    return role.includes(config.roles.GLOBAL_ADMIN);
}

module.exports = {
    isAdmin,
    isUser,
    isGlobalAdmin
}