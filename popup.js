
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

document.getElementById("slider").addEventListener("change",velocityChanged,false);
document.getElementById("pause").addEventListener("click",popupClosed,false);
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