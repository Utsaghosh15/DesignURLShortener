const Url = require('../../models/url');


const redirectURLController = async (req, res) => {

    try{

        const { shortCode } = req.params;
        
        const url = await Url.findOne({ shortCode: shortCode });


        if(!url){
            return res.status(404).json({
                success: false,
                error: 'URL not found'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}   

module.exports = { redirectURLController }