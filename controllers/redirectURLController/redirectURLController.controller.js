const Url = require('../../models/Url');


const redirectURLController = async (req, res) => {

    try{

        const { shortCode } = req.params;

        console.log("Short Code : ",shortCode);



        // Validate short code format
        if(!shortCode || shortCode.length !== 6){
            return res.status(404).json({
                success: false,
                error: 'Invalid short code format'
            });
        }
        
        const validateShortCode = /^[a-z0-9]{6}$/;

        if(!validateShortCode.test(shortCode)){
            return res.status(404).json({
                success: false,
                error: 'Short code contain invalid characters'
            });
        }
        
        const url = await Url.findOne({ 
            shortCode: shortCode 
        });


        if(!url){
            return res.status(404).json({
                success: false,
                error: 'URL not found'
            });
        }

        if(!url.isActive){
            return res.status(404).json({
                success: false,
                error: 'URL is not active'
            });
        }

        if(url.expiryDate < new Date()){
            return res.status(404).json({
                success: false,
                error: 'URL has expired'
            });
        }

        await Url.findOneAndUpdate({ 
            shortCode: shortCode }, 
            { $inc: { clickCount: 1 } 
        });

        console.log('Redirecting to:', url.longURL);

        return res.redirect(302, url.longURL);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}   

module.exports = { redirectURLController }