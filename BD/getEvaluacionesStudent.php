<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$cedula = $_REQUEST['cedula'];
$idEval = $_REQUEST['idGrupo'];

$query = "select p.cedula, p.nombre, apellido1, apellido2, e.nombre, e.porcentaje, ee.nota, e.idgrupo, 
        e.idevaluacion from personas p inner join evaluaciones_estudiantes ee
        on p.cedula = ee.cedula
        inner join evaluaciones e
        on ee.idevaluacion = e.idevaluacion
        where p.cedula = '$cedula' and e.idgrupo = $idEval";

$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr[] = $row;
}

echo json_encode($arr);