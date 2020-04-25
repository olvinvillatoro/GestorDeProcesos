<?php
    class Proceso{
		private $NombreProceso;
		public function __construct(
			$NombreProceso
		){
			$this->NombreProceso=$NombreProceso;
		}
		public static function RetornarBCP(){
			$archivos = json_decode(file_get_contents("../Data/ProcesosJson/Procesos.json"),true);
			$dato = array();
			$indice=0;
				for($i=0;$i<count($archivo);$i++){
					$dato[$indice]=$archivo[$i];
					$indice = $indice +1;
				}
			return $indice=0;
		}
	}
?>