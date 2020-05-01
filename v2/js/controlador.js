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
	var ContadorP1 = 0, ContadorP2 = 0,ContadorP3 = 0;contadorSegmentos = 1;
	var ArrayContadorP1= [],ArrayContadorP2=[],ArrayContadorP3=[];ArrayContadorSegmenetos=[];  
	for(var r=0;r<resultado.length;r++){
		if(resultado[r].prioridad=="1"){
			ArrayContadorP1[ContadorP1] = r;
			//console.log(r);
			ContadorP1=ContadorP1+1;
		}else{
			if(resultado[r].prioridad=="2"){
			ArrayContadorP2[ContadorP2] = r;
				ContadorP2=ContadorP2+1;
			}
			if(resultado[r].prioridad=="3"){
			ArrayContadorP3[ContadorP3] = r;
				ContadorP3=ContadorP3+1;
			}
		}
	}

	var Prioridad_1 = "";
	var Prioridad_2 = "";
	var avanzarP2 = "";
	var avanzarP3 = "";
	var nCiclos = 0;
	var nSegmentos = 0;
	var nSeg = 0;
	var eS = 0;
	var hDD = 0;
	var SSsegmento=0;
	var SSCiclos=0;
	var cant = $("#ciclos").val();//valor de la caja de texto (cantidad de ciclos)

	(function ciclo(i) {//esta hace que los ciclos sea lentos para poder ver los cambios
	  setTimeout(function() {


	   if (nCiclos == 5) {//contador de ciclos y segmentos
	  		nCiclos = 1;
	  		nSegmentos = parseInt(nSegmentos)+1;
	  	}else{
	  		 nCiclos = parseInt(nCiclos)+1; 
	  	}
	  	
	  	 //muestra los ciclos en pantalla 
		$("#mostrarCiclos").html("Ciclo:"+parseInt(nCiclos)+"  "+"Segmento:"+parseInt(nSegmentos));

	    for (var j = 0; j < resultado.length; j++) {
			

	    	if (resultado[j].estado==2) {//este if simula la  ejecucion de las instrucciones
				//se restan 5 instrucciones por ciclo al total de instrucciones de cada proceso;
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
				
				//console.log(eS+" "+hDD)
			}
			/*este if permite que los procesos con prioridad 2 vancen al estado listo cuando los procesos con
			prioridad 1 estan en estado ejecutandose*/
			if((resultado[j].prioridad == 1 || resultado[j].prioridad == "1") && (resultado[j].estado == 2 ||resultado[j].estado == "2")){
					var CCP2 = 1;
					for(var m =0;m<ContadorP1;m++ ){
						if(resultado[ArrayContadorP1[m]].estado==2||resultado[ArrayContadorP1[m]].estado=="2"){
							if(ContadorP1==CCP2){
								avanzarP2 = "listo";
							}
							CCP2= CCP2+1;
						}
					}
				}
			/*este if permite que los procesos con prioridad 3 vancen al estado listo cuando los procesos con
			prioridad 2 estan en estado ejecutandose*/
			if((resultado[j].prioridad == 2 || resultado[j].prioridad == "2") && (resultado[j].estado == 2 ||resultado[j].estado == "2")){
				var CCP3 = 1;
				for(var m =0;m<ContadorP2;m++ ){
					if(resultado[ArrayContadorP2[m]].estado==2||resultado[ArrayContadorP2[m]].estado=="2"){
						if(ContadorP2==CCP3){
							avanzarP3 = "listo";
						}
						CCP3= CCP3+1;
					}
				}
			}
	   
			/*este if comprueba que todos los procesos de prioridad 1 estan terminado para comenzar a trabajar 
			en los procesos de prioridad 2*/
				if((resultado[j].prioridad == 1 || resultado[j].prioridad == "1") && (resultado[j].estado == 4 ||resultado[j].estado == "4")){
					var CompararContP1 = 1;
					for(var m =0;m<ContadorP1;m++ ){
						if(resultado[ArrayContadorP1[m]].estado==4||resultado[ArrayContadorP1[m]].estado=="4"){
							if(ContadorP1==CompararContP1){
								Prioridad_1 = "YA";
								avanzarP2 = "";
							}
							CompararContP1= CompararContP1+1;
						}
					}
				}
				/*este if comprueba que todos los procesos de prioridad 2 estan terminado para comenzar a trabajar 
				en los procesos de prioridad 3*/
				if((resultado[j].prioridad == 2 || resultado[j].prioridad == "2") && (resultado[j].estado == 4 ||resultado[j].estado == "4")){
					var CompararContP2 = 1;
					for(var m =0;m<ContadorP2;m++ ){
						if(resultado[ArrayContadorP2[m]].estado==4||resultado[ArrayContadorP2[m]].estado=="4"){
							if(ContadorP2==CompararContP2){
								Prioridad_2 = "YA";
								avanzarP3 = "";
							}
							CompararContP2= CompararContP2+1;
						}
					}
				}
				/*este if comprueba que todos los procesos de prioridad 3 estan terminados para para mostrar una 
				notificacion de que todos los procesos se completaron*/
				if((resultado[j].prioridad == 1 || resultado[j].prioridad == "1") && (resultado[j].estado == 4 ||resultado[j].estado == "4")){
					var CompararContP3 = 1;
					for(var m =0;m<ContadorP3;m++ ){
						if(resultado[ArrayContadorP3[m]].estado==4||resultado[ArrayContadorP3[m]].estado=="4"){
							if(ContadorP3==CompararContP3){
								//alert("Fin De Todos Los Procesos");
								if(SSsegmento==0 && SSCiclos==0){
									SSsegmento = nSegmentos;
									SSCiclos = nCiclos;
								$("#ProcesoCompleto").html(`<h5 style=" text-align: center; color: white; font-size: x-large; ">Fin De Todos Los Procesos</h5>
															<div>
																<h5 style=" font-size: large; color: white; text-align: center;">
																	Ciclos requeridos: <span>${(nSegmentos)*5+nCiclos}</span>
																</h5>
															</div>`);
								}
							}
							CompararContP3= CompararContP3+1;
						}
					}
				}
				/*se encarga de que el estado se 4 como maximo y cambia los estados*/
				if (resultado[j].estado<=3 && nCiclos==5) {
					if (resultado[j].estado==2) {//cambia el estado de un proceso en ejecucion (bloqueado o terminado)

						nSeg = parseInt(nSeg)+1;//contador de segmentos

						if (resultado[j].cantidad < 1){//si cantidad de instrcciones es cero = proceso terminado (estado = 4)
							resultado[j].estado = parseInt(resultado[j].estado)+2;
						}else{
							//bloqueo por esperar un evento E/S o HDD
							if ((resultado[j].cantidad == resultado[j].bloqueo) && resultado[j].evento != 4) {
								resultado[j].estado = parseInt(resultado[j].estado)+1;
							}else{
							/*este if reduce la prioridad de un proceso si se ejecuta durante 3 segmentos seguidos*/
								if (nSeg == 3) {

									resultado[j].estado = parseInt(resultado[j].estado)-1;
									resultado[j].prioridad = parseInt(resultado[j].prioridad)+1;
									
									nSeg = 1;
									Prioridad_1 = "reducida";
									Prioridad_2 = "reducida"
									avanzarP2 = "";
									avanzarP3 = "";
								}
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

							if(resultado[j].prioridad == 1 && resultado[j].estado < 4){
								resultado[j].estado = parseInt(resultado[j].estado)+1;
							}

							if((Prioridad_1!="")){
								if ( (resultado[j].prioridad == 2||resultado[j].prioridad == "2")) {
									resultado[j].estado = parseInt(resultado[j].estado)+1;
									resultado[j].prioridad = parseInt(resultado[j].prioridad)-1;	
								}
							}
							if((Prioridad_2!="")){
								if ( (resultado[j].prioridad == 3||resultado[j].prioridad == "3")) {
									resultado[j].estado = parseInt(resultado[j].estado)+1;	
									resultado[j].prioridad = parseInt(resultado[j].prioridad)-1;
								}
							}

							if (avanzarP2 == "listo") {
								if ( (resultado[j].prioridad == 2||resultado[j].prioridad == "2")) {
										resultado[j].estado = 1;	
									}
							}
							if (avanzarP3 == "listo") {
								if ( (resultado[j].prioridad == 3||resultado[j].prioridad == "3")) {
										resultado[j].estado = 1;	
									}
							}
						}
					}
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
	  }, 200)//duracion de cada ciclo en milisegundos 1000ms = 1s
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
			$("#Procesos").html(`<option value="Null">Seleccionar BCP</option>`);
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