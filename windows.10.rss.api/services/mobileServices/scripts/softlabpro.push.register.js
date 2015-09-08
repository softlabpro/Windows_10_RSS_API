// http://go.microsoft.com/fwlink/?LinkID=290993&clcid=0x409
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind == activation.ActivationKind.launch) {
            // Note: in the simulator this code will go throw the error path
            Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync()
                .then(function (channel) {
                    return softlabproClient.push.registerNative(channel.uri);
                })
                .done(function (registration) {
                    return softlabproClient
                        .invokeApi("notifyAllUsers", { body: { toast: "RSS Push channel started !" } });
                }, function (error) {
                    // Error

                });
        }
    });
})();