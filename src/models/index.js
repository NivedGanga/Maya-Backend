const User = require('./user.model');
const Tokens = require('./tokens.model');

// Define associations
User.hasMany(Tokens, { foreignKey: 'userid', onDelete: 'CASCADE' });
Tokens.belongsTo(User, { foreignKey: 'userid' });

module.exports = { User, Tokens };
