<?php
// Conectar Vista con el Controlador
class Views{
    // Creamos una funcion para mostrar la vista
    public function getView($controlador, $vista, $data="")
    {
        // Obtener el nombre de la clase (Carpeta Controllers)
        $controlador = get_class($controlador);
        if ($controlador == "Home") {
            $vista = "Views/".$vista.".php";
        }else{
            $vista = "Views/".$controlador."/".$vista.".php";
        }
        require $vista;
    }
}

?>