require.config({
  baseDir: '/js',
  paths: {
      'jquery': 'vendor/jquery',
      'd3': 'vendor/d3.min',
      'es-glue': 'es-glue'
  }
});

require(['jquery', 'es-glue', 'd3'], function ($, ES, d3) {
  'use strict';

  function aggregateTimes(data, aggregate) {
    aggregate = aggregate || {};
    data.facets.default.terms.forEach(function(t) {
      aggregate[t.term] = aggregate[t.term] || {
        week: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        month: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        year: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
      };
    });

    var now = 1383264000000;
    var lastmonth = new Date(now);
    lastmonth.setUTCMonth(lastmonth.getUTCMonth() - 1);
    lastmonth = now - lastmonth.getTime();
    var lastyear = new Date(now);
    lastyear.setUTCFullYear(lastyear.getUTCFullYear() - 1);
    lastyear = now - lastyear.getTime();

    data.hits.hits.forEach(function(h) {
      var agg = aggregate['firefox|' + h.fields.component];
      var elapsed = now - h.fields.request_time;
      var time = h.fields.review_time - h.fields.request_time;
      if (!elapsed || !time) {
        return;
      }
      if (elapsed < 604800000) { // 1 week
        agg.week.count = agg.week.count + 1;
        agg.week.time = agg.week.time + time;
        agg.week.min = Math.min(agg.week.min, time);
        agg.week.max = Math.max(agg.week.max, time);
      }
      if (elapsed < lastmonth) { // 1 month
        agg.month.count = agg.month.count + 1;
        agg.month.time = agg.month.time + time;
        agg.month.min = Math.min(agg.month.min, time);
        agg.month.max = Math.max(agg.month.max, time);
      }
      if (elapsed < lastyear) { // 1 year
        agg.year.count = agg.year.count + 1;
        agg.year.time = agg.year.time + time;
        agg.year.min = Math.min(agg.year.min, time);
        agg.year.max = Math.max(agg.year.max, time);
      }
    });

    return aggregate;
  }

  ES.query(function(data, status, xhr) {
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function formatTime(ms) {
      if (isNaN(ms)) {
        return "N/A";
      }
      if (ms < 1000) {
        return ms + " milliseconds";
      }
      if (ms < 60000) {
        return (ms / 1000).toFixed(1) + " seconds";
      }
      if (ms < 3600000) {
        return (ms / 60000).toFixed(1) + " minutes";
      }
      if (ms < 86400000) {
        return (ms / 3600000).toFixed(1) + " hours";
      }
      return (ms / 86400000).toFixed(1) + " days";
    }
    function toDays(ms) {
      return (ms / 86400000).toFixed(1);
    }
    var aggregate = aggregateTimes(data);
    var row = d3.select("#component-times")
        .selectAll("tr")
        .data(Object.keys(aggregate)
                    .filter(function(k){ return aggregate[k].year.count}))
        .enter()
        .append("tr");
    row.append("td")
        .text(function(d){ return capitalize(d.split("|")[1])});
    row.append("td")
        .text(function(d){ return formatTime(aggregate[d].week.time / aggregate[d].week.count)});
    row.append("td")
        .text(function(d){ return formatTime(aggregate[d].month.time / aggregate[d].month.count)});
    row.append("td")
        .text(function(d){ return formatTime(aggregate[d].year.time / aggregate[d].year.count)});
    row.append("td")
        .text(function(d){ return formatTime(aggregate[d].year.min)});
    row.append("td")
        .text(function(d){ return formatTime(aggregate[d].year.max)});

    var total = {
        week: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        month: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        year: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
    };
    for (var k in aggregate) {
        for (var l in aggregate[k]) {
            total[l].count = total[l].count + aggregate[k][l].count;
            total[l].time = total[l].time + aggregate[k][l].time;
            total[l].min = Math.min(total[l].min, aggregate[k][l].min);
            total[l].max = Math.max(total[l].max, aggregate[k][l].max);
        }
    }
    total = [
        total.week.time / total.week.count,
        total.month.time / total.month.count,
        total.year.time / total.year.count,
        total.year.min,
        total.year.max,
    ];
    var totalTimes = d3.select("#total-times")
        .selectAll("tr")
        .each(function(d, i) {
            d3.select(this)
                .select("td")
                .text(formatTime(total[i]));
        });

    var total = {
        week: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        month: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
        year: {
            count: 0,
            time: 0,
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        },
    };
    for (var k in aggregate) {
        for (var l in aggregate[k]) {
            total[l].count = total[l].count + aggregate[k][l].count;
            total[l].time = total[l].time + aggregate[k][l].time;
            total[l].min = Math.min(total[l].min, aggregate[k][l].min);
            total[l].max = Math.max(total[l].max, aggregate[k][l].max);
        }
    }
    $(function(){
      $("#stats-table").tablesorter({ sortList: [[0, 0]] });
    });

    total = [
        total.week.time / total.week.count,
        total.month.time / total.month.count,
        total.year.time / total.year.count,
        total.year.min,
        total.year.max,
    ];
    var totalTimes = d3.select("#total-times")
        .selectAll("tr")
        .each(function(d, i) {
            d3.select(this)
                .select("td")
                .text(formatTime(total[i]));
        });

    var chart_data = [
        ["Week", toDays(total[0])],
        ["Month", toDays(total[1])],
        ["12 Months", toDays(total[2])],
        ["Shortest", toDays(total[3])],
        ["Longest", toDays(total[4])]
    ]; 
    $.plot("#chart", [ chart_data ], {
            series: {
                bars: {
                    show: true,
                    barWidth: 0.6,
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            }
        });
  });
});
