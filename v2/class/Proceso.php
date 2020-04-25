<?php
    class Proceso{
		private $NombreProceso;
		public function __construct(
			$NombreProceso
		){
			$this->NombreProceso=$NombreProceso;
		}
		public static function RetornarBCP(){
            return file_get_contents("../Data/ProcesosJson/Procesos.json");
		}
	}
?>