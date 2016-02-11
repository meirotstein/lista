var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

function start(resourcesPath) {
    app.get('/', function (req, res) {
        res.sendFile(resourcesPath + 'index.html');
    });
    // added by EK to load the dashboard
    app.get('/dashboard', function (req, res) {
        res.sendFile(resourcesPath + 'dashboard.html');
    });

    app.get(/\/(css|img|js|lib|templates|sounds)\/.*/, function (req, res) {
        res.sendFile(resourcesPath + req.url);
    });


    io.on('connection', function (socket) {
        console.log('a user connected with socket id ' + socket.id);

        socket.on('chat message', function (msg) {
            function transformContent(/** string */content) {
                _.forEach({
                    'Google': 'http://www.google.com',
                    'HTML': 'http://www.w3schools.com/tags/default.asp',
                    'purchase order': "https://www.sapfioritrial.com/sap/hana/uis/clients/ushell-app/shells/fiori/FioriLaunchpad.html?helpset=trial&sap-client=001#PurchaseOrder-approve&/HeaderDetails/WorkflowTaskCollection(SAP__Origin='EC3_800',WorkitemID='000001876879')",
                    'budget': "https://www.sapfioritrial.com/sap/hana/uis/clients/ushell-app/shells/fiori/FioriLaunchpad.html?helpset=trial&sap-client=001#MySpend-monitor",
                    'spending': "https://www.sapfioritrial.com/sap/hana/uis/clients/ushell-app/shells/fiori/FioriLaunchpad.html?helpset=trial&sap-client=001#BalanceAmountInDisplayCrcy_E-analyzeSBKPIDetails?chipId=6ddb79cf-26ec-0f37-ba5c-c11b4903abee-135f4a64b9707&dimension=BusinessArea&evaluationId=E.1441016956687&tileType=TT&/viewId=V.1441017236538",
                    "invoice": "https://www.sapfioritrial.com/sap/hana/uis/clients/ushell-app/shells/fiori/FioriLaunchpad.html?helpset=trial&sap-client=001#CustomerInvoice-monitor",
                    "calendar": "https://www.sapfioritrial.com/sap/hana/uis/clients/ushell-app/shells/fiori/FioriLaunchpad.html?helpset=trial&sap-client=001#TeamCalendar-show"
                }, function (site, key) {
                    content = content.replace(key, '<a href="' + site + '" target="_blank">' + key + '</a>');
                });
                return content
            }

            msg.content = transformContent(msg.content);
            console.warn('message to send: ' + JSON.stringify(msg));
            if (msg.content) {
                io.emit('chat message', msg);
            }
        });
        socket.on('disconnect', function () {
            console.log('a user disconnected with socket id ' + socket.id);
        });
    });

    var port = process.env.PORT || 3000;

    http.listen(port, function () {
        console.log('listening on *:' + port);
    });
}

module.exports = {
    start: start
};


