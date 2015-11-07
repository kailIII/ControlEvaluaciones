<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$idCita = $_REQUEST['idCita'];
$cedula = $_REQUEST['cedula'];

$query = "INSERT INTO citasrevision_estudiantes(cedula, idcita) VALUES ('$cedula', $idcita);";

pg_query($conn, $query);

echo true;