(function () {
    "use strict";

    WinJS.Namespace.define("SoftLabPro", { slp_rss_news: 'N/A', });

    var Notifications = Windows.UI.Notifications;
    var tileUpdateManager = Notifications.TileUpdateManager.createTileUpdaterForApplication();
    //var badgeUpdateManager = Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication();

    //tileUpdateManager.clear();
    //badgeUpdateManager.clear();

    tileUpdateManager.enableNotificationQueue(true);

    //var currentTime = new Date();

    //ShowNotification("RSS update");
    
    function ShowNotification(text) {
        var NotificationsManager = Notifications.ToastNotificationManager;
        var template = Notifications.ToastTemplateType.toastText01;
        var toastXml = NotificationsManager.getTemplateContent(Notifications.ToastTemplateType[template]);
        var textNodes = toastXml.getElementsByTagName("text");
        textNodes[0].appendChild(toastXml.createTextNode(text));
        var toast = new Notifications.ToastNotification(toastXml);
        var res = NotificationsManager.createToastNotifier().show(toast);
}

    function GetRss(rssURL, image) {
        var client = new Windows.Web.Syndication.SyndicationClient();
        var uri = new Windows.Foundation.Uri(rssURL);
        
        client.retrieveFeedAsync(uri).then(
            function (syndicationFeed) {
                if (syndicationFeed) {
                    var group = syndicationFeed.title.text.substring(0,10);
                    var item = syndicationFeed.items[0];
                    var imageStart = item.summary.text.indexOf('<img src="') + 10;
                    var imageEnd = item.summary.text.indexOf('"', imageStart);

                    // Google News image extract with http:
                    //var thumb = "http:" + item.summary.text.substring(imageStart, imageEnd);
                    //Regular RSS
                    var thumb = item.summary.text.substring(imageStart, imageEnd);

                    var text = item.title.text;

                    sendTile(group, text, thumb);
                    sendBadge(syndicationFeed.items.length);
                }
            });
    }

    function sendTile(groupTag, tile_Title, tile_Image) {
        
        var wideTemplate = Notifications.TileTemplateType.tileWide310x150PeekImageAndText01;
        var wideTileXml = Notifications.TileUpdateManager.getTemplateContent(wideTemplate);
        var wideTextAttributes = wideTileXml.getElementsByTagName("text");
            wideTextAttributes[0].appendChild(wideTileXml.createTextNode(tile_Title));
        var wideImageAttributes = wideTileXml.getElementsByTagName("image");
            wideImageAttributes[0].setAttribute("src", tile_Image);
            wideImageAttributes[0].setAttribute("alt", "red graphic");

        var squareTemplate = Notifications.TileTemplateType.tileSquare150x150PeekImageAndText04;
        var squareTileXml = Notifications.TileUpdateManager.getTemplateContent(squareTemplate);
        var squareTextAttributes = squareTileXml.getElementsByTagName('text');
            squareTextAttributes[0].appendChild(squareTileXml.createTextNode(tile_Title));
        var squareImageAttributes = squareTileXml.getElementsByTagName('image');
            squareImageAttributes[0].setAttribute('src', tile_Image);
            squareImageAttributes[0].setAttribute('alt', 'N/A');

        var node = wideTileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        wideTileXml.getElementsByTagName("visual").item(0).appendChild(node);

        var squareTemplate = Notifications.TileTemplateType.tileSquare310x310ImageAndText01;
        var squareTileXml = Notifications.TileUpdateManager.getTemplateContent(squareTemplate);
        var squareTextAttributes = squareTileXml.getElementsByTagName('text');
        squareTextAttributes[0].appendChild(squareTileXml.createTextNode(tile_Title));
        var squareImageAttributes = squareTileXml.getElementsByTagName('image');
        squareImageAttributes[0].setAttribute('src', tile_Image);
        squareImageAttributes[0].setAttribute('alt', 'N/A');

        var node = wideTileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        wideTileXml.getElementsByTagName("visual").item(0).appendChild(node);


        //var dueTime = new Date(currentTime.getTime() + 30);
        //var tileNotification = new Notifications.ScheduledTileNotification(tileXml, dueTime);

        var tileNotification = new Notifications.TileNotification(wideTileXml);
        //tileNotification.expirationTime = new Date(currentTime.getTime() + 600 * 1000);
        tileNotification.tag = groupTag;

        var tileUpdater = Notifications.TileUpdateManager.createTileUpdaterForApplication();
        //tileUpdater.addToSchedule(tileNotification);
        tileUpdater.update(tileNotification);
    }

    function sendBadge(number) {
        var badgeXml;
        var badgeAttributes;

        // Get an XML DOM version of a specific template by using getTemplateContent.
        badgeXml = Notifications.BadgeUpdateManager.getTemplateContent(Notifications.BadgeTemplateType.badgeNumber);
        badgeAttributes = badgeXml.getElementsByTagName("badge");
        badgeAttributes[0].setAttribute("value", number);

        // Create a badge notification from the XML content.
        var badgeNotification = new Notifications.BadgeNotification(badgeXml);
        //badgeNotification.expirationTime = new Date(currentTime.getTime() + 600 * 1000);

        // Send the badge notification to the app's tile.
        Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().update(badgeNotification);
    }

    // Public interface.
    WinJS.Namespace.define("Tiles", {
        GetRss: GetRss,
        ShowNotification: ShowNotification
    });

})();