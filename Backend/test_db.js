const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config(); // Loading environment variables

const connectionTest = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection successful");

        const testUser = new User( {
            name: "oranguta",
            email: "oranguta132@gmail.com",
            password: "sifgerg321"
        });

        await testUser.save();
        console.log("Test User Created");

        const passwordMatch = await testUser.comparePassword("sifgerg321");
        console.log("Password is correct", passwordMatch);

        const requiredUser = await User.find({email: "oranguta132@gmail.com"});
        console.log("Got the user", requiredUser);

        await User.deleteOne({email: "oranguta132@gmail.com"});
        console.log("Deleted user");

        await mongoose.disconnect();
        console.log("All tests passed");
    }
    catch(error) {
        console.log("Something went wrong ", error.message);
    }
};

connectionTest();


