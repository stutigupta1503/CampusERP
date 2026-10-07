const Admin = require('./models/Admin');
const bcrypt=require('bcrypt')

async function createAdmin() {
    try {

        let adminExits = await Admin.findOne({ email: 'stuti@yopmail.com'})
        if (adminExits) {
            console.log("Admin Updated...")
        } else {

            let admin = new Admin();
    
            admin.firstName = 'Stuti';
            admin.lastName = 'Gupta';
            admin.email = 'stuti@yopmail.com';
            let encryptedPassword = bcrypt.hashSync("stuti@123", 10);
            admin.password = encryptedPassword;
            
    
            await admin.save();
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = createAdmin;