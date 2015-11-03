<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$grupo = $_REQUEST['grupo'];

$query = "select sum(porcentaje)
from evaluaciones e inner join grupos g
on e.idgrupo = g.idgrupo
where g.idgrupo = '$grupo'";

$result = pg_query($conn, $query);
echo pg_fetch_row($result)[0];

