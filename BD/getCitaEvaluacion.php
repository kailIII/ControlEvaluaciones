<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$idEval = $_REQUEST['idEval'];
$cedula = $_REQUEST['cedula'];

$query = "SELECT cr.idcita,cr.fecha,cr.hora_inicio,cr.hora_fin FROM citasrevision AS cr 
INNER JOIN citasrevision_estudiantes AS cre ON cr.idcita = cre.idcita
WHERE cr.idevaluacion=$idEval AND cre.cedula='$cedula';";

$result = pg_query($conn, $query);
$row = pg_fetch_row($result);

if($row[0] != null) {
	echo json_encode($row);
}
else {
	echo false;
}