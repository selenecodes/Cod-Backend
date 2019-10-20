const exec = require('child_process').exec;
const fs = require('fs');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

if (!db.has('bans').value()) {
    db.defaults({ bans: [] }).write()
}

module.exports = {
    ban: (user, adminName) => {
        if (!user.ip) return 'No IP was provided!';
        const path = { 'user': { 'ip': user.ip } }
        if (db.get('bans').find(path).value()) {
            return `IP is already banned!`
        };
        
        exec(`iptables -A INPUT -s ${user.ip} -j DROP && iptables-save > /etc/iptables/rules.v4`, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                console.log(`exec error: ${error}`);
                return `couldn't ban due to an error`;
            } else {
                db.get('bans').push({
                    'user': user,
                    'ban_meta': {
                        'name': adminName,
                        'date': new Date()
                    }
                }).write()
                fs.appendFileSync("./log.txt", `${adminName} banned ${user.ip} \n`); 
                return 'banned';
            }
        })
    },
    unban: (user, adminName) => {
        if (!user.ip) return 'No IP was provided!';
        const path = { 'user': { 'ip': user.ip } }
        if (db.has('bans').value() && !db.get('bans').find(path).value()) {
            return `IP isn't banned!`;
        };
        
        exec(`iptables -D INPUT -s ${user.ip} -j DROP && iptables-save > /etc/iptables/rules.v4`, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                console.log(`exec error: ${error}`);
                return `couldn't unban due to an error`;
            } else {
                db.get('bans').remove(path).write()
                fs.appendFileSync("./log.txt", `${adminName} unbanned ${user.ip} \n`); 
                return 'unbanned';
            }
        })
    },
    getAllData: () => {
        if (db.has('bans').value() && db.get('bans').value().length > 0) {
            return db.get('bans').cloneDeep().value()
        } else {
            return 'No players have been banned yet!';
        }
    }
}