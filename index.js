const isLinux = process.platform === 'linux';
if (!isLinux) {
    console.log("\x1b[31m", 'This OS is not supported!', "\x1b[0m");
    return;
};

const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const port = 4242;

const banmanager = require('./ban')

// !NOTE: NEVER SHARE THESE KEYS WITH NON-ADMINS (ALSO DON'T SHARE KEYS BETWEEN ADMINS)!!!
const AUTH_KEYS = [
    {
        "name": "Hanno",
        "key": "$hQ%vs5fPMRLZ4ATfLA4pLRiuoHzNA&HPekbW!w94EaSy4InH@DHTWvHP^7Si0Duj%21G^$hLH1MbmckEd1gu3Jq*56l7L!^xc6Y"
    },
    {
        "name": "Manraj",
        "key": "tr^bpV@1z5KleTt^Ay2x&79eiU@JKZJKN4qhRvRqJ93iNRMW%RmRBt5dSJ#p0o#oN*$6iyoI0fJ84j^fR!9a55PhyGrhR*xLz3dZ"
    },
    {
        "name": "Hunter-MIH",
        "key": "m@YOQWel28xBuYp#*y!Kzk%SlB!V#iUIeLkGX0CAWhtoUlw57VnKSoGbo9UzluP7!HC4Rjzv%iJwY#IQANdZOIs#1i70$@9rXBjo"
    },
    {
        "name": "Mostafa",
        "key": "wTW0Hewx5rsfQ10Ibsama^wzq#Xt%Vh*gQwO@O5wNWTakvXsiNp%R*J4TM*Vku8ppmTze%NXfK^p$J1Zl7$mDFqFe7buqH7DcIdL"
    },
    {
        "name": "Poseidon",
        "key": "9tr8EY#uK5mvNoIkQ^k&nw1USL@*ASgm%W3bJG1xq*WSeep9ZdPaqjit*%PqWbh!WqwxHzPFHuLDb@1%@@DGKxXDfj@Z31H&aVET"
    },
    {
        "name": "Soap",
        "key": "1e7#r7#!pvXz#HMA@U@xhb94g2nVy*MOC!nfTB*a4MnFShIxO21F7QtTI1#8xcWguI0ld2l38Ho03L2FQ73xAa1gw%T1r!kJbJkF"
    },
    {
        "name": "Kamasutrakiller",
        "key": "9O6Dc9%8DK6g6eJ$P1zpTY6qi7Ip7rz%sBKGf2Lk2JNL#84p2^YedNvhvaOkgfIiul1sw!u@m0QJNH^L1*75j02GMG16OPgj&khj"
    },
    {
        "name": "Black Hawk",
        "key": "Y6DfpJqVFiw8F0%&^cN6I2YTWw5QaWzIuCcKdM1!vS3EpIa8ASzfYf0YP!EMSx4$p00^p46s5v%kTZ3e&2CBCuWhb#wpnd6GZzNd"
    }
];


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ban', async (req, res) => {
    const key = AUTH_KEYS.filter(key => `Bearer ${key.key}` === req.headers['authorization'])
    if (key.length > 0) {
        const result = await banmanager.ban(req.body, key[0].name)
        res.send({ 'result': result })
    } else {
        res.send({ 'result': 'Not Authorized' })
    }
});

app.post('/unban', async (req, res) => {
    const key = AUTH_KEYS.filter(key => `Bearer ${key.key}` === req.headers['authorization'])
    if (key.length > 0) {
        const result = await banmanager.unban(req.body, key[0].name)
        res.send({ 'result': result })
    } else {
        res.send({ 'result': 'Not Authorized' })
    }
});

app.get('/bans', (req, res) => {
    const key = AUTH_KEYS.filter(key => `Bearer ${key.key}` === req.headers['authorization'])
    if (key.length > 0) {
        res.send({ 'result': banmanager.getAllData() })
    } else {
        res.send({ 'result': 'Not Authorized' })
    }
});

app.listen(port, () => console.log(`Call of duty backend listening on port: ${port}!`));