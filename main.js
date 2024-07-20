const fpsInterval=1000/60;//60 porque quiero 60fps

var canv,ctx,keys={},lastTime=0;
var tam_dib=[5,5,5,5,5];
var dist=[10,10,10,10,10];
var dot=[[40,300],[40,200],[40,100],[200,40],[300,40]];

function drawSnk(){
    for(let a=0;a<dot.length;a++){
        ctx.beginPath();
        ctx.arc(dot[a][0],dot[a][1],tam_dib[a],0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}
function render(){
    ctx.clearRect(0,0,canv.width,canv.height);
    for(let a=1;a<dot.length;a++)clamp(a-1,a);
    drawSnk();
}
function clamp(p1,p2){
    let curdist=Math.sqrt((dot[p2][0]-dot[p1][0])*(dot[p2][0]-dot[p1][0])+(dot[p2][1]-dot[p1][1])*(dot[p2][1]-dot[p1][1]));
    if(curdist>dist[p1]){
        dot[p2][0]=dot[p1][0]+(dot[p2][0]-dot[p1][0])*(dist[p1]/curdist);
        dot[p2][1]=dot[p1][1]+(dot[p2][1]-dot[p1][1])*(dist[p1]/curdist);
    }
}

function update(deltaTime){
    if(keys[37])dot[0][0]-=3;   //flecha izquierda
    if(keys[38])dot[0][1]-=3;   //flecha arriba
    if(keys[39])dot[0][0]+=3;   //flecha derecha
    if(keys[40])dot[0][1]+=3;   //flecha abajo
}

function gameLoop(timeStamp){
    const deltaTime=timeStamp-lastTime;
    if (deltaTime>=fpsInterval){
        lastTime=timeStamp-(deltaTime%fpsInterval);

        update(deltaTime);

        render();
    }
    requestAnimationFrame(gameLoop); //Llamar al próximo frame
}

window.onload=()=>{
    canv=document.getElementById("canva");
    ctx=canv.getContext("2d");
    
    ctx.clearRect(0,0,canv.width,canv.height);//eto limpia el canva
    ctx.fillStyle ="#FF00FF";
    render();
    
    document.addEventListener('keydown',function(event){keys[event.keyCode]=true;});
    document.addEventListener('keyup',function(event){keys[event.keyCode]=false;});
    requestAnimationFrame(gameLoop);
}