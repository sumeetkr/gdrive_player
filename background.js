var drivePlayerInstance = drivePlayerInstance || {};

chrome.browserAction.onClicked.addListener(function() {
	drivePlayerInstance = webkitNotifications.createHTMLNotification('player.html');
	drivePlayerInstance.show();
});