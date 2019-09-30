var OneSignal = require('onesignal-node');      
import querystring from "querystring";
var myClient = new OneSignal.Client({      
    userAuthKey: 'MzRiZDcyMGItMzkxMC00MWQ1LTk5NTMtMDdlYjhjY2E1Y2Mw',      
    // note that "app" must have "appAuthKey" and "appId" keys      
    app: { appAuthKey: 'MGIwZDBmOGQtYjRiYS00ZjliLWI4OGQtOWE0MDkxODM4YzAx', appId: '8ba1ae7c-e229-4102-a348-9c8b5c5923ed' }      
});

exports.handler = function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    const params = querystring.parse(event.body);
    console.log('params', params);
    var firstNotification = new OneSignal.Notification({      
        template_id: "726887ee-8f4f-4eaf-bc13-09e96864e467"      
    });
    myClient.sendNotification(firstNotification)      
    .then(function (response) {      
        console.log(response.data, response.httpResponse.statusCode);      
    })      
    .catch(function (err) {      
        console.log('Something went wrong...', err);      
    });  
}

// curl --request POST --header 'PRIVATE-TOKEN: 864PF-QH7xmgtZcA1aub' --header "Content-Type: application/json" --data '{"branch": "master", "encoding": "base64", "author_email": "satphone@jamesbenns.com", "author_name": "Sat Phone", "content": "Ci0tLQp0aXRsZTogQXV0byBjaGVjay1pbgpkYXRlOiAyMDE5LTA5LTI2VDIxOjMwOjAwLjAwOFoKbGF0OiAnMzguNzMwODM2Jwpsb246ICcxOS44NDkxMjgnCi0tLQo=", "commit_message": "Auto check-in"}' 'https://gitlab.com/api/v4/projects/14462796/repository/files/content%2Fblog%2F2019-09-26-21-30.md'