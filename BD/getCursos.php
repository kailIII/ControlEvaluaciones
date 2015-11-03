<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$cedula = $_REQUEST['cedula'];

$query = "select gf.idgrupo, g.codigo, numgrupo, nombre 
          from gruposfuncionarios gf inner join grupos g 
          on g.idgrupo = gf.idgrupo 
          inner join cursos c
          on g.codigo = c.codigo
          where cedula = '$cedula'";

$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr[] = $row;
}

echo json_encode($arr);

