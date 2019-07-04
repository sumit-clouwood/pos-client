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
  applyDynamicRules(rulesData) {
    let rules = [
      [".color-button", ["background-color", rulesData["color-button"], true]],
      [
        ".color-dashboard-background",
        ["background-color", rulesData["color-dashboard-background"], true]
      ],
      [
        ".color-icon-table-neutral-button",
        ["background-color", rulesData["color-icon-table-neutral-button"], true]
      ],
      [
        ".slick-slide",
        ["background-color", rulesData["color-secondary"], true]
      ],
      [".color-main", ["background-color", rulesData["color-main"], true]],
      [
        ".active:not(.tab-pane)",
        ["background-color", rulesData["color-main"], true]
      ],
      [
        ".color-secondary",
        ["background-color", rulesData["color-secondary"], true]
      ],
      [
        ".pagination-customer-details li:not(.active)",
        ["background-color", rulesData["color-secondary"], true]
      ],
      [".color-shadow", ["background-color", rulesData["color-shadow"], true]],
      [
        ".color-tables-background",
        ["background-color", rulesData["color-tables-background"], true]
      ],
      [".color-text", ["color", rulesData["color-text"], true]],
      [".color-text-invert", ["color", rulesData["color-text-invert"], true]],
      [".color-warning", ["color", rulesData["color-warning"], true]],
      ["*", ["border-color", rulesData["color-shadow"], true]],
      ["*:hover", ["border-color", rulesData["color-shadow"], true]],
      [
        ".main .main-body .food-wrapper .food-block .food-menu .food-menu-item.active",
        [
          "--webkit-box-shadow",
          "inset 0 0 0px 2px " + rulesData["color-shadow"],
          true
        ]
      ],
      [
        ".main .main-body .food-wrapper .food-block .food-menu .food-menu-item.active",
        ["box-shadow", "inset 0 0 0px 2px " + rulesData["color-shadow"], true]
      ],
      [
        ".main .main-body .food-wrapper .food-block .food-menu .food-menu-item:hover::before",
        ["border-top-color", rulesData["color-shadow"], true]
      ],
      [
        ".main .main-body .food-wrapper .food-block .food-menu .food-menu-item:hover::before",
        ["border-right-color", rulesData["color-shadow"], true]
      ],
      [
        ".main .main-body .food-wrapper .food-block .food-menu .food-menu-item:hover::after",
        ["border-bottom-color", rulesData["color-shadow"], true]
      ],
      [
        ".main .main-body .food-wrapper .food-block .food-menu .food-menu-item:hover::after",
        ["border-left-color", rulesData["color-shadow"], true]
      ]
    ];
    this.addStylesheetRules(rules);
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
      // If the second argument of a rule is an array of arrays, correct our variables.
      if (Array.isArray(rule[1][0])) {
        rule = rule[1];
        j = 0;
      }

      for (var pl = rule.length; j < pl; j++) {
        var prop = rule[j];
        propStr +=
          prop[0] + ": " + prop[1] + (prop[2] ? " !important" : "") + ";\n";
      }

      // Insert CSS Rule
      styleSheet.insertRule(
        selector + "{" + propStr + "}",
        styleSheet.cssRules.length
      );
    }
  }
};
