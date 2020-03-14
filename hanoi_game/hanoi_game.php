<?php
$client = stream_socket_client("tcp://127.0.0.1:8002", $errno, $errorMessage);

if ($client === false){
  throw new UnexpectedValueException("Failed to connect: $errno - $errorMessage");
  }

if(isset($_POST['SubmitButton'])){
    $msg = "Hi, I'm ".$_POST['name'];
     fwrite($client, $msg, strlen($msg));
}
?>


<!doctype html>
<html>
<head>
  <title>Hanoi</title>
  <link rel="stylesheet" href="styles.css" type="text/css">
</head>

<body style="margin: 0px;">
  <p class="small_box" id="time" style="top: 10px">The current time should be here</p>
  <p class="small_box" id="count" style="top: 60px;">Total count : 0</p>
  <p class="small_box" id="dev" style="top: 110px;">Development box</p>
  <p class="small_box" id="finished" style="top: 160px; z-index: 1;">Go to the leaderboard</p>
  <div id="backbond" style="position: relative; margin: 0px; border: 1px solid black; width: 1200px; height: 600px;">
    <img src="bondstructure.png" alt="image" onclick="get_pos(event,this)"
    style="position: absolute; bottom: 0px; width: 1200px; height: 400px;"/>
    <p class="plate" id="plate_1" onmousedown="onMousedown(event,this)"
    style="width: 150px; height: 50px; background-color: green; top: 370px; left: 170px;"/>
    <p class="plate" id="plate_2" onmousedown="onMousedown(event,this)"
    style="width: 200px; height: 50px; background-color: yellow; top: 425px; left: 145px;"/>
    <p class="plate" id="plate_3" onmousedown="onMousedown(event,this)"
    style="width: 250px; height: 50px; background-color: red; top: 480px; left: 120px;"/>
  </div>
  <script type="text/javascript" src="script.js"></script>
</body>
</html>
