const $ = id => document.getElementById(id);

const state = {
  heading: 88, depth: 3.2, sog: 0, tws: 12.5, speed: 0,
  wind: 90, currentDir: 0, currentSpeed: 0, waypoint: 0, demo:false
};

function norm(n){ return ((Number(n)%360)+360)%360; }
function setText(id,v){ $(id).textContent=v; }

function render(){
  setText("hdg", Math.round(state.heading));
  setText("depth", Number(state.depth).toFixed(1));
  setText("sog", Number(state.sog).toFixed(1));
  setText("tws", Number(state.tws).toFixed(1));
  setText("speed", Number(state.speed).toFixed(1));

  $("headingInput").value=Math.round(state.heading);
  $("depthInput").value=state.depth;
  $("sogInput").value=state.sog;
  $("twsInput").value=state.tws;
  $("speedInput").value=state.speed;
  $("windInput").value=state.wind;
  $("currentDirInput").value=state.currentDir;
  $("currentSpeedInput").value=state.currentSpeed;
  $("waypointInput").value=state.waypoint;

  // Rotate the dial so the selected heading appears at the fixed top pointer.
  $("compass").querySelector(".dial").style.transform=`rotate(${-state.heading}deg)`;
  $("trueWind").style.transform=`rotate(${state.wind}deg)`;
  $("apparentWind").style.transform=`rotate(${state.wind}deg)`;
  $("currentVector").style.transform=`rotate(${state.currentDir}deg)`;
  $("waypoint").style.transform=`translate(-50%,-190px) rotate(${state.waypoint}deg)`;
  $("waypoint").style.display=state.waypoint ? "block" : "none";
}

function bindInput(id,key,number=true){
  $(id).addEventListener("input",e=>{
    state[key]=number ? Number(e.target.value||0) : e.target.value;
    if(key==="heading") state[key]=norm(state[key]);
    render();
  });
}
bindInput("headingInput","heading");bindInput("depthInput","depth");bindInput("sogInput","sog");
bindInput("twsInput","tws");bindInput("speedInput","speed");bindInput("windInput","wind");
bindInput("currentDirInput","currentDir");bindInput("currentSpeedInput","currentSpeed");bindInput("waypointInput","waypoint");

async function enableCompass(){
  try{
    if(!window.isSecureContext) throw new Error("HTTPS required");
    if(typeof DeviceOrientationEvent==="undefined") throw new Error("No orientation sensor");
    if(typeof DeviceOrientationEvent.requestPermission==="function"){
      const permission=await DeviceOrientationEvent.requestPermission();
      if(permission!=="granted") throw new Error("Permission denied");
    }
    window.addEventListener("deviceorientationabsolute",orientationHandler,true);
    window.addEventListener("deviceorientation",orientationHandler,true);
    $("status").innerHTML="<b style='color:#087a43'>● Live iPhone compass enabled</b>";
  }catch(err){
    $("status").textContent="Compass sensor unavailable — use the manual heading.";
  }
}
function orientationHandler(e){
  let h=null;
  if(typeof e.webkitCompassHeading==="number") h=e.webkitCompassHeading;
  else if(typeof e.alpha==="number") h=360-e.alpha;
  if(h!=null){state.heading=norm(h);render();}
}

$("sensorBtn").addEventListener("click",enableCompass);

$("gpsBtn").addEventListener("click",()=>{
  if(!navigator.geolocation){$("gpsInfo").textContent="GPS: not supported";return;}
  navigator.geolocation.watchPosition(pos=>{
    const c=pos.coords;
    if(c.speed!=null && !Number.isNaN(c.speed)) state.sog=c.speed*1.943844;
    $("gpsInfo").textContent=`GPS: ${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)} · accuracy ${Math.round(c.accuracy)} m`;
    render();
  },err=>{
    $("gpsInfo").textContent="GPS: permission/error "+err.message;
  },{enableHighAccuracy:true,maximumAge:1000,timeout:10000});
});

let demoTimer=null;
$("demoBtn").addEventListener("click",()=>{
  state.demo=!state.demo;
  $("demoBtn").textContent=state.demo?"■ Stop Demo":"▶ Demo";
  if(state.demo){
    let t=0;
    demoTimer=setInterval(()=>{
      t+=0.08;
      state.heading=norm(88+25*Math.sin(t));
      state.sog=4+1.5*Math.sin(t/2);
      state.speed=state.sog;
      state.wind=65+12*Math.sin(t*.7);
      state.currentDir=140+8*Math.sin(t*.4);
      state.currentSpeed=.8+.2*Math.sin(t);
      render();
      $("status").textContent="Demo navigation data";
    },80);
  }else clearInterval(demoTimer);
});

$("fullscreenBtn").addEventListener("click",async()=>{
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch{}
});
$("moreBtn").addEventListener("click",()=>{$("panel").scrollIntoView({behavior:"smooth"});});
$("menuBtn").addEventListener("click",()=>{$("panel").classList.toggle("hidden");});

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

render();
