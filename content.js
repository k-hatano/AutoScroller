
var velocity=0;

function heartbeat(){
		chrome.extension.sendMessage("requestVelocity", function(response) {
			if(response!=undefined){
				velocity=response.farewell;
				console.log(""+response.farewell);
			}
	});
	window.scrollBy(0,velocity);
	setTimeout(heartbeat,10);
}

heartbeat();
