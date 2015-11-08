<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$idEval = $_REQUEST['idEval'];

$query = "SELECT p.nombre||' '||p.apellido1||' '||p.apellido2 as nombre,cr.fecha,cr.hora_inicio,cr.hora_fin 
FROM citasrevision_estudiantes AS cre 
INNER JOIN personas p ON cre.cedula=p.cedula
INNER JOIN citasrevision AS cr ON cr.idcita=cre.idcita 
WHERE cr.idEvaluacion=$idEval";

$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr[] = $row;
}

echo json_encode($arr);

