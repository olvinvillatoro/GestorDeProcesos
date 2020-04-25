function cargarProcesos(){

	$.ajax({
		url: "ajax/acciones.php?accion=2",//aqui se manda accion=2 a acciones php mediante GET
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
				nuevos();//esta llamada solo llena la columna de procesos nuevos a la vez que se llena la tabla

			},
		error:function(){
			alert("error");
		}
	});

}
//esta funcion va cambiando el estado de los procesos y actualizando los datos de las tablas
function ciclos(resultado){

	var cant = $("#ciclos").val();//valor de la caja de texto (cantidad de ciclos)

	(function ciclo(i) {//esta hace que los ciclos sea lentos para poder ver los cambios
	  setTimeout(function() {
	    
	    for (var j = 0; j < resultado.length; j++) {//aqui se cambian los estados
	    	/*en este if se genera un valor de 0 a 100 y si es mayor que 50
	    	el estado cambia delo contrario se mantiene en el mismo estado*/
			if (Math.floor(Math.random() * 101) > 50) {
				resultado[j].estado = parseInt(resultado[j].estado)+1;
			}

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
	  }, 3000)
	})(cant); 
}                  

//al presionar el boton "Nuevo" se llama esta funcion para agregar un procesos mas al archivo txt
function crearProceso(){

	$.ajax({
		url: "ajax/acciones.php?accion=1",//accion=1 se evia mediante GET a acciones.php 
	
		success:function(resultado){

				cargarProcesos(); //se recarga la tabla principal para agregar el nuevo proceso

			},
		error:function(){
			alert("error");
		}
	});
}
//funcion que carga los procesos con estado = 0 al presionar el boton "cargar"
function nuevos(){

	$.ajax({
		url: "ajax/acciones.php?accion=2",
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
		error:function(resultado){
			console.log(resultado);
		}
	});
}

$(document).ready(function(){
	$.ajax({
		url: "ajax/acciones.php?accion=ListarBCP",
		dataType:"json",
        data:parametros,
        type : "POST",
		success:function(resultado){
			console.log(resultado);
			},
		error:function(resultado){
			console.log(resultado);
		}
	});
	document.getElementById("Procesos").innerHTML = "";
})