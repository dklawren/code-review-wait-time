define(["jquery"], function($) {

  function ESGlue() {

  }

  function getPagination(onDone) {
    var data = { "term" : { "product" : "firefox" }};
    var url = "http://10.251.33.248:9200/reviews/review/_count";

    ajaxRequest(url, JSON.stringify(data), onDone);
  }

  function ajaxRequest(url, data, onDone) {
    $.ajax({
      type: "POST",
      data: data,
      dataType: 'json',
      url: url,
      statusCode: {
        200: function (response) {},
        201: function (response) {},
        400: function (response) {},
        401: function (response) {},
        404: function (response) {}
      },
      success: function (returnData, returnStatus, xhrObj) {
        onDone(returnData, returnStatus, xhrObj)
      },
      error: function(e) {
        console.log("Error " + e.responseText);
      }
    });
  }

  ESGlue.query = function(onDone) {
    getPagination(function(pageData) {

      var data =
      {
        "fields": ["review_time", "request_time"],
        "query":{"filtered":{
          "query":{"match_all":{}},
          "filter":{"and":[{"match_all":{}},{"term":{"product":"firefox"}}]}
        }},
        "size": 0,
        "facets": {"default": {
          "terms": {
            "script_field":"var Value2Pipe = function(value){\nif (value==null){ \"0\" }else if (value is ArrayList || value is org.elasticsearch.common.mvel2.util.FastList){var out = \"\";\nforeach (v : value) out = (out==\"\") ? v : out + \"|\" + Value2Pipe(v);\n'a'+Value2Pipe(out);\n}else \nif (value is Long || value is Integer || value is Double){ 'n'+value; }else \nif (!(value is String)){ 's'+value.getClass().getName(); }else \n\"s\"+value.replace(\"\\\\\", \"\\\\\\\\\").replace(\"|\", \"\\\\p\");};\nvar get = function(hash, key){\nif (hash==null) null; else hash[key];\n};\nvar getDocValue = function(name){\nvar out = [];\nvar v = doc[name];\nif (v==null || v.value==null) { null; } else if (v.values.length<=1){ v.value; } else {for(k : v.values) out.add(k); out;}};\n''+Value2Pipe(getDocValue(\"product\"))+'|'+Value2Pipe(getDocValue(\"component\"))",
              "size":200000
            }
          }
        }
      };

      var url = "http://10.251.33.248:9200/reviews/review/_search";
      data.size = pageData.count || 0;

      ajaxRequest(url, JSON.stringify(data), onDone);
    });
  };

  return ESGlue;

});
