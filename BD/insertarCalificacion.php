<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn=pg_connect($strconn);

$cedula = $_REQUEST['cedula'];
$evaluacion = $_REQUEST['evaluacion'];
$nota = $_REQUEST['nota'];

$query = "select * from evaluaciones_estudiantes where cedula = '$cedula' and idevaluacion = $evaluacion";
$result = pg_query($conn,$query);
if(pg_fetch_row($result)[0]!=NULL)
{
    $query = "UPDATE evaluaciones_estudiantes SET nota=$nota where cedula = '$cedula' and idevaluacion = $evaluacion;";
    $result = pg_query($conn,$query) or die("Error en la insercion.");
}
else
{
    $query = "INSERT INTO evaluaciones_estudiantes(cedula, idevaluacion, nota) VALUES ('$cedula', $evaluacion, $nota);";
    $result = pg_query($conn,$query) or die("Error en la insercion.");
}


