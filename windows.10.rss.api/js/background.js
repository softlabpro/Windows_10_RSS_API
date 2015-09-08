(function () {
    "use strict";

    importScripts("/WinJS/js/base.js");
    //importScripts("/js/tiles.js");

    //WinJS.Namespace.define("SoftLabPro", { slp_rss_news: 'N/A', });

    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var deferral = task.getDeferral();

    var Notifications = Windows.UI.Notifications;
    var tileUpdateManager = Notifications.TileUpdateManager.createTileUpdaterForApplication();
    //var badgeUpdateManager = Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication();

    //tileUpdateManager.clear();
    //badgeUpdateManager.clear();

    tileUpdateManager.enableNotificationQueue(true);
    
    //var currentTime = new Date();

    // URI to the feedCollection.json file that contains data of all the feeds.
    //var feedCollectionJSON = "ms-appx:///slp_rss_svet_vesti.json";

    function BackgroundUpdate() {
               
            //ShowNotification("RSS/tiles background update !");
            backgroundTaskInstance.succeeded = true;
            deferral.completed();
            close();
    }

    BackgroundUpdate();
        
})();