<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$grupo = $_REQUEST['grupo'];

$query = "select idevaluacion, e.idgrupo, e.nombre, porcentaje
from evaluaciones e inner join grupos g
on e.idgrupo = g.idgrupo
where g.idgrupo = '$grupo'";

$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr[] = $row;
}

echo json_encode($arr);