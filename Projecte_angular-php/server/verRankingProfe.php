<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Content-Type: application/json');

  require("db.php");
  $con=retornarConexion();

  $registros=mysqli_query($con,"select * from rankings WHERE idProfe = $_GET[id] ORDER BY nombreRanking");

  $vec=[];
  while ($reg=mysqli_fetch_assoc($registros))
  {
    $vec[]=$reg;
  }

  $cad=json_encode($vec);
  echo $cad;

?>
