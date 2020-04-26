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
            for($i=0;$i<count($DataBCP);$i++){
                $dato[0]=$DataBCP[$NombreProceso];
                //$dato[0]=$Proceso;
            }
            //$DataProcesos = json_decode(file_get_contents("../Data/ProcesosTxt/.$Proceso.text"),true);
            //return json_encode($Proceso);
            //return json_encode($dato);
            return json_encode("../Data/ProcesosTxt/BCP_2.txt");
        }
	}
?>