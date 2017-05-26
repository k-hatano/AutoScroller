
chrome.tabs.onAttached.addListener( function(tabId, info){
	chrome.tabs.get(tabId, function(tab){
		chrome.tabs.update(tabId, { 'pinned':false });
	});
}
);

chrome.tabs.onMoved.addListener( function(tabId, info){
	if (info.toIndex == 0) {
		chrome.tabs.get(tabId, function(tab){
			chrome.tabs.update(tabId, { 'pinned':true });
		});
	}
}
);