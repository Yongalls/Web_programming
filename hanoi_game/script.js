var start_date = new Date();

function print_time() { //when time > 60 secs
  var cur_date = new Date();
  var time = cur_date - start_date;
  time = parseInt(time/10)

  document.getElementById('time').innerHTML = "Time: "+String((time/100).toFixed(2));
  setTimeout("print_time()",10);
}

print_time();

var count = 0;
var cur_plate;
var backbond = document.getElementById('backbond');
var x_p, y_p; // position of the cursor relative to the plate
var x_0, y_0; // position of the plate relative to the document
              // right after 'mousedown' event

function get_pos(event,obj){
  document.getElementById('dev').innerHTML = "(" + event.clientX +"," + event.clientY + ")";
}

function onMousedown(event,plate){
  cur_plate = plate;
  x_p = event.offsetX;
  y_p = event.offsetY;
  x_0 = cur_plate.style.left;
  y_0 = cur_plate.style.top;
  document.onmousemove = onMousemove;
  document.onmouseup = onMouseup;
  cur_plate.innerHTML = x_0 + "," + y_0;
}

function onMousemove(event){
  cur_plate.style.left = event.clientX - x_p + "px";
  cur_plate.style.top = event.clientY - y_p + "px";
}

function onMouseup(event){
  document.onmousemove = null;
  document.onmouseup = null;

  var pos_x = event.clientX - x_p + parseInt(cur_plate.style.width.slice(0,-2))/2; //pos of center
  var pos_y = event.clientY - y_p + parseInt(cur_plate.style.height.slice(0,-2))/2;

  cur_plate.innerHTML = "up";

  //second stick x(540~585), y(200~535)
  if((pos_x > 540 && pos_x < 585) && (pos_y > 200 && pos_y < 535)){
    cur_plate.innerHTML = "yes";
    cur_plate.style.top = "480px";
    cur_plate.style.left = "435px";
    count += 1;
  }
  else{
    cur_plate.innerHTML = x_0 + "," + y_0;
    cur_plate.style.left = x_0;
    cur_plate.style.top = y_0;
  }
  
  document.getElementById('count').innerHTML = "Total count: " + count;
}
