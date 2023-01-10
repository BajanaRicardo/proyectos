<?php
class Usuarios extends Controller
{
    public function __construct()
    {
        session_start();
        parent::__construct();
    }

    public function index()
    {
        $model = $this->cargarModel(); // importante
        $data['cajas'] = $this->$model->getCajas();
        $this->views->getView($this, "index", $data);
    }

    // Listamos los usuarios almacenados en la base de datos
    public function listar()
    {
        $model = $this->cargarModel(); // importante
        $data = $this->$model->getUsuarios(); // Guardamos los usuarios en $data
        for ($i=0; $i < count($data); $i++) { 
            // Validar estado
            if ($data[$i]['estado'] == 1) {
                $data[$i]['estado'] = '<span class="badge badge-success">Activo</span>';
            }else{
                $data[$i]['estado'] = '<span class="badge badge-danger">Inactivo</span>';
            }
            // Creamos los botones de editar y eliminar
            $data[$i]['acciones'] = '<div>
            <button class="btn btn-primary" type="button">Editar</button>
            <button class="btn btn-danger" type="button">Eliminar</button>
            <div/>';
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE); // Convertimos el $data en JSON
        die();
    }

    // Verificamos si el usuario y clave esta vacio
    public function validar()
    {
        $model = $this->cargarModel();
        if (empty($_POST['usuario']) || empty($_POST['clave'])) {
            $msg = "Los campos estan vacios";
        }else{ // Si no esta vacio, enviar los datos del usuario y clave a getUsuario
            $usuario = $_POST['usuario'];
            $clave = $_POST['clave'];
            $data = $this->$model->getUsuario($usuario, $clave);
            if ($data) {
                $_SESSION['id_usuario'] = $data['id'];
                $_SESSION['usuario'] = $data['usuario'];
                $_SESSION['nombre'] = $data['nombre'];
                $msg = "ok";
            }else{
                $msg = "Usuario o contraseña incorrecta";
            }
        }
        echo json_encode($msg, JSON_UNESCAPED_UNICODE);
        die();
    }

    public function registrar()
    {
        $model = $this->cargarModel(); // importante
        // Recibimos el array con el $_POST y lo guardamos en sus variables
        $usuario = $_POST['usuario'];
        $nombre = $_POST['nombre'];
        $clave = $_POST['clave'];
        $confirmar = $_POST['confirmar'];
        $caja = $_POST['caja'];
        if (empty($usuario) || empty($nombre) || empty($clave) || empty($caja)) {
            $msg = "Todos los campos son obligatorios";
        }else if ($clave != $confirmar) {
            $msg = "Las contraseñas no coinciden";
        }else {
            $data = $this->$model->registrarUsuario($usuario, $nombre, $clave, $caja);
            if ($data == "ok") {
                $msg = "si";
            }else {
                $msg = "Error al registrar el usuario";
            }
        }
        echo json_encode($msg, JSON_UNESCAPED_UNICODE);
        die();
    }
}
?>
