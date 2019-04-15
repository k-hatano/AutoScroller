
var velocity=0;

function velocityChanged(){
	var slider=document.getElementById("slider");
	var v=slider.value;
	velocity=v;
	if(v>10){
		v="∞";
	}else if(v<-10){
		v="-∞";
	}else if(v==0){
		v="";
	}else{
		
	}
	chrome.browserAction.setBadgeText({text:v});
	
	chrome.extension.getBackgroundPage().velocity=slider.value;
}

function setVelocity(v){
	slider.value=v;
	velocityChanged();
}

function popupClosed(){
	chrome.browserAction.setBadgeText({text:""});
	
	var slider=document.getElementById("slider");
	slider.value=0;
	velocityChanged();
}

function goToTop(){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.executeScript(tab.id, {code: "window.scrollTo(0,0);"}, function(response){});
	});
}

function goToBottom(){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.executeScript(tab.id, {code: "window.scrollTo(0,document.body.scrollHeight);"}, function(response){});
	});
}

document.getElementById("slider").addEventListener("input",velocityChanged,false);
document.getElementById("pause").addEventListener("click",popupClosed,false);
document.getElementById("go_to_top").addEventListener("click",goToTop,false);
document.getElementById("go_to_bottom").addEventListener("click",goToBottom,false);
//document.getElementById("slider").addEventListener("mouseleave",popupClosed,false);

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request=="requestVelocity"){
			sendResponse({farewell:velocity});
		}else{
			sendResponse(undefined);
		}
	});

var port = chrome.runtime.connect();
port.onDisconnect.addListener(function()
{
	popupClosed();
});