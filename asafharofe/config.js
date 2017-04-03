

// exports.DB = {
// 		ConnectionStringWriter:"mongodb://localhost:27017/AsafHaRofe",
//         ConnectionStringReader:"mongodb://localhost:27017/AsafHaRofe",
//         SessionStore:"mongodb://localhost:27017/AsafHaRofe"
// };

exports.DB = {
		ConnectionStringWriter:'mongo mongodb://32-1a.mongo.evennode.com:27017,32-1b.mongo.evennode.com:27017/f1c2c7c99758279a418f33df9336a2d8?replicaSet=eusbg1" -u f1c2c7c99758279a418f33df9336a2d8 -p',
        ConnectionStringReader:'mongo "mongodb://32-1a.mongo.evennode.com:27017,32-1b.mongo.evennode.com:27017/f1c2c7c99758279a418f33df9336a2d8?replicaSet=eusbg1" -u f1c2c7c99758279a418f33df9336a2d8 -p',
        SessionStore:'mongo "mongodb://32-1a.mongo.evennode.com:27017,32-1b.mongo.evennode.com:27017/f1c2c7c99758279a418f33df9336a2d8?replicaSet=eusbg1" -u f1c2c7c99758279a418f33df9336a2d8 -p'
};