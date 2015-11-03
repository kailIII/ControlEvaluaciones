<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn=pg_connect($strconn);

$n = $_REQUEST['nombre'];
$p = $_REQUEST['porcentaje'];
$i = $_REQUEST['id'];

$query = "UPDATE evaluaciones SET nombre='$n', porcentaje=$p WHERE idevaluacion = $i;";
pg_query($conn,$query) or die("Error actualizando la informacion.");