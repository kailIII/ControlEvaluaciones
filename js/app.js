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
        $scope.info = Data.info;
        $scope.MisCursos = {};
        $scope.evaluacionesCurso = {};
        $scope.cursoNombre = '';
        $scope.idGrupo = '';
        $scope.nombreEvaluacion = '';
        $scope.porcentajeEvaluacion = 0;
        $scope.porcentajeTotal=0;
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
        
        $scope.verEvaluaciones = function(id, nombre)
        {
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $http.get("./BD/getEvaluacionGrupo.php?grupo="+id)
            .success(function(response) {$scope.evaluacionesCurso = response;});
            
            $http.get("./BD/porcentajeTotal.php?grupo="+id)
            .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});
            
            $scope.evaluaciones = true;
        };
        
        $scope.agregarEvaluacion = function()
        {
            $scope.nueva = true;
            $scope.editar = false;
            $scope.nombreEvaluacion = '';
            $scope.porcentajeEvaluacion = '';
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
                
                        $http.get("./BD/porcentajeTotal.php?grupo="+id)
                        .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});
                    }
                    else
                    {
                        alert("Error insertando la evaluacion.");
                    }
                });            
            }
            else
            {
                $http.get("/DB/update.php?id="+$scope.eid+"&nombre="+$scope.eNombre+"&porcentaje="+$scope.ePorcentaje)
                .success(function(response){
                    if(response==="")
                    {
                        $http.get("/DB/getEvaluaciones.php")
                        .success(function(response) {$scope.evaluaciones = response});
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
        
        $scope.editarEvaluacion = function(id, porcentaje, nombre)
        {
            $scope.nueva = false;
            $scope.editar = true;
            $scope.nombreEvaluacion = nombre;
            $scope.porcentajeEvaluacion = porcentaje;
        };
        
        $scope.citasRevision = function(id)
        {
            alert("citas evaluacion: "+id);
        };
        
    })
    
    .controller("studentController", function($scope, $http, $location){
        
    });