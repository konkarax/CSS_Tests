function LiveUpdate(){
    //show bins
    fetch("http://localhost:5000/get_bins/").then(response=>response.json()).then(bin=>{
      var infowindow=[];
      for (let i=0;i<bin.length;i++){
        var x=bin[i].location.coordinates[0]
        var y=bin[i].location.coordinates[1]
    
        var myLatlng = new google.maps.LatLng(x,y);
    
        var myIcon;
        if(bin[i].binLoad>80) myIcon="/icons/red_bin.png";
        if(bin[i].binLoad<80) myIcon="/icons/orange_bin.png";
        if(bin[i].binLoad<30) myIcon="/icons/green_bin.png";
            
        marker[i]=new google.maps.Marker({position: myLatlng,icon:myIcon,size:new google.maps.Size(5,8)});
    
        infowindow[i] = new google.maps.InfoWindow({content:"Bin Id: "+String(bin[i]._id)+ "Bin Load:"+String(bin[i].binLoad)});
    
        google.maps.event.addListener(marker[i], 'click', function() {
          infowindow[i].open(map,marker[i]);
        });  
    
        marker[i].setMap(map);
      }
    })


    //show trucks
    fetch("http://localhost:5000/get_trucks/").then(response=>response.json()).then(truck=>{
      var infowindow=[];
      for (let i=0;i<truck.length;i++){
        var x=truck[i].pos_x
        var y=truck[i].pos_y
        var truckLatlng = new google.maps.LatLng(x,y);

        const truckIcon="/icons/truck.png";  

        tr_marker[i]=new google.maps.Marker({position: truckLatlng,icon:truckIcon,size:new google.maps.Size(5,8)});

        infowindow[i]= new google.maps.InfoWindow({content:"Truck Load:"+String(truck[i].truckLoad)});
        google.maps.event.addListener(tr_marker, 'click', function() {
            infowindow[i].open(map,tr_marker);
          });  
        tr_marker[i].setMap(map);
      }
    })
    console.log("fetch");5
}
//map options 
var options={
  center:{
            lat:38.246291,
            lng:21.735188
        },
        zoom: 17,
        //mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false
    },
    element = document.getElementById('map-canvas');

    //map
    map = new google.maps.Map(element,options);
    var marker= [];
    var tr_marker = [];
    var temp_mar = [];
    var temp_tr = [];

    LiveUpdate();

    setInterval(function(){
      for (var i=0; i<tr_marker.length;i++){
        temp_tr[i]=tr_marker[i];
        tr_marker[i].setMap(null);
      }
      for (i=0; i<marker.length;i++){
        temp_mar[i]=marker[i];
        marker[i].setMap(null);
      }
      
      LiveUpdate();
      
    },3000);
    console.log("render done");