const express = require('express');
const userCtrl = require('../controllers/users.controller');
const {jwtAuthHandler} = require('../middleware/auth-handler');
const responseMessages = require('../library/response-messages');
const responseMessage = require('../library/response-messages');
const forgetPassCtrl = require('../controllers/forgetPass.controller');

const router = express.Router();
module.exports = router;

router.post('/forgetPass', forgetPass);
router.post('/recoverPass', recoverPass);
router.put('/changePass', jwtAuthHandler, changePass);
router.put('/', jwtAuthHandler, updateUser);
router.post('/profileViews', jwtAuthHandler, createProfileView);

async function createProfileView(req, res, next) {
    if (!req.body.userId) {
        res.status(422).send({
            "code": 422,
            "message": responseMessages.propertiesRequiredMissing.replace('?', 'userId')
        });
    }
    const cp = await userCtrl.insertProfileView(req.body, req.user);
    res.send(cp);
}

async function forgetPass(req, res, next) {
    const f = await forgetPassCtrl.sendToken(req.body);

    if (f) res.status(200).send({"code": 200, "message": responseMessage.codeSendSuccess})
    else res.status(400).send({"code": 400, "message": responseMessage.codeSendError})
}

async function recoverPass(req, res, next) {
    const r = await forgetPassCtrl.updatePass(req.body);

    if (r) res.status(200).send({"code": 200, "message": responseMessage.passwordUpdateSuccess})
    else res.status(400).send({"code": 400, "message": responseMessage.passwordUpdateError})
}

async function updateUser(req, res, next) {
    let userId = req.user.userId;
    let userData = req.body;
    let user = await userCtrl.update(userId, userData);

    if (user) res.status(200).send({"code": 200, message: responseMessages.recordUpdateSuccess});
    else res.status(400).send({"code": 400, message: responseMessages.recordUpdateError});
}

async function changePass(req, res, next) {
    const c = await forgetPassCtrl.changeP(req.body, req.user.userId);

    if (c) res.status(200).send({"code": 200, message: responseMessages.recordUpdateSuccess});
    else res.status(400).send({"code": 400, message: responseMessages.recordUpdateError});
}
