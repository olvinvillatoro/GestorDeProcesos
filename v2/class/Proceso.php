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
        public static function SeleccionOneBCP($NombreProceso){
            $DataBCP = json_decode(file_get_contents("../Data/ProcesosJson/Procesos.json"),true);
            $aray = array();
            $Proceso = $DataBCP[$NombreProceso]['NombreProceso'];
            $leerArchivo = fopen("../Data/ProcesosTxt/$Proceso.txt","r") or die("problemas al leer");
		while (!feof($leerArchivo)) {
			$obtener = fgets($leerArchivo);
			$slinea = nl2br($obtener);
			$procesos = explode(";", $slinea);

			for ($i=0; $i < count($procesos)-1; $i++) { 
				//cada elemento del arreglo de procesos se separa en cada / y se agrega a cada elemento de "list" respectivamente
				 list($id, $estado, $prioridad, $cant_instr, $bloqueo, $evento) = explode("/", $procesos[$i]);
				 //se crea un arreglo asociativo con los elementos de "list"
				$instrucciones[$i] =  [
                    "id" => $id,
                    "estado" => $estado,
                    "prioridad" => $prioridad,
                    "cantidad" =>  $cant_instr,
                    "bloqueo" => $bloqueo,
                    "evento" => $evento
                    ];
			}
        }
        fclose($leerArchivo);
		return json_encode($instrucciones);		
        }
	}
?>