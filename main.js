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
    var size = Array();

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
        context.lineWidth = 40;                        
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
        context.arc(x, y, 20, 0, Math.PI*2, false); 
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
            this.recognize();
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

    this.recognize = function () {
        this.cut();
        context.clearRect(0,0,w,h);
    };

    this.cut = function(){

        var imgd = context.getImageData(0, 0, w, h);
        var pix = imgd.data;

        size.t = h;
        size.b = 0;
        size.l = w;
        size.r = 0;

        var m = false;

        for(var i = 0; i < w; i++){

            for(var j = 0; j < h; j++){
                var n = (j*w+i)*4;
                if (pix[n+3] > 100) {
                    if (size.t > j) {
                        size.t = j;
                    };
                    if (size.b < j) {
                        size.b = j;
                    };
                    if (size.l > i) {
                        size.l = i;
                    };
                    if (size.r < i) {
                        size.r = i;
                    };

                    m = true;
                };
            }
            // if(m){console.log(i)};
            m = false;
        }

        console.log(size.t,size.b,size.l,size.r);



        var can = document.getElementById('mini');
        var can2 = document.getElementById('pole');
        var ctx = can.getContext('2d');

        var mw =  size.r - size.l+1;
        var mh =  size.b - size.t+1;
        var ch = 50;   
        var cw = ch*mw/mh;     

        can.width  = cw;
        can.height = ch;

        ctx.drawImage(can2, size.l, size.t, mw, mh, 0, 0, cw, ch);

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