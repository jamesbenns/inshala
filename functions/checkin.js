exports.handler = function(event, context, callback) {
    console.log('event', event);
    console.log('context', context);
    callback(null, {
        statusCode: 200,
        body: "Hello, World"
    });
}

// curl --request POST --header 'PRIVATE-TOKEN: 864PF-QH7xmgtZcA1aub' --header "Content-Type: application/json" --data '{"branch": "master", "encoding": "base64", "author_email": "satphone@jamesbenns.com", "author_name": "Sat Phone", "content": "Ci0tLQp0aXRsZTogQXV0byBjaGVjay1pbgpkYXRlOiAyMDE5LTA5LTI2VDIxOjMwOjAwLjAwOFoKbGF0OiAnMzguNzMwODM2Jwpsb246ICcxOS44NDkxMjgnCi0tLQo=", "commit_message": "Auto check-in"}' 'https://gitlab.com/api/v4/projects/14462796/repository/files/content%2Fblog%2F2019-09-26-21-30.md'