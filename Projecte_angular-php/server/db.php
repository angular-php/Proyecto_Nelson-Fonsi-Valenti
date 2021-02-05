<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Content-Type: text/html; charset=UTF-8');

  class BasedeDatos
  {
    //Datos BBDD
    public const servidor = "localhost";
    public const usuariobd = "root";
    public const password = "";
    public const nombrebd = "angularphp";

    //Conexion con la BBDD
    public static function Conectar()
    {
      try {
        $conexion = new PDO("mysql:host=" . self::servidor . ";dbname="
          . self::nombrebd . ";charset-utf8", self::usuariobd, self::password);

        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexion;
      } catch (PDOException $e) {
        return "Fallo conexion BD " . $e->getMessage();
      }
    }
  }

?>
