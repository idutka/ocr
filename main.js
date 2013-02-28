document.onmousewheel = function (e) {
  // e.preventDefault();
}


window.onload = function(){

	var panelHeight = 50;

    var canvas = document.getElementById('pole');
    var bg = document.getElementById('canva');

        canvas.width  = bg.offsetWidth;
        canvas.height = bg.offsetHeight - 50;

    document.getElementById('fonr').style.display = 'none';


    var context = canvas.getContext('2d');
    
    var pole = new OCR();
        pole.setContext(context);
        pole.setSize(canvas.width,canvas.height);

        
    canvas.onmouseup = function(e) {
        pole.mouseup(e);
    };

    canvas.onmousedown = function(e) {
        pole.mousedown(e);
    };

    canvas.onclick = function(e) {
        pole.click(e);
    };
   
    canvas.onmousemove = function(e) {
        pole.mousemove(e);
    };

    canvas.ondblclick = function(e) {
        pole.dblclick(e);
    };


}


function OCR () {

    var timer = null;
    var l = 1;
    var lmax = 1
    var c = false;
    var context;
    var cX = 0,cY = 50;
    var h = 0,w = 0;
    var px = 0, py = 0;

    this.setContext = function(c){
        context = c;
    };

    // this.setCanvasXY = function(x,y){
    // 	console.log(x,y);
    //     cX = x;
    //     cY = y;
    // };

    this.setSize = function(w1,h1){
        w = w1;
        h = h1;
        l = w;
        lmax = w;
    };

    this.draw = function (e) {
        var x = e.pageX-cX;
        var y = e.pageY-cY;



        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(x, y); 
        context.lineWidth = 30;                        
        // context.strokeStyle = "#000000";               
        context.lineCap = "round";                     
        context.stroke(); 

        px = x;
        py = y;

    };

    this.drawpointer = function (e) {
        var x = e.pageX-cX;
        var y = e.pageY-cY;
 
        px = x;
        py = y;
            
        context.fillStyle = '#000000';
        context.beginPath();
        context.arc(x, y, 15, 0, Math.PI*2, false); 
        context.closePath(); 
        context.fill(); 
            
    }

    this.timetik = function (d) {
        l += w*d/40;
        if (l > lmax) { l = lmax};
        if (l < 0) {l = 0};
        this.drawstatus(l);

        if (l == 0 && !c) {
            clearInterval(timer);
            context.clearRect(0,0,w,h);
        }
        if(l == lmax && !c){
            clearInterval(timer);
            var _this = this; 
            timer = setInterval(function() { _this.timetik(-1) },20);
        }
        
    };
    
    this.drawstatus = function (i) {
        context.clearRect(0,0,w,3);

        var gradient = context.createLinearGradient(0,0,w,3);
            gradient.addColorStop(0, '#F00'); 
            gradient.addColorStop(1, '#FF0');

            context.fillStyle = gradient;
            context.fillRect(0,0,i,3);
    };

    this.mouseup = function(e) {
        c = false;
    };

    this.mousedown = function(e) {
        c = true;
        clearInterval(timer);
        var _this = this; 
        timer = setInterval(function() { _this.timetik(1) },10);
        this.drawpointer(e);
    };

    this.click = function(e) {
        
    };

    this.mousemove = function(e) {
        if(c){
           this.draw(e);
        }
    };

    this.dblclick = function(e) {
        context.clearRect(0,0,w,h);
    };

}