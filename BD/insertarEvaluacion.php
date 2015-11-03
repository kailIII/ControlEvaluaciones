<?php

$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn=pg_connect($strconn);

$n = $_REQUEST['nombre'];
$p = $_REQUEST['porcentaje'];
$id = $_REQUEST['id'];
$query = "insert into evaluaciones(idgrupo, nombre, porcentaje) values($id,'$n',$p)";
$result = pg_query($conn,$query) or die("Error en la insercion.");
