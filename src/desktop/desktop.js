(isDragging = false), (dragStarted = false), (offsetX = 0), (offsetY = 0);
function openApp(appId) {
  $(`#${appId}Window`).css("display", "flex");
}

function closeApp(appId) {
  $(`#${appId}Window`).hide();
}
function makeDraggable($win) {
  const $titlebar = $win.find(".titlebar");
  const $overlay = $("#drag-overlay");
  $titlebar.on("mousedown", function (e) {
    isDragging = true;
    dragStarted = false;
    const rect = $win[0].getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  $(window).on("mousemove", function (e) {
    if (!isDragging) return;
    if (!dragStarted) {
      $overlay.show();
      dragStarted = true;
    }
    $win.css({
      left: e.clientX - offsetX,
      top: e.clientY - offsetY,
    });
  });

  $(window).on("mouseup", function () {
    if (isDragging) {
      $overlay.hide();
      isDragging = false;
      dragStarted = false;
    }
  });

  $(window).on("keydown", function (e) {
    if (e.key === "Escape") {
      shutdownDesktop();
    }
  });
}
function addAppView(name, path) {
  const $win = $(`
        <div id="${name}Window" class="window">
          <div class="titlebar">
            ${name.charAt(0).toUpperCase() + name.slice(1)}
            <div class="close-btn" onclick="closeApp('${name}')">x</div>
          </div>
          ${
            /^https?:\/\//.test(path)
              ? `<webview src="${path}" style="flex:1;"></webview>`
              : `<iframe src="${path}"></iframe>`
          }
        </div>
      `);

  $("body").append($win);
  makeDraggable($win);
}
function shutdownDesktop() {
  window.parent.postMessage({ channel: "hideSim" }, "*");
}
function openAbout() {
  window.open("https://github.com/Huang-Hau-Shuan/Orbital25"); //TODO: add an about page and open it
}
function toggleStartMenu() {
  $("#start-menu").toggle();
}
$(function () {
  $.getJSON("apps.json", function (appList) {
    const $desktop = $("#desktop");

    appList.forEach((app, i) => {
      const $container = $('<div class="app-container"></div>').css({
        top: `${40 + i * 100}px`,
        left: "40px",
      });

      const $icon = $(`<img src="${app.icon}" class="icon" />`);
      const $label = $(
        `<div class="icon-label">${
          app.name.charAt(0).toUpperCase() + app.name.slice(1)
        }</div>`
      );

      $icon.on("click", () => openApp(app.name));

      $container.append($icon).append($label);
      $desktop.append($container);

      addAppView(app.name, app.path);
    });
  });

  // Expose functions globally for onclick in template HTML
  $("#start-menu").toggle();
});
function SendToSimuNUS(channel, data) {
  channel = typeof channel === "string" ? channel : UTF8ToString(channel);
  const message = {
    channel: channel,
    data: data,
  };
  try {
    if (
      window.SimuNUS_API &&
      typeof window.SimuNUS_API.sendMessage === "function"
    ) {
      //send directly to backend (ipcMain) when embedded in webview
      window.SimuNUS_API.sendMessage(channel, data);
    } else if (window.parent && window.parent !== window) {
      //send to parent window when embedded in iframe
      window.parent.postMessage(message, "*");
    } else {
      //no of the above (?)
      window.postMessage(message, "*");
      console.log(`SendToSimuNUS - channel: ${channel}, content: ${data}`);
    }
  } catch (err) {
    console.warn("bridge.jslib, in sendMessage():", err);
  }
}
function onSimuNUSMessage(channel, callback) {
  if (typeof callback !== "function") {
    console.error(`bridge.jslib, in onMessage(): ${callback} is not callable`);
    return;
  }
  //Register channel
  SendToSimuNUS("register_message_handler", {
    source: "laptop",
    channel: channel,
  });
  // Browser / iframe messages
  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg && msg.channel == channel) {
      callback(msg.data);
    }
  });

  // Electron preload-exposed API
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.onMessage === "function"
  ) {
    window.SimuNUS_API.onMessage(channel, callback);
  }
}
