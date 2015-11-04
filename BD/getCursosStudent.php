<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$cedula = $_REQUEST['cedula'];

$query = "select idgrupo, c.codigo, numgrupo, nombre 
            from matriculas m inner join gruposmatriculas gm
            on m.idmatricula = gm.idmatricula
            inner join grupos g
            on gm.idgrupos = g.idgrupo
            inner join cursos c
            on g.codigo = c.codigo 
            where cedula = '$cedula'";

$result = pg_query($conn, $query);

$arr = array();
$cont = 1;
while ($row = pg_fetch_row($result)) {
    $arr[] = array(
        'idgrupo' => $row[0],
        'codigo' => $row[1],
        'numgrupo' => $row[2],
        'nombre' => $row[3],
        'cont' => $cont
    );
    
    $cont++;
}

echo json_encode($arr);
