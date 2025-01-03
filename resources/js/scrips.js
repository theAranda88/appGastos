const form = document.getElementById("formulario");
        form.addEventListener("submit", function(event){ // al detectar este evento realiza la porsion de codigo que se le instrulla enseguida
            event.preventDefault();
            if(form.monto.value > 0){
                let formularioFormData = new FormData(form);
                let objTransformado = convertirFormDataAObjetoDeTransaccion(formularioFormData);
                saveObj(objTransformado)
                insertaFilaTabla(objTransformado);
                form.reset();
            }else{
                alert("El monto debe ser mayor a 0");
            }
        });
        //funcion para poder transformar nuestros objetos para poder subirlos al local store en tipo string
        document.addEventListener("DOMContentLoaded", function(event) {
            categoriasRow();
            let objArray = JSON.parse(localStorage.getItem("transacciones"))
            objArray.forEach(
                function(arrayElement) {
                    insertaFilaTabla(arrayElement);
                }
            )
        })
        function getNewId() {
            let lastId = localStorage.getItem('lastId') || "-1";
            let newId = JSON.parse(lastId) + 1;
            localStorage.setItem('lastId', JSON.stringify(newId));
            return newId;

        }
        function convertirFormDataAObjetoDeTransaccion (formularioFormData) {
                let tipo = formularioFormData.get("selectorApp"); 
                let descripcion = formularioFormData.get("descripcion");
                let monto = formularioFormData.get("monto");
                let categoria = formularioFormData.get("categoria");
                let id = getNewId();

                return {
                    //recibimos el valor de el objeto guardado en esta variable
                    //podemos acceder a estos datos directamente desde la variable
                    "selectorApp" : tipo,
                    "descripcion" : descripcion,
                    "monto" : monto,
                    "categoria" : categoria,
                    "id" : id
                }

        }

        // creamos una funcion que se encarga de insertar una nueva fila en la tabla
        function insertaFilaTabla(objTransformado){
            let tablaRef = document.getElementById("tabla");
            let newFilaRef = tablaRef.insertRow(-1);
            newFilaRef.setAttribute("data-id", objTransformado["id"])

            let newTipoCelda = newFilaRef.insertCell(0);
            newTipoCelda.textContent = objTransformado["selectorApp"];
            newTipoCelda = newFilaRef.insertCell(1);
            newTipoCelda.textContent = objTransformado ["descripcion"];
            newTipoCelda = newFilaRef.insertCell(2);
            newTipoCelda.textContent = objTransformado ["monto"];
            newTipoCelda = newFilaRef.insertCell(3);
            newTipoCelda.textContent = objTransformado["categoria"];

            let newDeleteCell = newFilaRef.insertCell(4);

            let btnDelete = document.createElement("button");
            newDeleteCell.appendChild(btnDelete)
            btnDelete.textContent = "Eliminar";

            btnDelete.addEventListener("click", function(event){
                let row = event.target.parentNode.parentNode;
                let id = row.getAttribute("data-id")
                console.log(id);
                row.remove();
                deleteObj(id);
            })
        }

        //Le paso como parametro el id de la transacción que quiero eliminar
        function deleteObj (id) {
            //obtengo los datos guardados(desconvieto de json a obj)
            let objArray = JSON.parse(localStorage.getItem("transacciones"));
            //busco el indice del dato
            let indexArray = objArray.findIndex(element => element.id === id);
            //eliminio el elemneto de la  posicion dada
            objArray.splice(indexArray, 1);
            //convierto de nuevo el array a json 
            let objArrayJson = JSON.stringify(objArray);
            //y lo guardo en el local store
            localStorage.setItem("transacciones", objArrayJson);
        }

        function saveObj(objTransformado){
            let myArray = JSON.parse(localStorage.getItem("transacciones")) || [];
            myArray.push(objTransformado);
            let objJSON = JSON.stringify(myArray);
            localStorage.setItem('transacciones', objJSON);
        }

        function insertarCategoria(nombre){
            const selectElement = document.getElementById("categoria");
            let htmlToInsert = `<option> ${nombre}</option>`
            selectElement.insertAdjacentHTML('beforeend', htmlToInsert);
        }

        function categoriasRow(){
            let categorias = [
                "Alquiler", "Comida", "Diversion", "Antojo", "Gasto", "Transporte"
            ]
            for(let index = 0; index < categorias.length; index++){
                insertarCategoria(categorias[index])
            }
        }
