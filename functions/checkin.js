const axios = require('axios');

exports.handler = function(event, context) {

    const parts = event.body.split('+');
    const mail = parts.map(part => {
        const buff = new Buffer(part, 'base64');
        return buff.toString('ascii');
    }).join(' ');

    const latStart = 'sent this message from: Lat ';
    const lat = mail.substr(mail.indexOf(latStart) + latStart.length).split(' ')[0];
    const lon = mail.substr(mail.indexOf(latStart) + latStart.length).split(' ')[2].split('\n')[0];
    const date = new Date();

    const doc = `---
title: Auto check-in
date: ${date.toISOString()}
lat: '${lat}'
lon: '${lon}'
---`;

    if(!!lat && !!lon) {
        axios({
            method: 'post',
            headers: {
                'PRIVATE-TOKEN': '864PF-QH7xmgtZcA1aub',
                'Content-Type': 'application/json'
            },
            url: `https://gitlab.com/api/v4/projects/14462796/repository/files/content%2Fblog%2F${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}-${("0" + (date.getHours() + 1)).slice(-2)}-${("0" + (date.getMinutes() + 1)).slice(-2)}.md`,
            data: {
                "branch": "master",
                "encoding": "base64",
                "author_email": "satphone@jamesbenns.com",
                "author_name": "Sat Phone",
                "content": Buffer.from(doc).toString('base64'),
                "commit_message": "Auto check-in"
            }
        });
    }

}