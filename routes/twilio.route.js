const express = require('express');
const twilioCtrl = require('../controllers/twilio.controller');
const {jwtAuthHandler} = require('../middleware/auth-handler');
const responseMessages = require('../library/response-messages');

const router = express.Router();
module.exports = router;

router.post('/invite', jwtAuthHandler, inviteUsers);
//
// {
//     contacts : [
//         {
//             name: "",
//             phone: "",
//             message:""
//         }
//     ]
// }
async function inviteUsers(req, res, next) {
    let user = req.user;
    let inviteData = req.body;

    const invites = await twilioCtrl.sendInvitesBulk(inviteData.contacts);

    if (invites) {
        res.send({message: "Invites sent successfully."});
        return;
    }
    res.status(500).send({message: "Something went wrong."})
}
