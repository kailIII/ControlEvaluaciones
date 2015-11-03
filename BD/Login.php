<?php
$strconn=  "host=172.24.28.21 port=5433 dbname=SegundoProyecto user=usrSegundoProyecto password=12345";
$conn = pg_connect($strconn);

$cedula = $_REQUEST['cedula'];
$pass = $_REQUEST['pass'];

$query = "select tipo,usuarios.cedula, nombre||(' ')||apellido1||(' ')||apellido2 as nombre from usuarios
          inner join personas
          on personas.cedula = usuarios.cedula
          where personas.cedula = '$cedula' and usuarios.contraseña = '$pass'";
$result = pg_query($conn, $query);

$arr = array();
while ($row = pg_fetch_assoc($result)) {
    $arr = $row;
}

if($arr != [])
    echo json_encode($arr);
else
    echo "Error";