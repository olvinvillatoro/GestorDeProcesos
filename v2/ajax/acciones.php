<?php
switch ($_GET["accion"]) {
	case '1'://se crea un nuevo proceso en el archivo txt
		//se crean valores random para cada dato del proceso separado por / y termina en ;
		$datos = rand(1000,3000)."/". 0 ."/".rand(1,3)."/".rand(40,99)."/".rand(20,99)."/".rand(3,5).";";
		//se abre el archivo
		$archivo = fopen("procesos.txt","a") or die("problemas al crear");
		//se escriben los datos en el archivo
		fwrite($archivo, $datos);
		//se cierra el archivo
		fclose($archivo);
	break;
	case '2'://leer archivo txt
		//se lee el archivo
		$leerArchivo = fopen("procesos.txt","r") or die("problemas al leer");

		while (!feof($leerArchivo)) {
			$obtener = fgets($leerArchivo);//se guardan los datos del txt en una variable
			$slinea = nl2br($obtener);//esto es para reconocer los saltos de linea(creo que no se necesita pero igual lo deje xD)
			$procesos = explode(";", $slinea);//se separan los daton en cada ; y se guardan en un arreglo

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
		//se devuelve el arreglo asociativo en formato json para su mejor manipulacion en controlador.js (javascript)
		echo json_encode($instrucciones);
		//se cierra el archivo
		fclose($leerArchivo);

break;
case '3'://este lo cree en caso de necsitar borrar todos los datos de un archivo txt

		$archivo = fopen("procesos.txt","w") or die("problemas al borrar");

		fwrite($archivo, "");

		fclose($archivo);

	break;
	case 'CrearBCP'://para rear BAnco de Control de Proceso
		$data = file_get_contents("../Data/ProcesosJson/Procesos.json");
		$json_arr = json_decode($data, true);
		$Indices = Count($json_arr);
		$codigo = $Indices + 1;
		$ProcesosRang = rand(1,10);
		$json_arr[] = array('NombreProceso'=>'BCP_'.$codigo.'','CantidadDeProcesos'=>''.$ProcesosRang.'');
		file_put_contents("../Data/ProcesosJson/Procesos.json",json_encode($json_arr));
		for($i=0; $i<$ProcesosRang;$i++){
			$instrucciones = rand(40,99);
			$datos = rand(1000,3000)."/". 0 ."/".rand(1,3)."/".$instrucciones."/".($instrucciones-25)."/".rand(3,5).";";
			$archivo = fopen("../Data/ProcesosTxt/BCP_".$codigo.".txt","a") or die("problemas al crear");
			fwrite($archivo, $datos);
			fclose($archivo);
		}
	break;
	case 'ListarBCP'://carga el select de los BCP
		include("../class/Proceso.php");
		echo Proceso::RetornarBCP();
	break;
	case 'ListarProcesosDeUnBCP'://carga la tabla con nombre y numero de procesos de un BCP
		include("../class/Proceso.php");
		echo Proceso::SeleccionOneBCP($_POST['NombreProceso']);
	break;
}
	
?>