<?php
echo "This is a sever\n";
/*
$name = $_GET["name"];
echo "Your name is $name<br>";
 */

$server = stream_socket_server("tcp://127.0.0.1:8002", $errno, $errorMessage);

echo "looking for a server\n";

if ($server === false) {
    echo "no server found \n";
    throw new UnexpectedValueException("Could not bind to socket: $errorMessage");
}
else{
  echo "server found\n";
}

while (true) {
    $client = @stream_socket_accept($server);

    if ($client) {
        echo "client is accepted\n";
	$content = stream_get_contents($client);
	echo $content;
        //stream_copy_to_stream($client, $server);
        fclose($client);
    }
}
?>

