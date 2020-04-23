const input = document.querySelector('.proceso');
//todos los procesos dentro del archivo .txt cargado
const proceso={
    'procesos':[],
};
//proceso individual, con sus instrucciones divididas dentro de un arreglo
const instrucciones={
    'proceso':'',
    'instruccion':[]
}

input.addEventListener
    ('change',
        (e)=>{
            const reader = new FileReader();
            reader.onload = ()=>{
                proceso.procesos = reader.result.split(';');
                //console.log(proceso.procesos);

                //llamar la funcion para separar el proceso en instrucciones y se crea la tabla de procesos
                for (var i = 0; i < proceso.procesos.length; i++) {
                   
                     document.getElementById("procesos").innerHTML += "<tr id='proceso"+i+"'></tr>";

                     const instr = separarInstrucciones(proceso.procesos[i]);
                     for (var k = 0; k < instr.instruccion.length; k++) {

                             var p = "proceso"+i+"";
                            document.getElementById(""+p+"").innerHTML += "<td>"+instr.instruccion[k]+"</td>";

                        }
                     //console.log('final' +instr.instruccion);
                }
               //
              
                }
        reader.readAsText(input.files[0])
        },
    false
    );

    //funcion que separa las cada instruccion individualmente y asigna todo el proceso como id/descripcion

   const separarInstrucciones =(proceso)=>{
         
             instrucciones.instruccion = proceso.split('/');
             instrucciones.proceso=proceso;
             console.log(instrucciones);
        
         return instrucciones;
   }
//sta funcion crea un nuevo proceso en la lista de procesos
function crearProceso () {
    if (proceso.procesos.length <= 9) {
        document.getElementById("procesos").innerHTML = "";
        console.clear();

        var prcs =  Math.round( Math.random() * (3000-1000)+1000)+"/"+//id
                    Math.round( Math.random() * 5)+"/"+//estado
                    Math.round( Math.random() * 3)+"/"+//prioridad
                    Math.round( Math.random() * (100-50))+"/"+//instrucciones
                    Math.round( Math.random() * (50-10))+"/"+//bloqueo
                    Math.round( Math.random() * (5-2));//evento

        proceso.procesos.push(prcs);   
                 
        for (var i = 0; i < proceso.procesos.length; i++) {
                       
                 document.getElementById("procesos").innerHTML += "<tr id='proceso"+i+"'></tr>";

                 const instr = separarInstrucciones(proceso.procesos[i]);

                 for (var k = 0; k < instr.instruccion.length; k++) {

                         var p = "proceso"+i+"";
                        document.getElementById(""+p+"").innerHTML += "<td>"+instr.instruccion[k]+"</td>";

                }
        }
    }else{
        alert("solo se permiten 10 procesos");
    }
}