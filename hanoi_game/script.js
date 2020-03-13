var count = 0;
var cur_plate;
var x_p, y_p; // position of the cursor relative to the plate
var x_0, y_0; // position of the plate relative to the document
              // right after 'mousedown' event

// values (px)
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

var start_date = new Date();
var total_time = 0;
var finished = false;

function print_time() { //when time > 60 secs
  var cur_date = new Date();
  var time = cur_date - start_date;
  time = parseInt(time/10)

  if (rod2.plates.length == 3 || rod3.plates.length == 3){
    document.getElementById('dev').innerHTML = "Finished";
    document.getElementById('finished').onclick = function(){
      document.location = "hanoi_leaderboard.html";
    };
    finished = true;
    total_time = time/100;
  }
  else{
    document.getElementById('time').innerHTML = "Time: " + String((time/100).toFixed(2));
    setTimeout("print_time()",10);
  }
}

print_time();

var rods = [rod1,rod2,rod3];
var cur_rod;

function get_pos(event,obj){
  document.getElementById('dev').innerHTML = "(" + event.clientX +"," + event.clientY + ")";
}

function onMousedown(event,plate){
  if (finished == true){
    return false;
  }
  cur_plate = plate;
  x_p = event.offsetX;
  y_p = event.offsetY;
  x_0 = cur_plate.style.left.slice(0,-2);
  y_0 = cur_plate.style.top.slice(0,-2);

  var x_0_cen = parseInt(x_0) + parseInt(cur_plate.style.width.slice(0,-2))/2;
  var y_0_cen = parseInt(y_0) + parseInt(cur_plate.style.height.slice(0,-2))/2;

  //finding current rod
  for (i in rods){
    if(x_0_cen > rods[i].dragend[0] && x_0_cen < rods[i].dragend[1]
      && y_0_cen > rods[i].dragend[2] && y_0_cen < rods[i].dragend[3]){
        cur_rod = rods[i];
        break;
    }
  }

  //check if cur_plate is above the rest of plates
  var id_plate = cur_plate.id.split('_')[1];
  if (id_plate == cur_rod.plates[cur_rod.plates.length - 1]){
    document.onmousemove = onMousemove;
    document.onmouseup = onMouseup;
    cur_plate.innerHTML = cur_rod.id;
  }
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

  var correct = 0;

  for (rod of rods){
    if (cur_rod.id == rod.id){
      continue;
    }
    if(pos_x > rod.dragend[0] && pos_x < rod.dragend[1] && pos_y > rod.dragend[2] && pos_y < rod.dragend[3]){
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

  count += correct;
  document.getElementById('count').innerHTML = "Total count: " + count;
}
