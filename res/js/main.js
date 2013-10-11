/*
	Data structure for our message
*/
function dataItem(id, user, text, date) {
	this.id = id;
	this.user = user;
	this.text = text;
	this.date = date;
}


function loadData() {
	/*
		Send a GET request to own server
		Due to same-origin policy of javascript (browser-side programming language) which applies to XMLHttpRequest methods,
		jsonp is used to bypass restrictions of SOP without using cookies
		Configure ajax request to expect a json object wrapped in a callback function named 'callback'
	*/
	$.ajax({
			type: 'GET',	// send a GET request to our server
			url: rootURL,	
			dataType: 'jsonp',	// expect a jsonp response
			jsonpCallback: 'callback',	// expect response to be wrapped in a callback function named 'callback'
			success: function(data) {	// if call was success, display the response data
				responseData = data;
				displayData(data);
			},
			error: function(xhr, textStatus, thrownError) {	// if there was an error, display the appropriate message
				if(textStatus == "timeout") {
					alert('Please connect to the internet');
				}
				else {
					
					if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
		
						navigator.notification.alert('The app should be restarted');
					}
					else {
						alert('The app should be restarted');
					}
				}
			},
			timeout: 10000 // timeout after 10 seconds
		});

}

function displayData(data) {
	
	/*
		Empty the list
	*/
	$('#thelist').empty();
	
	var i;
	var item, id, user, text, date;
	
	/*
		Parse each item in data array
	*/
	for(i=0; i < data.message.length; ++i) {
		item = data.message[i];
		id = item.id;
		user = item.user;
		text = item.text;
		date = item.date;
		
		/*
			Add each item to the list dynamically
		*/
		$('#thelist').append('<li index="'+i+'" class="listItem" id="'+id+'"><div class="user">'+user+'</div><div class="date">'+date+'</div><div class="text">'+text+'</div></li>');
	}
	
	var pullDownEl = document.getElementById('pullDown');
	var pullDownOffset = pullDownEl.offsetHeight;
	
	/*
		Configure iScroll variable to enable scrolling on list
	*/
	centerScroll = new iScroll('centerContent', {
		useTransition: true,
		topOffset: pullDownOffset,
		vScrollbar: false,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Pull down...';
			} 
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Release...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Pull down...';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Loading...';
				/*
					On release load the data again
				*/
				loadData();
			} 
		}
	});
	
	/*
		Bind click event to each list item
	*/
	$('.listItem').click(function() {
		displayDetailPage(this.getAttribute('index'));
	});
}

function displayDetailPage(index) {
	var item = responseData.message[index];
	var	id = item.id;
	var	user = item.user;
	var	text = item.text;
	var	date = item.date;

	/*
		Empty detail page and fill it with new data
	*/
	$('#rightWrapper').empty();
	$('#rightWrapper').append('<h1>'+user+'</h1>');
	$('#rightWrapper').append('<div class="date pageRightElement">'+date+'</div><hr><br><br>');
	$('#rightWrapper').append('<div class="text pageRightElement">'+text+'</div><br><br>');
	
	/*
		Create new scroll variable
		If needed, destroy old one to make space
	*/
	if(rightScroll != null) {
		rightScroll.destroy();
		rightScroll = null;
	}
	
	
	rightScroll = new iScroll('rightContent', {vScrollbar: false, hScrollbar: false, zoom: true, 
	onZoomEnd: function() { 
		currentScale = this.scale; // update current zooming scale
	}
	});
	
	/*
		Make right page visible by changing class
		Invisible class has margin-left: 100%, visible one has margin-left: 0
	*/
	document.getElementById('pageRight').setAttribute('class', 'pageRightVis');
}

/*
	Navigation behavior
*/
function bindEvents() {

	/*
		Configure touch events for right page navigation
	*/
	$('#pageRight').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "right") {
				/*
					If zoomed in, disable swiping for navigation
				*/
				if(currentScale != 1.0) {
					return;
				}
				document.getElementById('pageRight').setAttribute('class', 'pageRightInv');
			}
		}	
	});


}

/*
	Starting function
*/

{

	// universal variables
	var centerScroll = null, rightScroll = null;
	var rootURL = "http://internet-services.biz/dbmotivation/service/message";
	var responseData;
	var currentScale = 1.0;
	
	
	/*
		After DOM content is loaded, load data asynchronously with ajax call
	*/
	document.addEventListener('DOMContentLoaded', function () { 
		loadData();
	}, false);
	
	// back button and menu button functions for Android - recognized by phonegap
	document.addEventListener("deviceready", function() {	
		
		//document.removeEventListener('backbutton', goLeft, false);
		document.addEventListener("backButton", function() {
			device.exitApp();
		}, false);
		document.addEventListener("menubutton", function() {
			
		}, false);
			
	}, false);
	
	/*
		On app resume, reload the data
	*/
	document.addEventListener("resume", function() {
		loadData
	}, false);

	/*
		Bind events for navigation
	*/
	bindEvents();
	
}