
chrome.tabs.onCreated.addListener( function(tabId, info){
	console.log("onCreated");
});

chrome.tabs.onUpdated.addListener( function(tabId, info){
	console.log("onUpdated");
});

chrome.tabs.onSelectionChanged.addListener( function(tabId, info){
	console.log("onSelectionChanged");
});

chrome.tabs.onActiveChanged.addListener( function(tabId, info){
	console.log("onActiveChanged");
});

chrome.tabs.onActivated.addListener( function(tabId, info){
	console.log("onActivated");
});

chrome.tabs.onHighlightChanged.addListener( function(tabId, info){
	console.log("onHighlightChanged");
});

var lastHighlighted = [];
var lastHighlightedTime = 0;

chrome.tabs.onHighlighted.addListener( function(info){
	console.log("onHighlighted");
	console.log(info.tabIds);
	var date = new Date();
	var tmpLastHighlighted = lastHighlighted;

	if (date.getTime() - lastHighlightedTime < 1000 && tmpLastHighlighted.length > info.tabIds.length) {
		for (var i = 0; i < tmpLastHighlighted.length; i++) {
			if (info.tabIds.indexOf(tmpLastHighlighted[i]) < 0) {
				chrome.tabs.get(tmpLastHighlighted[i], function(tab){
					var pinned = tab.pinned;
					chrome.tabs.update(tab.id, { 'pinned':!pinned });
				});
			}
		}
	}

	lastHighlighted = info.tabIds;
	lastHighlightedTime = date.getTime();
});

chrome.tabs.onDetached.addListener( function(tabId, info){
	console.log("onDetached");
});

chrome.tabs.onRemoved.addListener( function(tabId, info){
	console.log("onRemoved");
});

chrome.tabs.onReplaced.addListener( function(tabId, info){
	console.log("onReplaced");
});

chrome.tabs.onZoomChange.addListener( function(tabId, info){
	console.log("onZoomChange");
});

chrome.tabs.onAttached.addListener( function(tabId, info){
	console.log("onAttached");
	chrome.tabs.get(tabId, function(tab){
		chrome.tabs.update(tabId, { 'pinned':false });
	});
}
);

chrome.tabs.onMoved.addListener( function(tabId, info){
	console.log("onMoved");

	var date = new Date();
	if (date.getTime() - lastHighlightedTime < 1000 ) {
		return;
	}

	chrome.tabs.get(tabId, function(tab){
		if (tab.pinned) {
			chrome.windows.get(info.windowId, {'populate':true}, function(aWindow){
				if (aWindow.tabs.length - 1 == info.toIndex) {
					chrome.tabs.update(tabId, { 'pinned':false });
				} else {
					chrome.windows.get(info.windowId, {'populate':true}, function(aWindow){
						if (!aWindow.tabs[info.toIndex + 1].pinned) {
							chrome.tabs.update(tabId, { 'pinned':false });
						}
					});
				}
			});
		} else {
			if (info.toIndex == 0) {
				chrome.tabs.update(tabId, { 'pinned':true });
			} else {
				chrome.windows.get(info.windowId, {'populate':true}, function(aWindow){
					if (aWindow.tabs[info.toIndex - 1].pinned) {
						chrome.tabs.update(tabId, { 'pinned':true });
					}
				});
			}
		}
	});
}
);