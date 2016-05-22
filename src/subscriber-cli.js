var globalRequire = require;
require = function (path) { return function () { return require(path); } };

var exports = module.exports = {
    RedisClient: require('./redis-cli.js')
};


// Replace exports by properties that load on demand
Object.keys(exports).forEach(function (submodule) {
    var loadSubmodule = exports[submodule];
    Object.defineProperty(exports, submodule, {
        configurable: true,
        enumerable: true,
        get: function () {
            // Replace the (currently executing) lazy property handler by the actual module
            delete exports[submodule];
            return exports[submodule] = loadSubmodule();
        }
    });
});

require = globalRequire;