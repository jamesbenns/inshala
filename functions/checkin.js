var OneSignal = require('onesignal-node');
var myClient = new OneSignal.Client({      
    userAuthKey: 'MzRiZDcyMGItMzkxMC00MWQ1LTk5NTMtMDdlYjhjY2E1Y2Mw',      
    // note that "app" must have "appAuthKey" and "appId" keys      
    app: { appAuthKey: 'MGIwZDBmOGQtYjRiYS00ZjliLWI4OGQtOWE0MDkxODM4YzAx', appId: '8ba1ae7c-e229-4102-a348-9c8b5c5923ed' }      
});

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
    const messageSection = mail.subStr(mail.indexOf(messageSearchTerm) + messageSearchTerm.length);
    const message = messageSection.subStr(0, messageSection.indexOf('--xYzZY'));

    console.log(message);

    const firstNotification = new OneSignal.Notification({      
        template_id: "726887ee-8f4f-4eaf-bc13-09e96864e467",
        included_segments: ["Subscribed Users"]     
    });
    myClient.sendNotification(firstNotification);
}

// curl --request POST --header 'PRIVATE-TOKEN: 864PF-QH7xmgtZcA1aub' --header "Content-Type: application/json" --data '{"branch": "master", "encoding": "base64", "author_email": "satphone@jamesbenns.com", "author_name": "Sat Phone", "content": "Ci0tLQp0aXRsZTogQXV0byBjaGVjay1pbgpkYXRlOiAyMDE5LTA5LTI2VDIxOjMwOjAwLjAwOFoKbGF0OiAnMzguNzMwODM2Jwpsb246ICcxOS44NDkxMjgnCi0tLQo=", "commit_message": "Auto check-in"}' 'https://gitlab.com/api/v4/projects/14462796/repository/files/content%2Fblog%2F2019-09-26-21-30.md'