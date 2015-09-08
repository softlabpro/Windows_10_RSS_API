//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Helper variables.
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var networkInfo = Windows.Networking.Connectivity.NetworkInformation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            args.setPromise(WinJS.UI.processAll().then(function () {

                var splitView = document.querySelector(".splitView").winControl;
                new WinJS.UI._WinKeyboard(splitView.paneElement); // Temporary workaround: Draw keyboard focus visuals on NavBarCommands
                document.getElementById("version").innerHTML = "Menu " + getAppVersion();

                return IO.loadStateAsync();

            }).done(function () {
                // Initialize network related event handlers and variables.
                networkInfo.addEventListener("networkstatuschanged", function () {
                    _updateConnectionInfo();
                }, false);
                _updateConnectionInfo();

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }, function () {
                // Error loading state.
                Status.error = true;
                Status.message = "Unable to load the list of available feeds.";

                // Disable the appbar and navbar since the app is not usable at this point.
                //var appbar = document.getElementById("appbar").winControl;
                //appbar.disabled = true;

                //var navbar = document.getElementById("navbar").winControl;
                //navbar.disabled = true;

                return nav.navigate(Application.navigator.home);
            }));
        }
    };

    app.oncheckpoint = function (args) {
        // This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
        args.setPromise(IO.saveStateAsync());
    };

    app.onloaded = function (args) {
        WinJS.Resources.processAll();
    }

    app.onready = function () {
        beginBackgroundService();
    }

    function _updateConnectionInfo() {
        /// <summary>
        /// Determine the network status and the user's connection cost.  The connection cost
        /// will decide whether or not we bypass the cache when retrieving feeds.
        /// For more information on managing metered network cost constraints, see:
        /// http://go.microsoft.com/fwlink/?LinkId=296673
        /// </summary>
        var connectionProfile = networkInfo.getInternetConnectionProfile();

        if (connectionProfile) {
            Status.error = false;
            Status.message = "";

            // Determine whether to bypass the cache based on the data transfer limitations
            // set by the carrier.  Using the cache helps protect the user from accumulating
            // monetary charges if they're on a metered network.
            Status.bypassCache = true;
            var connectionCost = connectionProfile.getConnectionCost();
            if (connectionCost) {
                if (connectionCost.overDataLimit || connectionCost.roaming) {
                    Status.bypassCache = false;
                }
            }
        } else {
            Status.error = true;
            Status.message = "Not connected to the Internet.";
        }
    };

    //var client = new WindowsAzure.MobileServiceClient(
    //"https://softlabpro.azure-mobile.net/",
    //"uxRBzNbPSqtzjozYrkMWUcGXMRtTCi39"
    //);

    app.start();

    function beginBackgroundService() {
 
        //requestLockScreenAccess();
        //registerBackgroundTask();
        RegisterBackgroundTask(
                    "js\\background.js",
                    "slp.js.10.rss.api",
                    new Windows.ApplicationModel.Background.PushNotificationTrigger(), //TimeTrigger(15, false),
                    new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable));  // 15 min are minimum
    }
 
    var RegisterBackgroundTask = function (taskEntryPoint, taskName, trigger, condition) {
        UnregisterBackgroundTask(taskName);
        Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync();

        var TaskBuilder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

        TaskBuilder.name = taskName;
        TaskBuilder.taskEntryPoint = taskEntryPoint;
        TaskBuilder.setTrigger(trigger);

        if (condition !== null) {
            TaskBuilder.addCondition(condition);
            // If the condition changes while the background task is executing then it will be canceled.
            TaskBuilder.cancelOnConditionLoss = true;
        }

        var task = TaskBuilder.register();

        // Remove previous completion status from local settings.
        //var settings = Windows.Storage.ApplicationData.current.localSettings;
        //settings.values.remove(taskName);
    };

    var UnregisterBackgroundTask = function (sTaskName) {
        var iter = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
        var hascur = iter.hasCurrent;
        while (hascur) {
            var cur = iter.current.value;
            if (cur.name === sTaskName) {
                cur.unregister(true);
            }
            hascur = iter.moveNext();
        }
    }

    function requestLockScreenAccess() {
        var Background = Windows.ApplicationModel.Background;
        Background.BackgroundExecutionManager.requestAccessAsync();
    }

    function getAppVersion() {
        var p = Windows.ApplicationModel.Package.current.id.version;
        return p.major + "." + p.minor + "." + p.build + "." + p.revision;
    }

    // Constants defining limits of the ListView.
    WinJS.Namespace.define("ListViewLimits", {
        subLimit: 10,
        maxItems: 15
    });

    // Status of the app.
    WinJS.Namespace.define("Status", {
        error: false,
        message: "",
        bypassCache: true
    });
})();
