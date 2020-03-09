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
var x_p, y_p; // position of the cursor relative to the plate
var x_0, y_0; // position of the plate relative to the document
              // right after 'mousedown' event

// values
var gap_rods = 315;
var width_rod = 45;
var hegiht_rod = 335;
var gap_plates = 55;
var height_floor = 535;

var rod1 = {
  id: 1,
  plates: [3,2,1],
  dragend: [225,270,200,535] //[xmin,xmax,ymin,ymax]
};

var rod2 = {
  id: 2,
  plates: [],
  dragend: [540,585,200,535]
}

var rod3 = {
  id: 3,
  plates: [],
  dragend: [855,900,200,535]
}

function get_pos(event,obj){
  document.getElementById('dev').innerHTML = "(" + event.clientX +"," + event.clientY + ")";
}

function onMousedown(event,plate){
  cur_plate = plate;
  x_p = event.offsetX;
  y_p = event.offsetY;
  x_0 = cur_plate.style.left.slice(0,-2);
  y_0 = cur_plate.style.top.slice(0,-2);
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

  var rods = [rod1,rod2,rod3];
  var x_0_cen = parseInt(x_0) + parseInt(cur_plate.style.width.slice(0,-2))/2;
  var y_0_cen = parseInt(y_0) + parseInt(cur_plate.style.height.slice(0,-2))/2;

  var cur_rod;
  for (i in rods){
    console.log(i);
    if(x_0_cen > rods[i].dragend[0] && x_0_cen < rods[i].dragend[1]
      && y_0_cen > rods[i].dragend[2] && y_0_cen < rods[i].dragend[3]){
        console.log("dele");
        cur_rod = rods[i];
        rods.splice(i,1);
        break;
    }
  }

  var correct = 0;

  console.log(rods.length);

  for (rod of rods){
    if(pos_x > rod.dragend[0] && pos_x < rod.dragend[1] && pos_y > rod.dragend[2] && pos_y < rod.dragend[3]){
      console.log(rod.plates[rod.plates.length - 1]);
      console.log(cur_rod.plates[cur_rod.plates.length - 1]);
      if(rod.plates.length == 0 || rod.plates[rod.plates.length - 1] > cur_rod.plates[cur_rod.plates.length - 1]){
        cur_plate.innerHTML = rod.id;
        rod.plates.push(cur_rod.plates[cur_rod.plates.length - 1]);
        cur_rod.plates.pop();
        cur_plate.style.top = height_floor - rod.plates.length * gap_plates + "px";
        cur_plate.style.left = parseInt(x_0) + gap_rods * (rod.id - cur_rod.id) + "px";
        correct = 1;
        break;
      }
      else{
        break;
      }
    }
  }

  if (correct == 0){
    cur_plate.innerHTML = "Inappropriate";
    cur_plate.style.left = x_0 + "px";
    cur_plate.style.top = y_0 + "px";
  }

  console.log(rod1);
  console.log(rod2);
  console.log(rod3);

  count += correct;
  document.getElementById('count').innerHTML = "Total count: " + count;
}
