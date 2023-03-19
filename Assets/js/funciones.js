let tblUsuarios;
document.addEventListener("DOMContentLoaded", function() {
    tblUsuarios = $('#tblUsuarios').DataTable( {
        ajax: {
            url: base_url + "Usuarios/listar", // Usamos el metodo listar() de Usuario.php
            dataSrc: ''
        },
        columns: [
            {
                'data' : 'id'
            },
            {
                'data' : 'usuario'
            },
            {
                'data' : 'nombre'
            },
            {
                'data' : 'caja'
            },
            {
                'data' : 'estado'
            },
            {
                'data' : 'acciones'
            }     
        ]
    });
})

// Utilizamos onclick="frmLogin(event);
function frmLogin(e) {
    e.preventDefault();
    const usuario = document.getElementById("usuario");
    const clave = document.getElementById("clave");
    // Validar si el usuario y clave esta vacio
    if (usuario.value == "") {
        clave.classList.remove("is-invalid");
        usuario.classList.add("is-invalid");
        usuario.focus();
    }else if(clave.value == ""){
        usuario.classList.remove("is-invalid");
        clave.classList.add("is-invalid");
        clave.focus();
    }else{ // Si no esta vacio
        const url = base_url + "Usuarios/validar";
        const frm = document.getElementById("frmLogin");
        const http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.send(new FormData(frm));
        // Manejo de mensajes del metodo validar() de Usuarios.php
        http.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                const res = JSON.parse(this.responseText);
                if (res == "ok") {
                    window.location = base_url + "Usuarios";
                }else{
                    document.getElementById("alerta").classList.remove("d-none");
                    document.getElementById("alerta").innerHTML = res;
                }
            }
        }
    }
}

// Evento en el boton Nuevo de Usuarios
function frmUsuario() {
    document.getElementById("title").innerHTML = "Nuevo Usuario";
    document.getElementById("btnAccion").innerHTML = "Registrar";
    document.getElementById("claves").classList.remove("d-none");// Mostrar campos de contraseñas
    document.getElementById("frmUsuario").reset();// Resetear campos
    $("#nuevo_usuario").modal("show");
    document.getElementById("id").value = "";// Importante para registrar un nuevo usuario
}
function registrarUser(e) {
    e.preventDefault();
    const usuario = document.getElementById("usuario");
    const nombre = document.getElementById("nombre");
    const clave = document.getElementById("clave");
    const confirmar= document.getElementById("confirmar");
    const caja= document.getElementById("caja");
    // Validar si todos los campos estan vacios
    if (usuario.value == "" || nombre.value == "" || caja.value == "") {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Todos los campos son obligatorios',
            showConfirmButton: false,
            timer: 3000
        })
    }else{ // Si no esta vacio
        const url = base_url + "Usuarios/registrar";
        const frm = document.getElementById("frmUsuario");
        const http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.send(new FormData(frm)); // enviamos el formulario
        // Manejo de mensajes del metodo validar() de Usuarios.php
        http.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                const res = JSON.parse(this.responseText);
                if (res == "si") {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Usuario registrado con éxito',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    // Resetear formulario
                    frm.reset();
                    // Esconder el modal
                    $("#nuevo_usuario").modal("hide");
                    tblUsuarios.ajax.reload(); // Recargar pagina
                }else if (res == "modificado") {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Usuario modificado con éxito',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    // Esconder el modal
                    $("#nuevo_usuario").modal("hide");
                    tblUsuarios.ajax.reload(); // Recargar pagina
                }else{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: res,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            }
        }
    }
}

// Evento en el boton Editar
function btnEditarUser(id) {
    document.getElementById("title").innerHTML = "Actualizar Usuario";
    document.getElementById("btnAccion").innerHTML = "Modificar";
    const url = base_url + "Usuarios/editar/"+id;
    const http = new XMLHttpRequest();
    http.open("GET", url, true); // GET: Recibimos los datos
    http.send();
    http.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            // Presentamos los datos
            document.getElementById("id").value = res.id;
            document.getElementById("usuario").value = res.usuario;
            document.getElementById("nombre").value = res.nombre;
            document.getElementById("caja").value = res.id_caja;
            document.getElementById("claves").classList.add("d-none"); // Ocultar campos de contraseñas
            $("#nuevo_usuario").modal("show");
        }
    }
}

// Evento en el boton Eliminar
// Pagina de alertas: https://sweetalert2.github.io/
function btnEliminarUser(id) {
    Swal.fire({
        title: '¿Estas seguro de eliminar?',
        text: "El usuario no se eliminara de forma permanente, solo cambiará el estado a inactivo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
            const url = base_url + "Usuarios/eliminar/"+id;
            const http = new XMLHttpRequest();
            http.open("GET", url, true); // GET: Recibimos los datos
            http.send();
            http.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    const res = JSON.parse(this.responseText);
                    if (res == "ok") {
                        Swal.fire(
                            'Mensaje!',
                            'Usuario eliminado con éxito.',
                            'success'
                        )
                        tblUsuarios.ajax.reload(); // Recargar pagina
                    } else {
                        Swal.fire(
                            'Mensaje!',
                            res,
                            'error'
                        )
                    }
                }
            }
          
        }
      })
}

// Evento en el boton Reingresar
// Pagina de alertas: https://sweetalert2.github.io/
function btnReingresarUser(id) {
    Swal.fire({
        title: '¿Estas seguro de reingresar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
            const url = base_url + "Usuarios/reingresar/"+id;
            const http = new XMLHttpRequest();
            http.open("GET", url, true); // GET: Recibimos los datos
            http.send();
            http.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    const res = JSON.parse(this.responseText);
                    if (res == "ok") {
                        Swal.fire(
                            'Mensaje!',
                            'Usuario reingresado con éxito.',
                            'success'
                        )
                        tblUsuarios.ajax.reload(); // Recargar pagina
                    } else {
                        Swal.fire(
                            'Mensaje!',
                            res,
                            'error'
                        )
                    }
                }
            }
          
        }
      })
}
