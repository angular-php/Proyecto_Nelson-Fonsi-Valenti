<?php

  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

  $json = file_get_contents('php://input');//Recibe el json de angular
  $params = json_decode($json);

  require("db.php");
  session_start();

  $con = retornarConexion();

  //Comprovacion Conexion BBDD
  // if (!$con) {
  //   die("No se ha podido realizar la corrección ERROR:" . mysqli_connect_error() . "<br>");
  // }else {
  //   mysqli_set_charset ($con, "utf8");
  //   echo "Se ha conectado a la base de datos" . "<br>";
  // }

  class Result {}
  $response = new Result();

  $instruccion = "select count(*) as 'rows' from alumnos where nickname = '$params->nickname'";
  $res = mysqli_query($con, $instruccion);
  $datos = mysqli_fetch_assoc($res);


  $instruccion2 = "select count(*) as 'rows2' from profesores where nickname = '$params->nickname'";
  $res2 = mysqli_query($con, $instruccion2);
  $datos2 = mysqli_fetch_assoc($res2);

  if ($datos['rows'] == 0 && $datos2['rows2'] == 0) {
    //QUERY Insert BBDD
    mysqli_query($con,
    "insert into alumnos(nickname, password, email, firstname, lastname)
    values ('$params->nickname','$params->password','$params->email','$params->firstname','$params->lastname')"
    );

    // GENERA LOS DATOS DE RESPUESTA

    $response->resultado = 'OK';
    $response->mensaje = 'Usuario registrado OK';

  }else if($datos['rows'] != 0){
    // GENERA LOS DATOS DE RESPUESTA
    $response->resultado = 'KO';
    $response->mensaje = 'Alumno ya registrado';
  }else {
    // GENERA LOS DATOS DE RESPUESTA
    $response->resultado = 'KO';
    $response->mensaje = 'Este nickname ya existe';
  }

  header('Content-Type: application/json');
  echo json_encode($response); // MUESTRA EL JSON GENERADO

?>
