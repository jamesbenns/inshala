const OneSignal = require('onesignal-node');
const myClient = new OneSignal.Client({      
    userAuthKey: 'MzRiZDcyMGItMzkxMC00MWQ1LTk5NTMtMDdlYjhjY2E1Y2Mw',      
    app: { appAuthKey: 'MGIwZDBmOGQtYjRiYS00ZjliLWI4OGQtOWE0MDkxODM4YzAx', appId: '8ba1ae7c-e229-4102-a348-9c8b5c5923ed' }      
});
const axios = require('axios');

exports.handler = function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }    
    const parts = event.body.split('+');
    const mail = parts.map(part => {
        const buff = new Buffer(part, 'base64');
        return buff.toString('ascii');
    }).join(' ');
    const messageSearchTerm = 'Content-Disposition: form-data; name="text"';
    const messageSection = mail.substr(mail.indexOf(messageSearchTerm) + messageSearchTerm.length);
    const message = messageSection.substr(0, messageSection.indexOf('--xYzZY')).trim();

    console.log(message);
    const lat = message.split('lat: ')[0].split(' ');
    const lon = message.split('lon: ')[0].split(' ');
    const date = new Date();
    const doc = 
`
---
title: Auto check-in
date: ${date.toISOString()}
lat: '${lat}'
lon: '${lon}'
---
`;

    axios({
        method: 'post',
        headers: {
            'PRIVATE-TOKEN': '864PF-QH7xmgtZcA1aub',
            'Content-Type': 'application/json'
        },
        url: `https://gitlab.com/api/v4/projects/14462796/repository/files/content%2Fblog%2F${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + this.getDate()).slice(-2)}-${("0" + (date.getHours() + 1)).slice(-2)}-${("0" + (date.getMinutes() + 1)).slice(-2)}.md`,
        data: {
            "branch": "master",
            "encoding": "base64",
            "author_email": "satphone@jamesbenns.com",
            "author_name": "Sat Phone",
            "content": Buffer.from(doc).toString('base64'),
            "commit_message": "Auto check-in"
        }
    });

    const firstNotification = new OneSignal.Notification({      
        template_id: "726887ee-8f4f-4eaf-bc13-09e96864e467",
        included_segments: ["Subscribed Users"]     
    });
    myClient.sendNotification(firstNotification);
}

// curl --request POST --header 'PRIVATE-TOKEN: 864PF-QH7xmgtZcA1aub' --header "Content-Type: application/json" --data '{"branch": "master", "encoding": "base64", "author_email": "satphone@jamesbenns.com", "author_name": "Sat Phone", "content": "Ci0tLQp0aXRsZTogQXV0byBjaGVjay1pbgpkYXRlOiAyMDE5LTA5LTI2VDIxOjMwOjAwLjAwOFoKbGF0OiAnMzguNzMwODM2Jwpsb246ICcxOS44NDkxMjgnCi0tLQo=", "commit_message": "Auto check-in"}' 'https://gitlab.com/api/v4/projects/14462796/repository/files/content%2Fblog%2F2019-09-26-21-30.md'