function dataItem(id, user, text, date) {
	this.id = id;
	this.user = user;
	this.text = text;
	this.date = date;
}


function loadData() {
	$.ajax({
			type: 'GET',
			url: rootURL,
			dataType: 'jsonp',
			jsonp: 'callback',
			crossDomain: true,
			success: function(data) {
				
				displayData(data);
			},
			error: function(xhr, textStatus, thrownError) {
				if(textStatus == "timeout") {
					alert('Please connect to the internet');
				}
				else {
					
					if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
		
						navigator.notification.alert('Die App muss neu gestartet werden');
					}
					else {
						alert('Die App muss neu gestartet werden');
					}
					
				}
			},
			complete: function(request, textStatus) { //for additional info
				//alert("complete: " + request.responseText + " " + textStatus);
				
			},
			timeout: 10000,
			
			jsonpCallback: 'callback'
		});
		
		//displayData('data');
}

function displayData(data) {
	
	$('#thelist').empty();
	
	var i;
	var item, id, user, text, date;
	
	for(i=0; i < data.message.length; ++i) {
		item = data.message[i];
		id = item.id;
		user = item.user;
		text = item.text;
		date = item.date;
		
		$('#thelist').append('<li class="listItem" id="'+id+'"><div class="user">'+user+'</div><div class="date">'+date+'</div><div class="text">'+text+'</div></li>');
	}
	
	var pullDownEl = document.getElementById('pullDown');
	var pullDownOffset = pullDownEl.offsetHeight;
	
	var scroll = new iScroll('centerContent', {
		useTransition: true,
		topOffset: pullDownOffset,
		vScrollbar: false,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Herunterziehen...';
			} 
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Loslassen...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Herunterziehen...';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Ladend...';				
				//pullDownAction();	// Execute custom function (ajax call?)
				
				loadData();
			} 
		}
	});
	
	$('.listItem').click(function() {
		scroll.refresh();
	});
}

/*
	Navigation behavior
*/
function bindEvents() {

	$('#pageCenter').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				document.getElementById('pageLeft').setAttribute('class', 'pageLeftInv');
				document.getElementById('pageCenter').setAttribute('class', 'pageCenterVis');
			}
			
			if(direction == "right") {
				//document.getElementById('pageLeft').setAttribute('class', 'pageLeftVis');
				//document.getElementById('pageCenter').setAttribute('class', 'pageCenterInv');
			}
		}
	});
	
	
	$('#pageLeft').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				document.getElementById('pageLeft').setAttribute('class', 'pageLeftInv');
				document.getElementById('pageCenter').setAttribute('class', 'pageCenterVis');
			}
		}
	});
	
	
	$('#pageRight').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "right") {
				// here check current scale
				document.getElementById('pageRight').setAttribute('class', 'pageRightInv');
			}
		}	
	});
	
	menuScroll = new iScroll('menuContent', {
		vScrollbar: false,
		hScrollbar: false,
		bounce: false
	});
	
}

/*
	Starting function
*/

{

	// universal variables
	var menuScroll;
	var rootURL = "http://internet-services.biz/dbmotivation/service/message";
	// on load behavior
	document.addEventListener('DOMContentLoaded', function () { 
		loadData();
	}, false);
	
	// back button and menu button functions for Android
	document.addEventListener("deviceready", function() {	
		
		//document.removeEventListener('backbutton', goLeft, false);
		document.addEventListener("backButton", function() {
			
		}, false);
		document.addEventListener("menubutton", function() {
			
		}, false);
			
	}, false);
	
	// resume app behavior
	document.addEventListener("resume", function() {
		
	}, false);

	bindEvents();
	
}