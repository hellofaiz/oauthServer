const express = require("express")
const router = express.Router();
const axios = require('axios');
router.use(express.json());

router.post('/motionblur', async (req, res) => {
    const fileUrl = req.body.fileUrl;
    console.log(fileUrl);
    try {
        // POST request to Replicate to start the image restoration generation process
        const startResponse = await axios.post('https://api.replicate.com/v1/predictions', {
            version:
                "018241a6c880319404eaa2714b764313e27e11f950a7ff0a7b5b37b27b74dcf7",
            input: { image: `${fileUrl}`, task_type: "Image Debluring (REDS)" },
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
            },
        });
        const endpointUrl = startResponse.data.urls.get;
        console.log(endpointUrl);

        let restoredImage = null;
        while (!restoredImage) {
            // Loop in 1s intervals until the alt text is ready
            console.log('polling for result...');
            const finalResponse = await axios.get(endpointUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
                },
            });

            const jsonFinalResponse = finalResponse.data;
            // console.log(jsonFinalResponse);  
            if (jsonFinalResponse.status === 'succeeded') {
                restoredImage = jsonFinalResponse.output;
                // console.log(restoredImage);
            } else if (jsonFinalResponse.status === 'failed') {
                break;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 2000)
                );
            }
        }
        res.status(200).json(restoredImage ? restoredImage : 'Failed to restore image');
    }
    catch (error) {
        // console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

module.exports = router;