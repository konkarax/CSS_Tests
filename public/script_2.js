async function LiveUpdate(init){
    //show bins
    await fetch("http://localhost:5000/get_bins/").then(response=>response.json()).then(bin=>{
      for (var i=0;i<bin.length;i++){
        var x=bin[i].location.coordinates[0]
        var y=bin[i].location.coordinates[1]
    
        var myLatlng = new google.maps.LatLng(x,y);
    
        var myIcon;
        if(bin[i].binLoad>80) myIcon="/icons/red_bin.png";
        if(bin[i].binLoad<80) myIcon="/icons/orange_bin.png";
        if(bin[i].binLoad<30) myIcon="/icons/green_bin.png";
    
        
        if (init==true){
          marker[i]=new google.maps.Marker({
            position: myLatlng,
            icon:myIcon,size:new google.maps.Size(5,8), 
            map:map}); 
        }
        else{
          marker[i].setIcon(myIcon);
        } 
        
        infowindow[i] = new google.maps.InfoWindow({
          content:"Bin Id: "+String(bin[i]._id)+ " Bin Load:"+String(bin[i].binLoad)
        });

      }
    })

    for (let i=0;i<marker.length;i++){
      google.maps.event.addListener(marker[i],"click", () =>{
        infowindow[i].close();
        infowindow[i].open(map,marker[i]);
      });
    }


    //show trucks
    await fetch("http://localhost:5000/get_trucks/").then(response=>response.json()).then(truck=>{
      
      for (var i=0;i<truck.length;i++){
        var x,y;
        if (init==true){
          x=truck[i].start_x;
          y=truck[i].start_y;
        }
        else{
          x=truck[i].pos_x;
          y=truck[i].pos_y;
        }
        
        var truckLatlng = new google.maps.LatLng(x,y);

        const truckIcon="/icons/truck.png";  
        
        if (init==true){
          tr_marker[i]=new google.maps.Marker({position: truckLatlng,icon:truckIcon,size:new google.maps.Size(5,8)});
          tr_marker[i].setMap(map);

          tr_infowindow[i]= new google.maps.InfoWindow({content:"Truck Load:"+String(truck[i].truckLoad)});
        }
        else{
          tr_marker[i].setPosition(truckLatlng);
          tr_infowindow[i].setContent("Truck Load:"+String(truck[i].truckLoad))
        } 
        
        
      }
    })

    for (let i=0;i<tr_marker.length;i++){
      google.maps.event.addListener(tr_marker[i],"click", () =>{
        tr_infowindow[i].close();
        tr_infowindow[i].open(map,tr_marker[i]);
      });
    }
    console.log("fetch");
    setTimeout(LiveUpdate,3000,false);
    return;
}
//map options 
var options={
  center:{
            lat:38.25495,
            lng:21.74829
        },
        zoom: 17,
        mapTypeControl:false
    }

element = document.getElementById('map-canvas');

//map
map = new google.maps.Map(element,options);

var marker=[];
var tr_marker=[];
var infowindow=[]; 
var tr_infowindow=[];
var bin=[];

LiveUpdate(true);

console.log("render done");

