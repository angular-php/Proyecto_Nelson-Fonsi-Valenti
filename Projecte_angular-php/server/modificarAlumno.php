<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Content-Type: application/json');

  $json = file_get_contents('php://input');

  $params = json_decode($json);


  require("db.php");
  $con=retornarConexion();

  mysqli_query($con,"update alumnos set nickname='$params->nickname',
                                        password='$params->password',
                                        firstname='$params->firstname',
                                        lastname='$params->lastname',
                                        email='$params->email'
                                        where idusu=$params->id");


  class Result {}

  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'Datos guardados';

  echo json_encode($response);
?>
