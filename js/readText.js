const input = document.querySelector('.proceso');
input.addEventListener
    ('change',
        (e)=>{
            const reader = new FileReader();
            reader.onload = ()=>{
                const instruccion = reader.result.split('/');
                console.log(instruccion);
                }
        reader.readAsText(input.files[0])
        },
    false
    );