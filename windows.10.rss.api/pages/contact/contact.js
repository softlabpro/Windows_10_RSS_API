//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Helper variables.
    var ui = WinJS.UI;

    ui.Pages.define("/pages/contact/contact.html", {
        ready: function (element, options) {
            /// <summary>
            /// This function is called whenever a user navigates to this page. It populates the
            /// page elements with the app's data.
            /// </summary>
            /// <param name="element">
            /// The DOM element that contains all the content for the page.
            /// </param>
            /// <param name="options">
            /// An object that contains one or more property/value pairs to apply to the PageControl.
            /// </param>
            //var appbar = document.getElementById("appbar").winControl;
            //appbar.disabled = true;
            WinJS.Resources.processAll();

            //var article = options.article;
            //element.querySelector(".titlearea .pagetitle").innerText = "About";
            //element.querySelector("#about #content").innerText  = "SoftLabPro (C) 2015.";
            //element.querySelector("#aboutArea").focus();

            document.getElementById("goStart").addEventListener("click", goStart, false);
            document.getElementById("goBack").addEventListener("click", goBack, false);
            document.getElementById("goForward").addEventListener("click", goForward, false);

            var webviewControl = document.getElementById("webview");
            //webviewControl.addEventListener("MSWebViewContentLoading", webViewContentLoading);
            webviewControl.addEventListener("MSWebViewNavigationStarting", navigationStarting);
            webviewControl.addEventListener("MSWebViewNavigationCompleted", navigationCompleted);

        },

        unload: function () {
            /// <summary>This function is called when the user navigates away from the page.</summary>
            //var appbar = document.getElementById("appbar").winControl;
            //appbar.disabled = false;
        }

    });

    //function webViewContentLoading(e) {
    //    document.getElementById("goBack").disabled = !webview.canGoBack;
    //    document.getElementById("goForward").disabled = !webview.canGoForward;
    //}

    // NavigationStarting event is triggered when the WebView begins navigating to a new URL.
    function navigationStarting(e) {
        updateNavigatingState(true);
    }

    // NavigationCompleted event is triggered either after all the DOM content has been loaded
    // successfully, or when loading failed.  The event arg for this is different from the other
    // navigation events, and includes a isSuccess field to indicate the status.
    function navigationCompleted(e) {
        updateNavigatingState(false);
    }

    // This function is called when navigation either starts or stops in the WebView.
    // This updates the UI, shows/hides the spinning progress indicator and enables or
    // disables buttons as appropriate.
    function updateNavigatingState(isNavigating) {
        document.getElementById("progress").style.visibility = (isNavigating ? "visible" : "hidden");

        // The goOrStopButton can act as either a Go button or a Stop button depending on
        // whether the WebView is navigating or not.  Change its label and its event
        // listener according to the situation.
        var goStart = document.getElementById("goStart");
        goStart.innerText = (isNavigating ? "Stop" : "Start");

        if (!isNavigating) {
            document.getElementById("goBack").disabled = !(document.getElementById("webview").canGoBack);
            document.getElementById("goForward").disabled = !(document.getElementById("webview").canGoForward);
        }
    }

    function goStart() {
        try {
            document.getElementById("webview").navigate("http://softlabpro.blogspot.com/");
        } catch (error) {
            WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
            return;
        }
    }

    function goForward() {
        var webviewControl = document.getElementById("webview");
        if (webviewControl.canGoForward) {
            webviewControl.goForward();
        }
    }

    function goBack() {
        var webviewControl = document.getElementById("webview");
        if (webviewControl.canGoBack) {
            webviewControl.goBack();
        }
    }

})();