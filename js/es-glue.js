define(["jquery"], function($) {

  function ESGlue() {

  }

  var defaultObj =
  {
    "query":{"filtered":{
      "query":{"match_all":{}},
      "filter":{"and":[{"match_all":{}},{"term":{"product":"firefox"}}]}
    }},
    "from":0,
    "size":0,
    "sort":[],
    "facets": {"default": {
      "terms": {
        "script_field":"var Value2Pipe = function(value){\nif (value==null){ \"0\" }else if (value is ArrayList || value is org.elasticsearch.common.mvel2.util.FastList){var out = \"\";\nforeach (v : value) out = (out==\"\") ? v : out + \"|\" + Value2Pipe(v);\n'a'+Value2Pipe(out);\n}else \nif (value is Long || value is Integer || value is Double){ 'n'+value; }else \nif (!(value is String)){ 's'+value.getClass().getName(); }else \n\"s\"+value.replace(\"\\\\\", \"\\\\\\\\\").replace(\"|\", \"\\\\p\");};\nvar get = function(hash, key){\nif (hash==null) null; else hash[key];\n};\nvar getDocValue = function(name){\nvar out = [];\nvar v = doc[name];\nif (v==null || v.value==null) { null; } else if (v.values.length<=1){ v.value; } else {for(k : v.values) out.add(k); out;}};\n''+Value2Pipe(getDocValue(\"product\"))+'|'+Value2Pipe(getDocValue(\"component\"))",
          "size":200000
        }
      }
    }
  };

  ESGlue.query = function(options, onDone) {
    $.ajax({
      type: "POST",
      data: JSON.stringify(defaultObj),
      dataType: 'json',
      url: "http://10.251.33.248:9200/reviews/review/_search",
      statusCode: {
        200: function (response) {},
        201: function (response) {},
        400: function (response) {},
        401: function (response) {},
        404: function (response) {}
      },
      success: function (data, status, xhrObj) {
        onDone(data, status, xhrObj)
      },
      error: function(e) {
        console.log("Error " + e.responseText);
      }
    });
  };

  return ESGlue;

});
