
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

chrome.tabs.onHighlighted.addListener( function(info){
	console.log("onHighlighted");
	chrome.tabs.getAllInWindow(info.windowId, function(tabs){
		if (info.tabIds.length == tabs.length && tabs.length > 1) {
			chrome.tabs.get(info.tabIds[0], function(tab){
				var pinned = tab.pinned;
				for (var i = 0; i < info.tabIds.length; i++) {
					chrome.tabs.update(info.tabIds[i], { 'pinned':!pinned });
				}
			});
		}
	});
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