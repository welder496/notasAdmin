var express = require('express');
var router = express.Router();
var notasRest = require('notasrest');
var tags = require('./tags');
var arquivos = require('./arquivos');


/* GET */
router.get('/', function(req, res, next){
   var codigo = req.body.searchCodigo;
   if (typeof(codigo) == "undefined" || codigo=="") {
      notasRest.getFirstNotas(function(data){
         for (var i=0; i < data.length; i++){
               data[i].tags = tags(data[i].tags);
               data[i].arquivos = arquivos(data[i].codigo,data[i].arquivos);
         }
         res.render('searchForCodigo',{results: data, show: 'false'});
      });
   } else {
      notasRest.getNotaByCodigoLike(codigo, function(data){
         for (var i=0; i < data.length; i++){
               data[i].tags = tags(data[i].tags);
               data[i].arquivos = arquivos(data[i].codigo,data[i].arquivos);
         }
         res.render('searchForCodigo',{results: data, show: 'false'});
      });
   }
});

/* POST */
router.post('/', function(req, res, next) {
   var codigo = req.body.codigo || req.body.searchCodigo;
   var del = req.body.comando;
   if (typeof(del) == "undefined") {
      if (typeof(codigo) == "undefined" || codigo=="") {
         notasRest.getFirstNotas(function(data){
            for (var i=0; i < data.length; i++){
               data[i].tags = tags(data[i].tags);
               data[i].arquivos = arquivos(data[i].codigo,data[i].arquivos);
            }
            res.render('searchForCodigo',{results: data, show: 'false'});
         });
      } else {
         notasRest.getNotaByCodigoLike(codigo, function(data){
            for (var i=0; i < data.length; i++){
                  data[i].tags = tags(data[i].tags);
                  data[i].arquivos = arquivos(data[i].codigo,data[i].arquivos);
            }
            if (data.hasOwnProperty('message'))
               res.render('searchForCodigo',{results: null, show: 'true', message: data.message});
            else
               res.render('searchForCodigo',{results: data, show: 'false'});
         });
      }
    } else {
         notasRest.deleteNotaByCodigo(codigo,function(data){
               var dat = data;
               notasRest.getFirstNotas(function(data){
                     for (var i=0; i < data.length; i++){
                           data[i].tags = tags(data[i].tags);
                           data[i].arquivos = arquivos(data[i].codigo,data[i].arquivos);
                     }
                     res.render('searchForCodigo',{results: data, show: 'true', message: dat.message});
               });
         });
    }
});


module.exports = router;