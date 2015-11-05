<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$grupo = $_REQUEST['grupo'];
$evaluacion = $_REQUEST['evaluacion'];

$query = "select p.cedula, (p.nombre||' '||apellido1||' '||apellido2) as nombre, 0 as nota 
from personas p inner join matriculas m
on p.cedula = m.cedula
inner join gruposmatriculas gm
on m.idmatricula = gm.idmatricula
inner join grupos g
on gm.idgrupos = g.idgrupo
where g.idgrupo = '$grupo'
except
select p.cedula ,(p.nombre||' '||apellido1||' '||apellido2) as nombre, 0 as nota 
from personas p inner join evaluaciones_estudiantes ee
on p.cedula = ee.cedula
inner join evaluaciones e
on ee.idevaluacion = e. idevaluacion
where e.idevaluacion = $evaluacion
union
select p.cedula, (p.nombre||' '||apellido1||' '||apellido2) as nombre, ee.nota 
from personas p inner join evaluaciones_estudiantes ee
on p.cedula = ee.cedula
inner join evaluaciones e
on ee.idevaluacion = e. idevaluacion
where e.idevaluacion = $evaluacion";

$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr[] = $row;
}

echo json_encode($arr);