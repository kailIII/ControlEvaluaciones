<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$idEval = $_REQUEST['idEval'];
$fecha = $_REQUEST['fecha'];
$horaInicio = $_REQUEST['horaInicio'];
$horaFin = $_REQUEST['horaFin'];

$query = "INSERT INTO citasrevision(idevaluacion, fecha, hora_inicio, hora_fin) 
VALUES ($idEval, '$fecha', '$horaInicio', '$horaFin')";

pg_query($conn, $query);

echo true;