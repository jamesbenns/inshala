const OneSignal = require('onesignal-node');
const myClient = new OneSignal.Client({      
    userAuthKey: 'MzRiZDcyMGItMzkxMC00MWQ1LTk5NTMtMDdlYjhjY2E1Y2Mw',      
    app: { appAuthKey: 'MGIwZDBmOGQtYjRiYS00ZjliLWI4OGQtOWE0MDkxODM4YzAx', appId: '8ba1ae7c-e229-4102-a348-9c8b5c5923ed' }      
});

exports.handler = function(event, context) {
    const firstNotification = new OneSignal.Notification({      
        template_id: "726887ee-8f4f-4eaf-bc13-09e96864e467",
        included_segments: ["Subscribed Users"]     
    });
    myClient.sendNotification(firstNotification);
}