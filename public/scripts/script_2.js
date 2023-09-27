async function LiveUpdate(init,temp_in_senario){
  //show trucks and waste station
  var bin_in_senario;
  await fetch("http://localhost:5000/get_trucks/").then(response=>response.json()).then(truck=>{
      
    for (var i=0;i<truck.length;i++){
      var x,y;
      bin_in_senario = truck[i].route.length;
      console.log(bin_in_senario)
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


        for (var j=0;j<truck[i].route.length;j++){

          var route_xy = new google.maps.LatLng(truck[i].route[j][0],truck[i].route[j][1]);
          coords.push(route_xy) 

          const bin_num = truck[i].route[j][2];
          if (bin_num>0){
            bins_list.push(bin_num);
          }
          else if (bin_num==-1){
            const hq_x = truck[i].route[j][0];
            const hq_y = truck[i].route[j][1];
            const hqLatLng = new google.maps.LatLng(hq_x,hq_y);
            const hqIcon = "/icons/factory.png"; 

            hq_marker=new google.maps.Marker({position: hqLatLng,icon:hqIcon,size:new google.maps.Size(5,8)});
            hq_marker.setMap(map);

            hq_infowindow= new google.maps.InfoWindow({content:"Waste Station"});
          }
        }
        
      }
      else{
        tr_marker[i].setPosition(truckLatlng);
        tr_infowindow[i].setContent("Truck Load:"+String(truck[i].truckLoad))
      } 

      
        
      if (temp_in_senario!=bin_in_senario && init==false){
        coords = [];
        bins_list =[];
        for (var j=0;j<truck[i].route.length;j++){
          if (truck[i].route[j][2]>0){
            bins_list.push(truck[i].route[j][2]);

          }
          
          var route_xy = new google.maps.LatLng(truck[i].route[j][0],truck[i].route[j][1]);
          coords.push(route_xy);
        }
        coords.push(coords[0]);
        line.setPath(coords);


      }

      if (init==true){
        coords.push(coords[0])
        line= new google.maps.Polyline({
          path: coords,
          strokeColor: '#0000FF',
          strokeOpacity: 0.7,
          strokeWeight: 2
        });

        line.setMap(map);
      }
    
      
  }
})

for (let i=0;i<tr_marker.length;i++){
  google.maps.event.addListener(tr_marker[i],"click", () =>{
    tr_infowindow[i].close();
    tr_infowindow[i].open(map,tr_marker[i]);
  });
}

google.maps.event.addListener(hq_marker,"click", () =>{
  hq_infowindow.close();
  hq_infowindow.open(map,hq_marker);
});

  
    //show bins
    await fetch("http://localhost:5000/get_bins/").then(response=>response.json()).then(bin=>{
      for (var i=0;i<bin.length;i++){

        var x=bin[i].location[0]
        var y=bin[i].location[1]
    
        var myLatlng = new google.maps.LatLng(x,y);
    
        var myIcon;
        var fill_level = 100*bin[i].binLoad/bin[i].binMaxLoad;

        if(fill_level>80) myIcon="/icons/red_bin";
        if(fill_level<=80) myIcon="/icons/orange_bin";
        if(fill_level<40) myIcon="/icons/green_bin";

        if (bins_list.includes(parseInt(bin[i]._id))==false){
          myIcon= myIcon +"_transparent"
        }
        myIcon = myIcon +".png"

        if (bin[i].alert==true) myIcon="/icons/alert.png";
    
        
        if (init==true){
          marker[i]=new google.maps.Marker({
            position: myLatlng,
            icon:myIcon,size:new google.maps.Size(5,8), 
            map:map}); 

            infowindow[i] = new google.maps.InfoWindow({
              content:"Bin Id: "+String(bin[i]._id)+ " Bin Load:"+String(bin[i].binLoad)
            });
        }
        else{
          marker[i].setIcon(myIcon);
        } 
        
        infowindow[i].setContent("Bin Id: "+String(bin[i]._id)+ " Bin Load:"+String(bin[i].binLoad)+
                                  " Temperature: "+ String(bin[i].temperature+ " Humidity: "+String(bin[i].humidity)));
        
        if(bin[i].temperature>=50) {
          infowindow[i].setContent("High Temperature Warning");
        }

        if(bin[i].humidity>=70) {
          infowindow[i].setContent("High Humidity Warning");
        }

      }
    })

    for (let i=0;i<marker.length;i++){
      if (marker[i]){
        google.maps.event.addListener(marker[i],"click", () =>{
          infowindow[i].close();
          infowindow[i].open(map,marker[i]);
        });
      }
     
    }
    
    console.log("fetch");
    setTimeout(LiveUpdate,3000,false,bin_in_senario);
    return;
}
//map options 
var options={
  center:{
            lat:38.25495,
            lng:21.74829
        },
        zoom: 16,
        mapTypeControl:false
    }

element = document.getElementById('map-canvas');

//map
map = new google.maps.Map(element,options);

var marker=[];
var tr_marker=[];
var hq_marker;
var infowindow=[]; 
var tr_infowindow=[];
var hq_infowindow;
var bin=[];
var coords = [];
var line;

var bins_list=[];

LiveUpdate(true,0);

console.log("render done");