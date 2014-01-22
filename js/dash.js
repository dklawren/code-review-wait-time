define(['es-glue'], function(ES) {

var options = {};
ES.query(options, function(data, status, xhr) {
console.log(data, status, xhr);
});

});