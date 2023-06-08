async function initMap(){
        //map options 
        var options={
            center:{
                lat:38.246291,
                lng:21.735188
            },
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:false
        },
        element = document.getElementById('map-canvas'),
    
        //map
        map = new google.maps.Map(element,options);
        console.log("callback done");
}

