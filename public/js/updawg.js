
$(document).ready(function() {
    
    $('#map').on('location_changed', function(event, data) {
        getData();
    });

    getLocation();

});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {

	$.getJSON('/search', {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }, getTemplate);

}

function getData() {
    $('.content').empty().html("<i class='fa fa-cog fa-spin'></i>Seeing what's up...");
    $.getJSON('/search', {
        lat: $('.gllpLatitude').val(),
        long: $('.gllpLongitude').val()
    }, getTemplate);
}

function getTemplate(json) {

	if(!window.template) {
    	$.get('/templates/main.html', function(template){
    		window.template = template;
    		render(json);
    	});   
	} else {
		render(json);
	}

}

function render(json) {

    var template = _.template(window.template);
    var html = template(json);
    
    $(".content").html(html);
	$('.thing').wookmark({
	  align: 'center',
	  autoResize: true,
	  comparator: null,
	  container: $('.content'),
	  direction: "left",
	  ignoreInactiveItems: true,
	  itemWidth: 300,
	  fillEmptySpace: false,
	  flexibleWidth: true,
	  offset: 2,
	  onLayoutChanged: undefined,
	  outerOffset: 10,
	  possibleFilters: [],
	  resizeDelay: 50,
	  verticalOffset: 0
	});

}
