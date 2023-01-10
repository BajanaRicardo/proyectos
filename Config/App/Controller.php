<?php
// Conexion del controlador con el modelo
class Controller{
    public $views;
    
    public function __construct()
    {
        $this->views = new Views();
        $this->cargarModel();
    }
    public function cargarModel()
    {
        
        // Obtener el nombre de la clase de cada controlador (Carpeta Controllers)
        $model = get_class($this)."Model";
        $ruta = "Models/".$model.".php"; // Especificar la ruta del modelo
        if (file_exists($ruta)) { // Si existe el archivo
            require_once $ruta;
            $this->$model = new $model(); // Instancia
        }
        return $model;
    }
}

?>