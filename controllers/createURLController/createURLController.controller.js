const validator = require('validator');
const Url = require('../../models/Url');


const generateShortCode = () => {

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < 6; i++) {
        shortCode += chars[Math.floor(Math.random() * chars.length)];
    }
    return shortCode;
}

const createURLController = async (req, res) => {


    try {
    
        const { url } = req.body;
  
        if (!url) {
          return res.status(400).json({
              success: false,
              error: 'URL is required' 
          });
        }
  
        if (!validator.isURL(url, {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_valid_protocol: true,
          allow_underscores: false,
          allow_trailing_dot: false,
          allow_local: true, 
          allow_protocol_relative_urls: false
        })) {
          return res.status(400).json({
              success: false,
              error: 'Invalid URL' 
          });
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getFullYear() + 1);
      
      
      const shortCode = generateShortCode();

      const existingUrl = await Url.findOne({
        shortCode: shortCode,
        isActive: true,
        expiryDate: { $gt: new Date() }
      })

      if(existingUrl){
        return res.status(409).json({
          success: false,
          error: 'Short code already exists, Please try again'
        });
      }

      const newUrl = new Url({
        longURL: url,
        shortCode: shortCode,
        expiryDate: expiryDate,
        isActive: true,
        clickCount: 0,
        createdAt: new Date()
      })


      await newUrl.save();
          
      res.status(200).json({
          success: true,
          message: 'URL created successfully',
          shortURL: `http://localhost:3000/api/getURL/${shortCode}`,
          expiryDate: expiryDate.toISOString(),
          createdAt: new Date().toISOString() 
      });
     
   } catch (error) {
      console.log(error);
      res.status(500).json({ 
          error: 'Internal server error' 
      });
     
   }

}

module.exports = { createURLController }