/* global $ */
export default {
  applyColoring: function(Brand) {
    // eslint-disable-next-line no-console
    console.log(Brand);
    $(".color-button").css("background-color", Brand["color-button"]);
    $(".color-dashboard-background").css(
      "background-color",
      Brand["color-dashboard-background"]
    );
    $(".color-icon-table-neutral-button").css(
      "background-color",
      Brand["color-icon-table-neutral-button"]
    );
    $(".color-main").css("background-color", Brand["color-main"]);
    $(".color-secondary").css("background-color", Brand["color-secondary"]);
    $(".color-shadow").css("background-color", Brand["color-shadow"]);
    $(".color-tables-background").css(
      "background-color",
      Brand["color-tables-background"]
    );
    $(".color-text-invert").css("background-color", Brand["color-text-invert"]);
    $(".color-warning").css("background-color", Brand["color-warning"]);
    $(".color-text").css("background-color", Brand["color-text"]);
    let items = window.document.styleSheets;
    for (var i = 0, n = items.length; i < n; i++) {
      // eslint-disable-next-line no-console
      console.log(items[i]);
    }
  },
  addStylesheetRules(rules) {
    var styleEl = document.createElement("style");

    // Append <style> element to <head>
    document.head.appendChild(styleEl);

    // Grab style element's sheet
    var styleSheet = styleEl.sheet;

    for (var i = 0; i < rules.length; i++) {
      var j = 1,
        rule = rules[i],
        selector = rule[0],
        propStr = "";
      // eslint-disable-next-line no-console
      console.log(selector, " << selector");
      // eslint-disable-next-line no-console
      console.log(rule, " << rule");
      // eslint-disable-next-line no-console
      console.log(rule[1][0], " <<  is array");
      // If the second argument of a rule is an array of arrays, correct our variables.
      if (Array.isArray(rule[1][0])) {
        rule = rule[1];
        j = 0;
      }

      for (var pl = rule.length; j < pl; j++) {
        var prop = rule[j];
        // eslint-disable-next-line no-console
        console.log(rule[j], " << prop", j);
        propStr +=
          prop[0] + ": " + prop[1] + (prop[2] ? " !important" : "") + ";\n";
        // eslint-disable-next-line no-console
        console.log(propStr);
      }

      // Insert CSS Rule
      styleSheet.insertRule(
        selector + "{" + propStr + "}",
        styleSheet.cssRules.length
      );
    }
  }
};
