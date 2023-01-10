<?php
    require_once "Config/Config.php";
    // !empty: si existe (condicion)
    // Guardamos la condicion en la variable ruta
    // echo: imprimir
    $ruta = !empty($_GET['url']) ? $_GET['url'] : "Home/index";
    $array = explode("/", $ruta);
    $controller = $array[0];
    $metodo = "index";
    $parametro = "";
    if (!empty($array[1])) {
        if (!empty($array[1] != "")) {
            $metodo = $array[1];
        }
    }
    if (!empty($array[2])) {
        if (!empty($array[2] != "")) {
            for ($i=2; $i < count($array); $i++) { 
                $parametro .= $array[$i]. ",";
            }
            $parametro = trim($parametro, ","); // Quitar un caracter
        }
    }
    require_once "Config/App/autoload.php";
    // Almacenar la ruta en la carpeta controllers
    $dirControllers = "Controllers/".$controller.".php";
    // Si existe esta carpeta
    if (file_exists($dirControllers)) {
        require_once $dirControllers;
        $controller = new $controller();
        // Si existe el metodo
        if(method_exists($controller, $metodo)){
            $controller->$metodo($parametro);
        }else{
            echo "No existe el metodo";
        }
    }else{
        echo "No existe el controlador";
    }
?>