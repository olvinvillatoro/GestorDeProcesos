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
                console.log(proceso.procesos);
                // prueba de como llamar la funcion para separar el proceso en instrucciones
               const instr = separarInstrucciones(proceso.procesos[0]);

               console.log('final ' +instr.instruccion);
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