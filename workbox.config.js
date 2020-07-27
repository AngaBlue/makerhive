module.exports = (options) => {
    options.navigateFallbackBlacklist.push(/^\/auth/);
    return options;
};
