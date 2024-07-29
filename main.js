const rad=Math.PI/180,dist=5,fpsInterval=1000/60;//60 porque quiero 60fps

var rot=0,canv,ctx,keys={},lastTime=0,manzanas=[[40,40],[100,100]];
var tamdib=[12,13,11.5,1,1,1,1,1,1,1,1,1,1,5];
var dot=[[80,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172],[-5,172]];

function random(max){return Math.floor(Math.random()*max)}
function getCords(circ1,circref,offset,r=tamdib[circ1]){
    const angulo=circ1==0?rot+Math.PI+offset:Math.atan2(dot[circ1][1]-dot[circref][1],dot[circ1][0]-dot[circref][0])+offset;
    return [dot[circ1][0]+r*Math.cos(angulo),
            dot[circ1][1]+r*Math.sin(angulo)]
}

function render(){
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.fillStyle="crimson";
    for(let a of manzanas)ctx.fillRect(a[0],a[1],10,10);
    // ctx.strokeStyle="chocolate";
    ctx.fillStyle="chocolate";
    ctx.beginPath();
    ctx.moveTo(...getCords(0,0,-Math.PI/2));//cabeza
    ctx.lineTo(...getCords(0,0,-Math.PI/2-3*Math.PI/8));
    ctx.lineTo(...getCords(0,0,Math.PI/2+3*Math.PI/8));
    for(let a=0;a<dot.length-1;a++)ctx.lineTo(...getCords(a,a-1,Math.PI/2));//cuerpo
    ctx.lineTo(...getCords(dot.length-1,dot.length-2,0));
    for(let a=dot.length-2; a >= 0; a--)ctx.lineTo(...getCords(a,a-1,-Math.PI/2));
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle="black";//ojos
    ctx.beginPath();
    ctx.arc(...getCords(0,0, Math.PI/2,6),2,0,2*Math.PI);
    ctx.arc(...getCords(0,0,-Math.PI/2,6),2,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle="chocolate";
    if(keys[79]){ctx.strokeStyle="black";for(let a=0;a<dot.length-1;a++){ctx.beginPath();ctx.arc(dot[a][0],dot[a][1],tamdib[a],0,2*Math.PI);ctx.fill();ctx.stroke();}}
}

function clamp(p1,p2){
    let curdist=Math.sqrt((dot[p2][0]-dot[p1][0])*(dot[p2][0]-dot[p1][0])+(dot[p2][1]-dot[p1][1])*(dot[p2][1]-dot[p1][1]));
    if (curdist!=dist){//un != aca hace cosas chistosas
        dot[p2][0]=dot[p1][0]+(dot[p2][0]-dot[p1][0])*(dist/curdist);
        dot[p2][1]=dot[p1][1]+(dot[p2][1]-dot[p1][1])*(dist/curdist);
    }
}
function update(deltaTime){
    {dot[0][0] += Math.cos(rot)*2;dot[0][1] += Math.sin(rot)*2;}
    if (keys[39])rot+=rad*5;   //flecha derecha
    if (keys[37])rot-=rad*5;   //flecha izquierda
    if (rot >= 2*Math.PI) rot -= 2*Math.PI;
    if (rot < 0) rot += 2*Math.PI;
    if (keys[77]) manzanas.push([random(canv.width-40)+20,random(canv.height-40)+20]);
    if (keys[76]){//agrega cola
        tamdib.splice(dot.length-2,0,10);
        dot.splice(dot.length-2,0,[dot[dot.length-1][0],dot[dot.length-1][1]]);
        for(let a=3; a < dot.length-1; a++)tamdib[a]=tamdib[2]-(tamdib[2]-tamdib[tamdib.length-1])/(tamdib.length-4)*(a-2);
    }
    for(let a=1; a < dot.length; a++)clamp(a-1,a);
    for(let a of manzanas){
        const nearestX=Math.max(a[0],Math.min(dot[0][0],a[0]+15));
        const nearestY=Math.max(a[1],Math.min(dot[0][1],a[1]+15));
        if (((dot[0][0]-nearestX) ** 2+(dot[0][1]-nearestY) ** 2) <= (tamdib[0] ** 2)){
            a[0]=random(canv.width-40)+20;
            a[1]=random(canv.height-40)+20;
            tamdib.splice(dot.length-2,0,10);
            dot.splice(dot.length-2,0,[dot[dot.length-1][0],dot[dot.length-1][1]]);
            for(let a=3; a < dot.length-1; a++)tamdib[a]=tamdib[2]-(tamdib[2]-tamdib[tamdib.length-1])/(tamdib.length-4)*(a-2);
            break;
        }
    }
}

function gameLoop(timeStamp){
    const deltaTime=timeStamp-lastTime;
    if (deltaTime >= fpsInterval){
        lastTime=timeStamp-(deltaTime % fpsInterval);
        update(deltaTime);
        render();
    }
    requestAnimationFrame(gameLoop); //Llamar al próximo frame
}

window.onload=() =>{
    canv=document.getElementById("canva");
    ctx=canv.getContext("2d");
    document.addEventListener('keydown',function (event){keys[event.keyCode]=true; });
    document.addEventListener('keyup',function (event){keys[event.keyCode]=false; });
    canv.onclick=()=>{
        if(window.event.clientX>canv.width/2+canv.getBoundingClientRect().x)rot+=rad*12;
        else rot-=rad*12;
    }
    
    for(let a=3; a < dot.length-1; a++)tamdib[a]=tamdib[2]-(tamdib[2]-tamdib[tamdib.length-1])/(tamdib.length-4)*(a-2);
    requestAnimationFrame(gameLoop);
}