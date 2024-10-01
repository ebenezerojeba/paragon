import subscribeModel from "../models/subscribeModel.js";

const subscribe = async(req, res) => {
    const { email } = req.body;

    try {
        const existingSubscriber = await subscribeModel.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed.' });
        }

        const newSubscriber = new subscribeModel({ email });
        await newSubscriber.save();
        res.status(201).json({ message: 'Thank you for joining our community!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }

}

export {subscribe}