const express = require("express")
const router = express.Router();
const axios = require('axios');

// router.use(express.urlencoded({
//     extended:true
// }))
router.use(express.json());

router.post('/api/image', async (req, res) => {
    const fileUrl = req.body.fileUrl;
    console.log(fileUrl);
    try {
    // POST request to Replicate to start the image restoration generation process
    const startResponse = await axios.post('https://api.replicate.com/v1/predictions', {
        version:
            "6129309904ce4debfde78de5c209bce0022af40e197e132f08be8ccce3050393",
        input: { img: `${fileUrl}`, version: "v1.4", scale: 2 },
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