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
    
    .controller("professorController", function($scope, $http, $location, $timeout, Data, $compile){
        $scope.rowSelected = 0;
        $scope.info = Data.info;
        $scope.MisCursos = {};
        $scope.evaluacionesCurso = [];
        $scope.historialNotas = {};
        $scope.cursoNombre = '';
        $scope.idGrupo = '';
        $scope.numgrupo = '';
        $scope.nombreEvaluacion = '';
        $scope.porcentajeEvaluacion = 0;
        $scope.porcentajeTotal=0;
        $scope.idEvaluacion = 0;
        $scope.evaluaciones = false;
        $scope.nueva = false;
        $scope.editar = false;
        $scope.error = false;
        $scope.estado = "";

        $scope.fechaCita = "";
        $scope.horaInicio = "";
        $scope.horaFin = "";
        $scope.crearCita = false;
        $scope.verCitas = false;
        $scope.errorCitas = false;
        
        $http.get("./BD/getCursos.php?cedula="+$scope.info.cedula)
        .success(function(response) {$scope.MisCursos = response;});

        $scope.logout = function()
        {
            $location.path('/');
        };

        $scope.$watch('fechaCita',function() {$scope.validarCita();});
        $scope.$watch('horaInicio',function() {$scope.validarCita();});
        $scope.$watch('horaFin',function() {$scope.validarCita();});

        $scope.validarCita = function() 
        {
            if(!$scope.fechaCita.length || !$scope.horaInicio.length || !$scope.horaFin.length) 
            {
               $scope.errorCitas = true;
            }
            else
            {
               $scope.errorCitas = false;
            }
        };

        $scope.tabNuevaCita = function() {
            $scope.verCitas = false;
            $scope.crearCita = true;
            
            document.getElementById('tabNuevaCita').className = 'btn btn-primary';
            document.getElementById('tabVerCitas').className = 'btn btn-default';
            document.getElementById('modalCitas').className = 'modal-dialog modal-md';
        }
        $scope.tabVerCitas = function() {
            $scope.crearCita = false;
            $scope.verCitas = true;

            document.getElementById('tabNuevaCita').className = 'btn btn-default';
            document.getElementById('tabVerCitas').className = 'btn btn-primary';
            document.getElementById('modalCitas').className = 'modal-dialog modal-lg';

            $http.get("./BD/getCitasRevisionProfesor.php?idEval="+$scope.idEvaluacion)
            .success(function(response) {
                $scope.citas = response;
            });
        }

        $scope.agregarCitaRevision = function() {
            $http.get("./BD/insertarCitaRevisionProfesor.php?idEval="+$scope.idEvaluacion+"&fecha="+$scope.fechaCita+"&horaInicio="+$scope.horaInicio+"&horaFin="+$scope.horaFin)
            .success(function(response) {
                console.log(response);
            });
        }

        $scope.verEvaluaciones = function(id, gr,nombre)
        {
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $scope.numgrupo = gr;
            $scope.evaluaciones = true;
            $http.get("./BD/getEvaluacionGrupo.php?grupo="+id)
            .success(function(response) {
                $scope.evaluacionesCurso = response;
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
            console.log("Editar: "+id+ n+p);
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
        
        $scope.verNotas = function(id, gr,n,p)
        {
            $scope.nombreEvaluacion = n;
            $scope.porcentajeEvaluacion = p; 
            $scope.idEvaluacion = id;
            
            $http.get("./BD/getHistorialNotas.php?grupo="+gr+"&evaluacion="+id)
            .success(function(response) {$scope.historialNotas = response;});
        };
                
        $scope.guardarCalificacion = function(ced)
        {
            document.getElementById('estado').setAttribute("class","text-danger");
            $scope.estado = "Guardando cambios.";
            $http.get("./BD/insertarCalificacion.php?cedula="+ced+"&evaluacion="+$scope.idEvaluacion+"&nota="+document.getElementById(ced).value)
            .success(function(response) {});
            $timeout(function(){
                document.getElementById('estado').setAttribute("class","text-success");
                $scope.estado = "Guardado.";}, 1000);
            
        };
        
        $scope.citasRevision = function(id)
        {
            $scope.crearCita = true;
            $scope.verCitas = false;
            $scope.idEvaluacion = id;

            $scope.fechaCita = "";
            $scope.horaInicio = "";
            $scope.horaFin = "";
                        
            document.getElementById('tabNuevaCita').className = 'btn btn-primary';
            document.getElementById('tabVerCitas').className = 'btn btn-default';
            document.getElementById('modalCitas').className = 'modal-dialog modal-md';
        };
        
    })
    
    .controller("studentController", function($scope, $http, $location, Data){
        $scope.info = Data.info;
        $scope.rowSelected = 0;
        $scope.evaluacionesCurso = [];
        $scope.showEvaluaciones = false;
        $scope.porcentaje = 0;
        $scope.nota = 0;
        $scope.notaProyectada = 0;
        $scope.selectedCita = true;
        $scope.nombreEvaluacion = "";
        $scope.conCita = false;
        $scope.sinCita = false;
        $scope.estadisticas = false;
        $scope.verEvaluaciones = verEvaluaciones;
        $scope.logout = logout;
        $scope.citasRevision = citasRevision;
        $scope.calcularNota = calcularNota;
        $scope.agregarCitaRevision = agregarCitaRevision;
        $scope.selectCita = selectCita;
        
        function selectCita(idCita) {
            $scope.citaSeleccionada = idCita;
            $scope.selectedCita = false;
        }

        function calcularNota() {
            $scope.porcentaje = 0;
            $scope.nota = 0;
            $scope.notaProyectada = 0;

            for(var i=0; i<$scope.evaluacionesCurso.length; i++) {
                $scope.porcentaje += parseInt($scope.evaluacionesCurso[i].porcentaje);
                $scope.nota += $scope.evaluacionesCurso[i].nota * ($scope.evaluacionesCurso[i].porcentaje/100);
            }

            $scope.notaProyectada = $scope.nota + (100-$scope.porcentaje);
            $scope.estadisticas = true;
        }
        
        function agregarCitaRevision() {
            $http.get("./BD/insertarCitaRevisionEstudiante.php?idCita="+$scope.citaSeleccionada+"&cedula="+Data.info.cedula)
            .success(function(response) {
                console.log(response);
            }); 
        }

        function citasRevision(nombre, idEvaluacion) {
            $scope.conCita = false;
            $scope.sinCita = false;
            $scope.selectedCita = true;
            $scope.nombreEvaluacion = nombre;

            $http.get("./BD/getCitaEvaluacion.php?idEval="+idEvaluacion+"&cedula="+$scope.info.cedula)
            .success(function(response) {
                if(response) {
                    $scope.citaRevision = response;
                    $scope.conCita = true;
                }
                else {
                    $http.get("./BD/citasRevisionEstudiante.php?idEval="+idEvaluacion+"&cedula="+$scope.info.cedula)
                    .success(function(response) {

                        $scope.citas = response;
                        $scope.sinCita = true;
                    }); 
                }
            });
        }
        
        $http.get("./BD/getCursosStudent.php?cedula="+$scope.info.cedula)
            .success(function(response) {
                $scope.MisCursos = response;
            });
        
        function logout() {
            $location.path('/');
        };
        
        function verEvaluaciones(id, nombre)
        {
            $scope.porcentaje = 0;
            $scope.nota = 0;
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $scope.evaluacionesCurso = [];
            
            $scope.showEvaluaciones = true;
            $scope.estadisticas = false;
            
            $http.get("./BD/getEvaluacionesStudent.php?cedula="+$scope.info.cedula+"&idGrupo="+id)
            .success(function(response) {
                $scope.evaluacionesCurso = response;
                if(response.length > 0)
                    calcularNota(); 
            });
        };
    });
