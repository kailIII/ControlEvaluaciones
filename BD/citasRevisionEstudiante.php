<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$idEval = $_REQUEST['idEval'];

$query = "SELECT cr.idcita,cr.fecha,cr.hora_inicio,cr.hora_fin FROM citasrevision AS cr
WHERE cr.idcita NOT IN (SELECT cre.idcita FROM citasrevision_estudiantes AS cre) AND cr.idevaluacion=$idEval";

$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr[] = $row;
}

echo json_encode($arr);