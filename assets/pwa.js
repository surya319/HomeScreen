// ------------------------
// Cookies methods found on w3schools - We need them to not annoy our visitors
// https://www.w3schools.com/js/js_cookies.asp
// ------------------------
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}



// ------------------------
// Here starts our part
// ------------------------
$(document).ready(function () {
    // When the user clicks on Close, we need to keep this in mind and not annoy him again
    $("#BlockInstallClose").on("click", function (e) {
        $("#BlockInstall").removeClass("is-active");
        setCookie("BlockInstallCookieHide", 1, 14);
    });
});

// ------------------------
// We listen to the `beforeinstallprompt` event
// If the user has
// ------------------------
window.addEventListener("beforeinstallprompt", function (event) {
    // Don't display the standard one
    event.preventDefault();

    // We check if the user has the Don't Show Cookie stored. If not, we'll show him the banner.
    let cookieBlockInstallCookieHide = getCookie("BlockInstallCookieHide");
    if (!cookieBlockInstallCookieHide) {
        $("#BlockInstall").addClass("is-active");
    }

    // Save the event to use it later
    window.promptEvent = event;
});

// If the visitor clicks on `Install` button, we'll show the banner
document.addEventListener("click", function (event) {
    if (event.target.matches("#BlockInstallButton")) {
        addToHomeScreen();
    }
});

function addToHomeScreen() {
    // Install prompt
    window.promptEvent.prompt();

    // I added a Google Analytics Event so we can know how many installs we have
    window.promptEvent.userChoice.then(function (choiceResult) {
        if (choiceResult.outcome === "accepted") {
            gtag("event", "Installed PWA", {
                event_category: "PWA",
                value: 1,
            });
        } else {
            // Do nothing
        }
        window.promptEvent = null;
    });
}
