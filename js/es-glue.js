define(["jquery"], function($) {

  function ESGlue() {

  }

  ESGlue.query = function(options, onDone) {
    $.get("http://10.251.33.248:9200/reviews/review",
      '{
        "from":"reviews",
        "select":{"name":"num_bugs","value":"bug_id","aggregate":"count"},
        "edges":["product","component"],
        "esfilter":{"term":{"product":"firefox"}}
       }', onDone, "json");
  };

  return ESGlue;

});
