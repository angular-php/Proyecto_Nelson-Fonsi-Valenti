<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header("Content-Type: text/html;charset=utf-8");
  header('Content-Type: application/json');

  require("db.php");

  $con = retornarConexion();
  class Result {}
  $response = new Result();

  $instruccion = "select count(*) as cuantos from rankings where codigo = '$_GET[codigo]'";
  $resultado = mysqli_query($con, $instruccion);

  //Comprovar que exista
  while ($fila = $resultado->fetch_array()) {
    $numero = $fila["cuantos"];
  }

  if ($numero != 0) {
    $response->resultado = 'OK';
    $response->mensaje = 'Codigo de Ranking Correcto!';

  }elseif ($numero == 0) {
    $response->resultado = 'KO';
    $response->mensaje = 'No exise este Codigo de Ranking!';
  }else {
    $response->resultado = 'ERR';
    $response->mensaje = 'Error inesperado!';
  }

  echo json_encode($response);
?>
