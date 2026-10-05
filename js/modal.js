(function (global) {
  "use strict";

  var MG = (global.MG = global.MG || {});
  var el = MG.el;
  var modalCounter = 0;

  function actionButton(label, className, onClick) {
    return el("button", {
      className: className,
      type: "button",
      text: label,
      on: { click: onClick }
    });
  }

  function openModal(options) {
    options = options || {};
    modalCounter += 1;

    var previouslyFocused = document.activeElement;
    var previousOverflow = document.body.style.overflow;
    var titleId = "modal-title-" + modalCounter;

    var dialog = el("div", {
      className: "modal",
      attrs: {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        tabindex: "-1"
      }
    });

    dialog.appendChild(
      el("h2", {
        className: "modal__title",
        text: options.title || "",
        attrs: { id: titleId }
      })
    );
    dialog.appendChild(el("div", { className: "modal__body" }, options.content));

    var footer = el("div", { className: "modal__footer" });
    (options.actions || []).forEach(function (action) {
      footer.appendChild(
        actionButton(action.label, action.className || "button", function () {
          if (action.onClick) {
            action.onClick();
          }
          close();
        })
      );
    });
    footer.appendChild(
      actionButton(options.closeLabel || "Close", "button button--ghost", close)
    );
    dialog.appendChild(footer);

    var overlay = el("div", { className: "modal-overlay" }, [dialog]);

    function onKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    function onOverlayClick(event) {
      if (event.target === overlay) {
        close();
      }
    }

    function close() {
      if (!overlay.parentNode) {
        return;
      }
      overlay.parentNode.removeChild(overlay);
      overlay.removeEventListener("click", onOverlayClick);
      document.removeEventListener("keydown", onKeydown, true);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
      if (options.onClose) {
        options.onClose();
      }
    }

    overlay.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onKeydown, true);
    document.body.style.overflow = "hidden";
    document.body.appendChild(overlay);
    dialog.focus();

    return { close: close, element: overlay };
  }

  MG.openModal = openModal;
})(window);
