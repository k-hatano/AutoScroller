
chrome.tabs.onAttached.addListener( function(tabId, info){
	chrome.tabs.get(tabId, function(tab){
		chrome.tabs.update(tabId, { 'pinned':false });
	});
}
);

chrome.tabs.onMoved.addListener( function(tabId, info){
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