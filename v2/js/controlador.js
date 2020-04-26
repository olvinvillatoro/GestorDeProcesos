function cargarProcesos(){
	var parametros = 'NombreProceso='+$("#Procesos").val();

	$.ajax({
		url: "ajax/acciones.php?accion=ListarProcesosDeUnBCP",//aqui se manda accion=2 a acciones php mediante GET
		data: parametros,
		method: "POST",
		dataType: 'json',
		success:function(resultado){
			//aqui vacia la tabla 
			$("#procesos").html("");
			//aqui se imprimen los datos de los procesos en la tabla
				for(i in resultado) {
						if (i < 10) { // el valor 10 es para no permitir mas de 10 procesos en la tabla (creo que esto va a tener que cambiar por lo delos multiples archivos)
						$("#procesos").append('<tr><td>'+
							resultado[i].id+'</td><td>'+
							resultado[i].estado+'</td><td>'+
							resultado[i].prioridad+'</td><td>'+
							resultado[i].cantidad+'</td><td>'+
							resultado[i].bloqueo+'</td><td>'+
							resultado[i].evento+'</td></tr>');
						}else{
							alert("solo se permiten 10 procesos");
						}		
					
				}

				ciclos(resultado);
				nuevos($("#Procesos").val());//esta llamada solo llena la columna de procesos nuevos a la vez que se llena la tabla

			},
		error:function(){
			alert("error");
		}
	});

}
//esta funcion va cambiando el estado de los procesos y actualizando los datos de las tablas
function ciclos(resultado){
	var nCiclos = 0;
	var nSegmentos = 1;
	var eS = 0;
	var hDD = 0;
	var cant = $("#ciclos").val();//valor de la caja de texto (cantidad de ciclos)

	(function ciclo(i) {//esta hace que los ciclos sea lentos para poder ver los cambios
	  setTimeout(function() {


	   if (nCiclos == 5) {//contador de ciclos y segmentos
	  		nCiclos = 1;
	  		nSegmentos = parseInt(nSegmentos)+1;
	  	}else{
	  		 nCiclos = parseInt(nCiclos)+1; 
	  	}

		$("#mostrarCiclos").html("Ciclo:"+parseInt(nCiclos)+"  "+"Segmento:"+parseInt(nSegmentos)); //muestra los ciclos en pantalla 

	    //console.log("Ciclo:"+nCiclos);
	    //console.log("segmento:"+nSegmentos);
	    for (var j = 0; j < resultado.length; j++) {//aqui se cambian los estados
	    	
	    	if (resultado[j].estado==2) {//este if simula la  ejecucion de las instrucciones
				//se restan 1 instrucciones por ciclo al total de instrucciones de cada proceso;
				resultado[j].cantidad = parseInt(resultado[j].cantidad)-1;
				if (resultado[j].cantidad<1) {
					resultado[j].cantidad = 0;//quedan cero instrucciones del total
				}
			}

			if (resultado[j].estado==3) {//conteo de ciclos mientras el proceso esta boqueado
				if (eS < 13) {//para evento E/S el proceso se bloquea durante 13 ciclos
					eS = parseInt(eS)+1;
				}
				if (hDD < 27) {//para evento HDD el proceso se bloquea durante 27 ciclos
					hDD = parseInt(hDD)+1;
				}
				
				console.log(eS+" "+hDD)
			}

	    	/*en este if se genera un valor de 0 a 100 y si es mayor que 50 y han pasado 5 ciclos
	    	el estado cambia delo contrario se mantiene en el mismo estado*/
			//if (Math.floor(Math.random() * 101) > 50) {
				if (resultado[j].estado<=3 && nCiclos==5) {//se encarga de que el estado se 4 como maximo

					if (resultado[j].estado==2) {//cambia el estado de un proceso en ejecucion (bloqueado o terminado)
						if (resultado[j].cantidad < 1){//si cantidad de instrcciones es cero = proceso terminado (estado = 4)
							resultado[j].estado = parseInt(resultado[j].estado)+2;
						}else{//probabilidad de que se bloquee por esperar un evento
							if (resultado[j].cantidad == resultado[j].bloqueo && resultado[j].evento != 4) {
							resultado[j].estado = parseInt(resultado[j].estado)+1;
							}
						}
					}else{
						if (resultado[j].estado==3) {//eventos para desbloquear procesos
							if (resultado[j].evento == 3 && eS == 13) {//evento E/S y trancurridos 13 ciclos
								resultado[j].estado = parseInt(resultado[j].estado)-1;
								es = 0;//reinicia el contador de ciclos de bloqueo de E/S
							}
							if (resultado[j].evento == 5 && hDD == 27) {//evento HDD y trancurridos 27 ciclos
								resultado[j].estado = parseInt(resultado[j].estado)-1;
								hDD = 0;//reinicia el contador de ciclos de bloqueo de HDD
							}

						}else{//prioridades para cambiar de estado

							if (Math.floor(Math.random() * 101) > 50) {
								resultado[j].estado = parseInt(resultado[j].estado)+1;	
							} 
							
						}
					}
				}

	
		//}
		}


		$("#procesos").html("");//se vacia la tabla principal 

			for(k in resultado) {//se actualizan los estados de la tabla principal
					
				$("#procesos").append('<tr><td>'+
					resultado[k].id+'</td><td>'+
					resultado[k].estado+'</td><td>'+
					resultado[k].prioridad+'</td><td>'+
					resultado[k].cantidad+'</td><td>'+
					resultado[k].bloqueo+'</td><td>'+
					resultado[k].evento+'</td></tr>');

				//estos llamasdos a funciones actualizan los estados de las tablas pequeñas
				nuevo(resultado);
				listo(resultado);					
				ejecutandose(resultado);
				bloqueado(resultado);
				terminado(resultado);
			}
			              
	    if (--i) ciclo(i);   
	  }, 200)
	})(cant); 
}                  


//funcion que carga los procesos con estado = 0
function nuevos(nombre){
	var datos = 'NombreProceso='+nombre;
	$.ajax({
		url: "ajax/acciones.php?accion=ListarProcesosDeUnBCP",
		data: datos,
		method: "POST",
		dataType: 'json',
		success:function(resultado){
				$("#procesoNuevo").html("");
					for(i in resultado) {
							if (resultado[i].estado == 0) {
							$("#procesoNuevo").append('<tr><td>'+
								resultado[i].id+'</td></tr>');
							}					
					}

				},
		error:function(){
			alert("error");
		}
	});
}


//las siguientes funciones clasifican los procesos por estados en las tablas pequeñas
//estas funciones comienzan a llamarse despues del primer ciclo
function nuevo(res){
	
	$("#procesoNuevo").html(""); //vacia la tabla

		for(i in res) {//actualiza los datos de la tabla (procesos con estado = 0)
				if (res[i].estado == 0) {
				$("#procesoNuevo").append('<tr><td>'+//imprime los nuevos datos en la tabla
					res[i].id+'</td></tr>');
				}					
		}
}


function listo(res){
	

	$("#procesoListo").html("");

		for(i in res) {
				if (res[i].estado == 1) {
				$("#procesoListo").append('<tr><td>'+
					res[i].id+'</td></tr>');
				}		
			
		}

}


function ejecutandose(res){

	$("#procesoEjecucion").html("");

		for(i in res) {
				if (res[i].estado == 2) {
				$("#procesoEjecucion").append('<tr><td>'+
					res[i].id+'</td></tr>');
				}			
		}	
}


function bloqueado(res){
	
	$("#procesoBloqueado").html("");

		for(i in res) {
				if (res[i].estado == 3) {
				$("#procesoBloqueado").append('<tr><td>'+
					res[i].id+'</td></tr>');
				}					
		}	
}


function terminado(res){
	
	$("#procesoTerminado").html("");

		for(i in res) {
				if (res[i].estado == 4) {
				$("#procesoTerminado").append('<tr><td>'+
					res[i].id+'</td></tr>');
				}					
		}
}
function crearBCP(){
	$.ajax({
		url: "ajax/acciones.php?accion=CrearBCP",
		dataType: 'json',
		success:function(resultado){
				console.log(resultado);
				},
	});
}

$(document).ready(function(){
	$.ajax({
		url: "ajax/acciones.php?accion=ListarBCP",
		dataType:"json",
        //data:parametros,
        method : "POST",
		success:function(respuesta){
			$("#Procesos").html(`<option value="Null">Seleccione uno de los BCP</option>`);
			for( var i= 0; i<respuesta.length;i++){
				$("#Procesos").append(`<option value="${i}">${respuesta[i].NombreProceso}</option>`);
				$("#BCPProcesos").append(`
				<tr>
					<td>${i}</td>
					<td>${respuesta[i].NombreProceso}</td>
					<td>${respuesta[i].CantidadDeProcesos}</td>
				</tr>
				`)
			}
		},
	});
	document.getElementById("Procesos").innerHTML = "";
})

function GenerarProcesosTablas(){
	var parametros =
	'NombreProceso='+$("#Procesos").val();
	/*$.ajax({
		url: "ajax/acciones.php?accion=ListarBCP",
		dataType:"json",
        //data:parametros,
        method : "POST",
		success:function(respuesta){
			
			$("#BCPProcesos").html(``);
			for( var i= 0; i<respuesta.length;i++){
				if(i==$("#Procesos").val()){
					$("#BCPProcesos").append(`
					<tr style=" background-color: aquamarine; ">
						<td>${i}</td>
						<td>${respuesta[i].NombreProceso}</td>
						<td>${respuesta[i].CantidadDeProcesos}</td>
					</tr>
					`)
				}else{
				$("#BCPProcesos").append(`
				<tr>
					<td>${i}</td>
					<td>${respuesta[i].NombreProceso}</td>
					<td>${respuesta[i].CantidadDeProcesos}</td>
				</tr>
				`)
				}
			}
		},
	});*/
	$.ajax({
		url: "ajax/acciones.php?accion=ListarProcesosDeUnBCP",
		dataType:"json",
        data:parametros,
        method : "POST",
		success:function(respuesta){
			$("#procesos").html("");
				for(i in respuesta) {
					if (i < 10) {
					$("#procesos").append('<tr><td>'+
						respuesta[i].id+'</td><td>'+
						respuesta[i].estado+'</td><td>'+
						respuesta[i].prioridad+'</td><td>'+
						respuesta[i].cantidad+'</td><td>'+
						respuesta[i].bloqueo+'</td><td>'+
						respuesta[i].evento+'</td></tr>');
					}else{
						alert("solo se permiten 10 procesos");
					}
				}
			},
	});
}