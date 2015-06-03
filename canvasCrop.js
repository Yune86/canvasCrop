




var canvasCrop = function(idCanvas,idTarget){


    var offsetX = 10;
    var offsetY = 10;
    var canvas = document.getElementById(idCanvas);
    var ct = canvas.getContext('2d');
    var image = new Image();
    var rectW = 10;
    var rectH = 10;
    var target = document.getElementById(idTarget);
    var pixel_ratio = 1.77;


    var node = function(x,y){

        return {
            x:x,
            y:y,
            drag:false,
            hover: false,
            is_hover: function(e){
                var status = false;
               if(e.clientX < this.x + rectW + offsetX && e.clientX > this.x + offsetX && e.clientY > this.y + offsetY && e.clientY < this.y+rectH + offsetY){
                   status = true;
               }
                return status;
            },
            distance_to: function(x,y){
                return Math.sqrt(Math.pow(x-this.x,2) + Math.pow(y-this.y,2));
            },
            set: function(x,y){
                this.x = x;
                this.y = y;
            }
        }
    }

    var n1 = new node(100,100);
    var n2 = new node(300,100);
    var n3 = new node(300,300);
    var n4 = new node(100,300);


    var newh;
    var newW;

    function drawSelection(x,y,w,h){
        n1.set(x,y);
        n2.set(x+w,y);
        n3.set(x+w,y+h);
        n4.set(x,y+h);
        draw();
    }
    function setPixelRatio(ratio){
        pixel_ratio = ratio;
        var w = distance(n1.x,n1.y,n2.x,n2.y);
        drawSelection(n1.x,n1.y,w,w/ratio);

    }

    image.onload = function () {
        // Adaptar canvas a la imagen
        var maxHeight = screen.height - 37 * screen.height / 100;
        ct.canvas.width = screen.width - 100;
        ct.canvas.height = maxHeight;

        // draw source image
        newh = ct.canvas.width / image.width  * image.height;
        newW = ct.canvas.height / image.height * image.width;

        if (newh > ct.canvas.height){
            newh = ct.canvas.height;
        }else{
            newW = ct.canvas.width;
        }

        if (!newh){newh = screen.width - 100;}
        if (!newW){newW = maxHeight;}

        console.log(ct.canvas.height + " : " + newh);
        ct.canvas.height = newh;
        ct.canvas.width = newW;
        console.log('Canvas adaptado a la imagen');

        // Posicionar rectangulo



        // Dibujar imagen

        ct.drawImage(image, 0, 0, newW, newh);
        console.log("Image Loaded");

        if (image.width > ct.canvas.width || image.height > ct.canvas.height){
            image.src = canvas.toDataURL();
        }else{
            n1.set(10,10);
            n2.set(150,10);
            n3.set(150,150);
            n4.set(10,150);
            setPixelRatio(pixel_ratio);
            draw();
        }


    };


    function draw(){
        console.log("Dibuja joder");
        // Borramos todo
        ct.canvas.width = image.width;
        ct.canvas.height = image.height;
        ct.clearRect(0,0,canvas.width, canvas.height);

        // Dibujamos la imagen

        ct.save();
        ct.globalAlpha = 0.5;
        ct.drawImage(image, 0, 0, image.width, image.height);
        ct.restore();
        console.log(n2.x - n1.x);


        ct.drawImage(image, n1.x + rectW/2, n1.y+rectH/2, n2.x - n1.x,n4.y - n1.y,n1.x + rectW/2,n1.y + rectH/2,n2.x-n1.x,n4.y - n1.y);

        // Dibujamos las lineas
        ct.beginPath();
        ct.moveTo(n1.x+rectW/2,n1.y+rectH/2);
        ct.lineTo(n2.x+rectW/2,n2.y+rectH/2);
        ct.lineTo(n3.x+rectW/2,n3.y+rectH/2);
        ct.lineTo(n4.x+rectW/2,n4.y+rectH/2);
        ct.lineTo(n1.x+rectW/2,n1.y+rectH/2);
        ct.stroke();
        ct.closePath();
        // Dibujamos los 4 rectangulos

        ct.fillRect(n1.x,n1.y,rectW,rectH);
        ct.fillRect(n2.x,n2.y,rectW,rectH);
        ct.fillRect(n3.x,n3.y,rectW,rectH);
        ct.fillRect(n4.x,n4.y,rectW,rectH);

        if (idTarget) {
            render();
        }
        // Dibujamos la imagen en la seleccion
    }

    var hover = false;
    var drag = true;
    var AuxX,AuxY;
    canvas.onmousedown = function(e){

        console.log("Drag Request");
        if (n1.hover){ n1.drag = true; }
        else if (n2.hover){ n2.drag = true; }
        else if (n3.hover){ n3.drag = true; }
        else if (n4.hover){ n4.drag = true; }
        else if (hover){
            drag = true;

            console.log(AuxX+"::"+AuxY);
        }
    };

    document.onmouseup = function(){
        console.log("End drag");
        n1.hover = false; n1.drag = false;
        n2.hover = false; n2.drag = false;
        n3.hover = false; n3.drag = false;
        n4.hover = false; n4.drag = false;
        hover = false;
        drag = false;
    };


    function distance(x1,y1,x2,y2){
        return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
    }


    canvas.onmousemove = function(e){
       // console.log(e.clientX);

        var rect = canvas.getBoundingClientRect();

        offsetX = rect.left;
        offsetY = rect.top;
        var eX = e.clientX - offsetX;
        var eY = e.clientY - offsetY;
        // sobre x1y1
        if (n1.is_hover(e)){ n1.hover = true; }else{ n1.hover = false }
        if (n2.is_hover(e)){ n2.hover = true; }else{ n2.hover = false }
        if (n3.is_hover(e)){ n3.hover = true; }else{ n3.hover = false }
        if (n4.is_hover(e)){ n4.hover = true; }else{ n4.hover = false }


        console.log(n1.distance_to(n2.x,n2.y));
        if (n1.drag && distance(eX, eY,n2.x,n2.y)>20 && distance(eX, eY,n3.x,n3.y)>20){

            // si mueve en X no mueve en Y y viceversa
            n1.x = eX;
           // n1.y = eY;

            // node 4 position
            n4.x = n1.x;
            n4.y = n1.y + distance(n1.x,n1.y,n2.x,n2.y) * 1/pixel_ratio;

            // node 3 position
            n3.y = n4.y;

            // node 2 position
            n2.y = n1.y;

            draw();
        }

        else if (n2.drag && distance(eX, eY,n1.x,n1.y)>20 && distance(eX, eY,n3.x,n3.y)>20){
            n2.x = eX;
          //  n2.y = eY;


            // node 3 position
            n3.x = n2.x;
            n3.y = n2.y + distance(n2.x,n2.y,n1.x,n1.y) * 1/pixel_ratio;

            //console.log("x: "+n3.x+" y:"+n3.y);

            // node 1 position
            n1.y = n2.y;

            // node 4 position
            n4.y = n3.y;

            draw();
        }

        else if (n3.drag && distance(eX, eY,n2.x,n2.y)>20 && distance(eX, eY,n4.x,n4.y)>20){
          //  n3.x = eX;
            n3.y = eY;

            // node 4 position
            n4.x = n3.x - distance(n2.x,n2.y,n3.x,n3.y) * pixel_ratio;
            n4.y = n3.y;


            // node 1 position
            n1.x = n4.x;

            // node 2 position
            n2.x = n3.x;
            draw();
        }

        else if (n4.drag && distance(eX, eY,n1.x,n1.y)>20 && distance(eX, eY,n3.x,n3.y)>20){
            n4.x = eX;
           // n4.y = eY;


            // node 1 position
            n1.y = n4.y - distance(n4.x,n4.y,n3.x,n3.y) * 1/pixel_ratio;
            n1.x = n4.x;

            // node 3 position
            n3.y = n4.y;

            // node 2 position

            n2.y = n1.y;

            draw();
        }
        else if(eX>n1.x && eX <n2.x && eY > n1.y && eY < n3.y){
           // console.log("Estoy dentro!");
            hover = true;
            if (drag){
                // calcular la distancia desde el click en X e Y
                var x = eX - AuxX;
                var y = eY - AuxY;
                console.log("eX: "+eX+"-"+AuxX+":"+x + "||" + n1.x + "->" + n1.x + x);
                n1.x = n1.x + x;
                n2.x = n2.x + x;
                n3.x = n3.x + x;
                n4.x = n4.x + x;

                n1.y = n1.y + y;
                n2.y = n2.y + y;
                n3.y = n3.y + y;
                n4.y = n4.y + y;
                draw();
            }
        }else{
            hover = false;

        }

       // console.log("X: "+n1.x+" < "+eX+ " < " + n2.x);
        AuxX = eX;
        AuxY = eY;
    };


    function render(idTarget){
        var tempCanvas = document.createElement("canvas"),
            tCtx = tempCanvas.getContext("2d");

        tempCanvas.width = n2.x - n1.x;
        tempCanvas.height = n4.y - n1.y;

        tCtx.drawImage(image, n1.x + rectW/2, n1.y+rectH/2, n2.x - n1.x,n4.y - n1.y,0,0,n2.x-n1.x,n4.y - n1.y);

        // write on screen
        target.src = tempCanvas.toDataURL("image/png");
    }

    return {
        ctx: ct,
        rectW: 10,
        rectH: 10,
        load: function(url){
            image.src = url;
        },
        listener: function(idInput){
            document.getElementById(idInput).addEventListener("change", this.onChange)
        },
        onChange: function(e){
            var file = e.srcElement.files[0];
            var reader = new FileReader();
            reader.onload = function(event){

                image.src = event.target.result;
            };
            reader.readAsDataURL(file);
            console.log("Image changed by event");
        },
        render:function(idTarget){

            render(idTarget);


        },
        setPixelRatio: function(ratio){

            setPixelRatio(ratio);
        }

    }
};



