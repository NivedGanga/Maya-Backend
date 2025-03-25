const { getFileStoreDetailsService } = require("../services/file.service");

const getFileStoreDetails = async (req, res) => {
    console.log("helloooo");
    const { eventId } = req.query;

    getFileStoreDetailsService(eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

module.exports = {
    getFileStoreDetails,
}