import fs from 'fs';
import crypto from 'crypto';
const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'.split('');
// const { cekKey, updateRequest } = require('../database/db');

// async function checkKey(req, res) {
//     const apikey = req.query.apikey;
//     if (apikey === undefined) return res.status(404).send({
//         status: 404,
//         message: `Input Parameter apikey`
//     });
//     const check = await cekKey(apikey);
//     if (!check.apikey) return res.status(403).send({
//         status: 403,
//         message: `apikey ${apikey} not found, please register first!`
//     });
//     // Limit the number of requests to the maximum
//     if (check.limit == 0) {
//         // Notification
//         return res.status(501).send({
//             status: 501,
//             message: 'Your APIKEY requests have expired, reset automatic 500 requests after 12 hours'
//         })
//     }
//     else if(check.limit != 'unlimited') { 
//         let request = parseInt(check.limit) - 1;
//         await updateRequest(apikey, request);
//     }
// }

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

function randomText(len) {
    const result = [];
    for (let i = 0; i < len; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
    return result.join('');
}

function readFileTxt(file) {
    return new Promise((resolve, reject) => {
        const data = fs.readFileSync(file, 'utf8');
        const array = data.toString().split('\n');
        const random = array[Math.floor(Math.random() * array.length)];
        const result = random.replace('\r', '');
        resolve(result)
    })
}

function readFileTxts(file) {
    return new Promise((resolve, reject) => {
        const data = fs.readFileSync(file, 'utf8');
        const array = data.toString().split('\n**\n');
        const random = array[Math.floor(Math.random() * array.length)];
        const result = random.replace('\n', '');
        resolve(result)
    })
}

function readFileJson(file) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.parse(fs.readFileSync(file));
        resolve(jsonData);
    })
}

function randomJson(file) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.parse(fs.readFileSync(file));
        const index = Math.floor(Math.random() * jsonData.length);
        const random = jsonData[index];
        resolve(random);
    })
}

function convertAtpToAppstate(atp) {
    const unofficialAppState = []
    const items = atp.split(";|")[0].split(";")

    if (items.length < 2) throw "Not a atp cookie"
    const validItems = ["sb", "datr", "c_user", "xs"]
    let validCount = 0;
    for (const item of items) {
        const key = item.split("=")[0]
        const value = item.split("=")[1]
        if (validItems.includes(key)) validCount++
        unofficialAppState.push({
            key,
            value,
            domain: "facebook.com",
            path: "/"
        })
    }
    if (validCount <= validItems.length) {
        return unofficialAppState
    } else {
        throw "Not a atp cookie"
    }
}

export { readFileTxt, readFileTxts, readFileJson, randomJson, randomText, getHashedPassword, generateAuthToken, convertAtpToAppstate };
