const User = require('./user.model');
const Tokens = require('./tokens.model');
const Roles = require('./roles.model');
const Events = require('./events.model');
const Work = require('./work.model');
const Filestore = require('./filestore.model');
// Define associations
User.hasMany(Tokens, { foreignKey: 'userid', onDelete: 'CASCADE' });
Tokens.belongsTo(User, { foreignKey: 'userid' });

User.hasOne(Roles, { foreignKey: 'userid', onDelete: 'CASCADE' });
Roles.belongsTo(User, { foreignKey: 'userid' });

Events.hasMany(Work, { foreignKey: 'eventid', onDelete: 'CASCADE' });
Work.belongsTo(Events, { foreignKey: 'eventid' });

User.hasMany(Work, { foreignKey: 'userid' });
Work.belongsTo(User, { foreignKey: 'userid' });

// Define associations
Events.hasMany(Filestore, { foreignKey: 'eventid', onDelete: 'CASCADE' });
Filestore.belongsTo(Events, { foreignKey: 'eventid' });

module.exports = { User, Tokens, Roles, Events, Work,Filestore };
