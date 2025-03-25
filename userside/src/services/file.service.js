const Filestore = require('../models/filestore.model');
const getFileStoreDetailsService = (eventId, callback) => {
    let queryOptions = {};

    // If eventId is provided, filter by that event
    if (eventId) {
        queryOptions = {
            where: {
                eventid: eventId
            }
        };
    }

    // Get count of files
    Filestore.count(queryOptions)
        .then(count => {
            // Calculate sum of file sizes
            return Filestore.findOne({
                ...queryOptions,
                attributes: [
                    [Filestore.sequelize.fn('SUM', Filestore.sequelize.col('filesize')), 'totalStorage']
                ],
                raw: true
            }).then(totalStorageResult => {
                // Extract total storage or default to 0 if no files found
                const totalStorage = totalStorageResult?.totalStorage || 0;

                // Return result via callback
                callback(null, { count, totalStorage });
            });
        })
        .catch(error => {
            callback(error, null);
        });
};

module.exports = {
    getFileStoreDetailsService,
}