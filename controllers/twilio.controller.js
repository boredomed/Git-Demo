const twilioConfig = require('../config/twilio');

const twilio = require('twilio');
const client = new twilio(twilioConfig.accountSid, twilioConfig.authToken);

async function sendInvitesBulk(contacts){
    const errs = [];
    const promisses = [];
     return new Promise(async resolve => {

        for(let [i,contact] of contacts.entries()){

            promisses.push(client.messages.create({
                body: contact.message,
                to: contact.phone,  // Text this number
                from: twilioConfig.from // From a valid Twilio number
            }));
        }


        Promise.all(promisses).then(function(values) {
            resolve(true);
        }).catch(function(err) {
            console.log(err.message); // some coding error in handling happened
            resolve(false);
        });



     })

}

module.exports = {
    sendInvitesBulk
}
