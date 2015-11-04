angular.module("app", ["ngRoute"])
    .config(function($routeProvider){
        $routeProvider
            .when("/", {
                controller: "loginController",
                controllerAs: "vm",
                templateUrl: "Vistas/Login.html"
            })
            .when("/professor", {
                controller: "professorController",
                controllerAs: "vm",
                templateUrl: "Vistas/Professor.html"
            })
            .when("/student", {
                controller: "studentController",
                controllerAs: "vm",
                templateUrl: "Vistas/Student.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    })
    
    .factory('Data', function () {
        var info = {};
        return info;
    })
    
    .controller("loginController", function($scope, $http, $location, Data) {
        $scope.error = '';
        $scope.user = "2-0562-0727";
        $scope.pass = "12345";
        
        $scope.Login = function() 
        {        
            $http.get('./BD/Login.php?cedula='+$scope.user+"&pass="+$scope.pass)
                .success(function(response)
                {   
                    if(response !== "Error")
                    {   
                        Data.info = response;
                        if(response.tipo === "P")
                        {                            
                            $location.path('/professor');
                        }
                        else if(response.tipo === "E")
                        {
                            $location.path('/student');
                        }
                        else
                        {
                            $scope.error = 'Error en la conexion.';
                        }
                    }
                    else
                    {
                        $scope.error = 'Login incorrecto.';
                    }
                });
        };
    })
    
    .controller("professorController", function($scope, $http, $location, Data){
        $scope.rowSelected = 0;
        $scope.info = Data.info;
        $scope.MisCursos = {};
        $scope.evaluacionesCurso = [];
        $scope.cursoNombre = '';
        $scope.idGrupo = '';
        $scope.nombreEvaluacion = '';
        $scope.porcentajeEvaluacion = 0;
        $scope.porcentajeTotal=0;
        $scope.idEvaluacion = 0;
        $scope.evaluaciones = false;
        $scope.nueva = false;
        $scope.editar = false;
        $scope.error = false;
        
        $http.get("./BD/getCursos.php?cedula="+$scope.info.cedula)
        .success(function(response) {$scope.MisCursos = response;});

        $scope.logout = function()
        {
            $location.path('/');
        };
        
        $scope.mostrarEvaluaciones = mostrarEvaluaciones;
        $scope.ocultarEvaluaciones = ocultarEvaluaciones;

        function mostrarEvaluaciones(num) {
            if($scope.rowSelected > 0) {
                ocultarEvaluaciones();
            }

            $scope.rowSelected = num;

            var th = document.createElement('th');
            th.setAttribute('colspan', '4');
            var div = document.createElement('div');
            div.setAttribute('class', 'container');
            div.setAttribute('style', 'overflow-y: auto; height: 200px; width: 100%;');
            
            var table = document.createElement('table');
            table.setAttribute('class', 'table table-striped');
            var thead = document.createElement('thead');
            var trEncabezado = document.createElement('tr');
            var rowNombre = document.createElement('th');
            rowNombre.appendChild(document.createTextNode('Nombre'));
            var rowProcentaje = document.createElement('th');
            rowProcentaje.appendChild(document.createTextNode('Porcentaje'));
            var rowEditar = document.createElement('th');
            rowEditar.appendChild(document.createTextNode('Editar'));
            var rowVer = document.createElement('th');
            rowVer.appendChild(document.createTextNode('Ver'));
            var rowCitas = document.createElement('th');
            rowCitas.appendChild(document.createTextNode('Citas de revision'));
            
            if($scope.evaluacionesCurso.length > 0) {
                console.log($scope.evaluacionesCurso.length);
                var tbody = document.createElement('tbody');

                var trCuerpo, nombreCuerpo, porcentajeCuerpo, editarCuerpo, verCuerpo, citasCuerpo, btnEditar, btnVer, btnCitas, spanEditar, spanVer, spanCitas;

                for(var i=0; i<$scope.evaluacionesCurso.length; i++) {
                    trCuerpo = document.createElement('tr');

                    nombreCuerpo = document.createElement('th');
                    nombreCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].nombre));
                    porcentajeCuerpo = document.createElement('th');
                    porcentajeCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].porcentaje));
                    editarCuerpo = document.createElement('th');
                    verCuerpo = document.createElement('th');
                    citasCuerpo = document.createElement('th');

                    spanEditar = document.createElement('span');
                    spanEditar.setAttribute('class', 'glyphicon glyphicon-edit');
                    spanVer = document.createElement('span');
                    spanVer.setAttribute('class', 'glyphicon glyphicon-th-list');
                    spanCitas = document.createElement('span');
                    spanCitas.setAttribute('class', 'glyphicon glyphicon-calendar');

                    btnEditar = document.createElement('button');
                    btnEditar.setAttribute('class', 'btn'); 
                    btnEditar.setAttribute('ng-click', "editarEvaluacion("+$scope.evaluacionesCurso[i].idevaluacion+", "+$scope.evaluacionesCurso[i].nombre+", "+$scope.evaluacionesCurso[i].porcentaje+")");
                    btnEditar.appendChild(spanEditar);

                    btnVer = document.createElement('button');
                    btnVer.setAttribute('class', 'btn'); 
                    btnVer.setAttribute('ng-click', "verNotas("+$scope.evaluacionesCurso[i].idevaluacion+")");
                    btnVer.appendChild(spanVer);

                    btnCitas = document.createElement('button');
                    btnCitas.setAttribute('class', 'btn'); 
                    btnCitas.setAttribute('ng-click', "citasRevision("+$scope.evaluacionesCurso[i].idevaluacion+")");
                    btnCitas.appendChild(spanCitas);

                    editarCuerpo.appendChild(btnEditar);
                    verCuerpo.appendChild(btnVer);
                    citasCuerpo.appendChild(btnCitas);

                    trCuerpo.appendChild(nombreCuerpo);
                    trCuerpo.appendChild(porcentajeCuerpo);
                    trCuerpo.appendChild(editarCuerpo);
                    trCuerpo.appendChild(verCuerpo);
                    trCuerpo.appendChild(citasCuerpo);

                    tbody.appendChild(trCuerpo);
                }

                table.appendChild(tbody);
            }

            th.appendChild(div);
            div.appendChild(table);
            table.appendChild(thead);
            thead.appendChild(trEncabezado);
            trEncabezado.appendChild(rowNombre);
            trEncabezado.appendChild(rowProcentaje);
            trEncabezado.appendChild(rowEditar);
            trEncabezado.appendChild(rowVer);
            trEncabezado.appendChild(rowCitas);

            var tabla = document.getElementById("tableCursos");
            var rowCursos = tabla.insertRow(num+1);
            rowCursos.appendChild(th);

            var flechita = table.rows[num].cells[0].firstChild;
            flechita.setAttribute('class', 'glyphicon glyphicon-chevron-down');
        }

        function ocultarEvaluaciones() {
            var table = document.getElementById("tableCursos");
            table.deleteRow($scope.rowSelected+1);

            var flechita = table.rows[$scope.rowSelected].cells[0].firstChild;
            flechita.setAttribute('class', 'glyphicon glyphicon-chevron-right');

            $scope.rowSelected = 0;
        }
                    
        $scope.verEvaluaciones = verEvaluaciones;
        function verEvaluaciones(row, id, nombre)
        {
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $http.get("./BD/getEvaluacionGrupo.php?grupo="+id)
            .success(function(response) {
                $scope.evaluacionesCurso = response;
                mostrarEvaluaciones(row);
            });
            
            $http.get("./BD/porcentajeTotal.php?grupo="+id)
            .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});

        };
        
        $scope.agregarEvaluacion = function()
        {
            $scope.nueva = true;
            $scope.editar = false;
            $scope.nombreEvaluacion = '';
            $scope.porcentajeEvaluacion = '';
        };
        
        $scope.editarEvaluacion = function(id, n, p)
        {
            $scope.nueva = false;
            $scope.editar = true;
            $scope.nombreEvaluacion = n;
            $scope.porcentajeEvaluacion = p;
            $scope.idEvaluacion = id;
        };
        
        $scope.$watch('nombreEvaluacion',function() {$scope.validar();});
        $scope.$watch('porcentajeEvaluacion',function() {$scope.validar();});

        $scope.validar = function() 
        {
            if (!$scope.nombreEvaluacion.length || !$scope.porcentajeEvaluacion.length || isNaN($scope.porcentajeEvaluacion) ) 
            {
               $scope.error = true;
            }
            else
            {
               $scope.error = false;
            }
        };
        
        $scope.guardarEvaluacion = function() 
        {
            if($scope.nueva)
            {
                $http.get("./BD/insertarEvaluacion.php?id="+$scope.idGrupo+"&nombre="+$scope.nombreEvaluacion+"&porcentaje="+$scope.porcentajeEvaluacion)
                .success(function(response){
                    if(response==="")
                    {
                        $http.get("./BD/getEvaluacionGrupo.php?grupo="+$scope.idGrupo)
                        .success(function(response) {$scope.evaluacionesCurso = response;});
                
                        $http.get("./BD/porcentajeTotal.php?grupo="+$scope.idGrupo)
                        .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});
                        $scope.nueva = false;
                    }
                    else
                    {
                        alert("Error insertando la evaluacion.");
                    }
                });            
            }
            else
            {
                $http.get("./BD/updateEvaluacion.php?id="+$scope.idEvaluacion+"&nombre="+$scope.nombreEvaluacion+"&porcentaje="+$scope.porcentajeEvaluacion)
                .success(function(response){
                    if(response==="")
                    {
                        $http.get("./BD/getEvaluacionGrupo.php?grupo="+$scope.idGrupo)
                        .success(function(response) {$scope.evaluacionesCurso = response;});
                
                        $http.get("./BD/porcentajeTotal.php?grupo="+$scope.idGrupo)
                        .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});
                        $scope.editar = false;
                    }
                    else
                    {
                        alert("Error actualizando la informacion.");
                    }
                });  


            }
        };
        
        $scope.verNotas = function(id)
        {
            alert("Ver notas de evaluacion: "+id);
        };
                
        
        $scope.citasRevision = function(id)
        {
            alert("citas evaluacion: "+id);
        };
        
    })
    
    .controller("studentController", function($scope, $http, $location, Data){
        $scope.info = Data.info;
        $scope.rowSelected = 0;
        $scope.evaluacionesCurso = [];
        $scope.verEvaluaciones = verEvaluaciones;
        $scope.logout = logout;
        $scope.mostrarEvaluaciones = mostrarEvaluaciones;
        $scope.ocultarEvaluaciones = ocultarEvaluaciones;
        
        $http.get("./BD/getCursosStudent.php?cedula="+$scope.info.cedula)
            .success(function(response) {
                $scope.MisCursos = response;
            });
        
        function logout() {
            $location.path('/');
        };

        function mostrarEvaluaciones(num, id) {
            if($scope.rowSelected > 0) {
                ocultarEvaluaciones();
            }
            
            $scope.rowSelected = num;
            console.log("Luego del http -> ",$scope.evaluacionesCurso);

            var th = document.createElement('th');
            th.setAttribute('colspan', '4');
            var div = document.createElement('div');
            div.setAttribute('class', 'container');
            div.setAttribute('style', 'overflow-y: auto; height: 200px; width: 100%;');
            
            var table = document.createElement('table');
            table.setAttribute('class', 'table table-striped');
            var thead = document.createElement('thead');
            var trEncabezado = document.createElement('tr');
            var rowNombre = document.createElement('th');
            rowNombre.appendChild(document.createTextNode('Nombre'));
            var rowProcentaje = document.createElement('th');
            rowProcentaje.appendChild(document.createTextNode('Porcentaje'));
            var rowNota = document.createElement('th');
            rowNota.appendChild(document.createTextNode('Nota'));
            
            if($scope.evaluacionesCurso.length > 0) {
                console.log($scope.evaluacionesCurso.length);
                var tbody = document.createElement('tbody');

                var trCuerpo, nombreCuerpo, porcentajeCuerpo, notaCuerpo;

                for(var i=0; i<$scope.evaluacionesCurso.length; i++) {
                    trCuerpo = document.createElement('tr');

                    nombreCuerpo = document.createElement('th');
                    nombreCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].nombre));
                    porcentajeCuerpo = document.createElement('th');
                    porcentajeCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].porcentaje));
                    notaCuerpo = document.createElement('th');
                    notaCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].nota));

                    trCuerpo.appendChild(nombreCuerpo);
                    trCuerpo.appendChild(porcentajeCuerpo);
                    trCuerpo.appendChild(notaCuerpo);

                    tbody.appendChild(trCuerpo);
                }

                table.appendChild(tbody);
            }

            th.appendChild(div);
            div.appendChild(table);
            table.appendChild(thead);
            thead.appendChild(trEncabezado);
            trEncabezado.appendChild(rowNombre);
            trEncabezado.appendChild(rowProcentaje);
            trEncabezado.appendChild(rowNota);

            var table = document.getElementById("tableCursos");
            var rowCursos = table.insertRow(num+1);
            rowCursos.appendChild(th);

            var flechita = table.rows[num].cells[0].firstChild;
            flechita.setAttribute('class', 'glyphicon glyphicon-chevron-down');
        }

        function ocultarEvaluaciones() {
            var table = document.getElementById("tableCursos");
            table.deleteRow($scope.rowSelected+1);

            var flechita = table.rows[$scope.rowSelected].cells[0].firstChild;
            flechita.setAttribute('class', 'glyphicon glyphicon-chevron-right');

            $scope.rowSelected = 0;
        }
        
        function verEvaluaciones(row, id, nombre)
        {
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $scope.evaluacionesCurso = [];
            
            $http.get("./BD/getEvaluacionesStudent.php?cedula="+$scope.info.cedula+"&idGrupo="+id)
            .success(function(response) {
                $scope.evaluacionesCurso = response;
                console.log("$scope.evaluacionesCurso -> ",$scope.evaluacionesCurso);
                mostrarEvaluaciones(row, id);
            });
        };
    });