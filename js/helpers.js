(function (global) {
  "use strict";

  var MG = (global.MG = global.MG || {});

  function el(tag, props, children) {
    var node = document.createElement(tag);
    applyProps(node, props);
    appendChildren(node, children);
    return node;
  }

  function applyProps(node, props) {
    if (!props) {
      return;
    }
    Object.keys(props).forEach(function (key) {
      var value = props[key];
      if (value == null) {
        return;
      }
      if (key === "className") {
        node.className = value;
      } else if (key === "text") {
        node.textContent = String(value);
      } else if (key === "attrs") {
        setAttributes(node, value);
      } else if (key === "on") {
        addListeners(node, value);
      } else {
        node[key] = value;
      }
    });
  }

  function setAttributes(node, attrs) {
    Object.keys(attrs).forEach(function (name) {
      node.setAttribute(name, attrs[name]);
    });
  }

  function addListeners(node, listeners) {
    Object.keys(listeners).forEach(function (type) {
      node.addEventListener(type, listeners[type]);
    });
  }

  function appendChildren(node, children) {
    if (children == null) {
      return;
    }
    var list = Array.isArray(children) ? children : [children];
    list.forEach(function (child) {
      if (child == null) {
        return;
      }
      if (typeof child === "string" || typeof child === "number") {
        node.appendChild(document.createTextNode(String(child)));
      } else {
        node.appendChild(child);
      }
    });
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function shuffle(items) {
    var result = items.slice();
    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = result[i];
      result[i] = result[j];
      result[j] = swap;
    }
    return result;
  }

  function formatDate(timestamp) {
    var date = new Date(timestamp);
    var day = String(date.getDate()).padStart(2, "0");
    var month = String(date.getMonth() + 1).padStart(2, "0");
    return day + "." + month + "." + date.getFullYear();
  }

  MG.el = el;
  MG.clearNode = clearNode;
  MG.shuffle = shuffle;
  MG.formatDate = formatDate;
})(window);
