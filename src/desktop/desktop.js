isDragging = false, dragStarted = false, offsetX = 0, offsetY = 0;
function openApp(appId) {
  $(`#${appId}Window`).css('display', 'flex');
}

function closeApp(appId) {
  $(`#${appId}Window`).hide();
}
function makeDraggable($win) {
  const $titlebar = $win.find('.titlebar');
  const $overlay = $('#drag-overlay');
  $titlebar.on('mousedown', function (e) {
    isDragging = true;
    dragStarted = false;
    const rect = $win[0].getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  $(window).on('mousemove', function (e) {
    if (!isDragging) return;
    if (!dragStarted) {
      $overlay.show();
      dragStarted = true;
    }
    $win.css({
      left: e.clientX - offsetX,
      top: e.clientY - offsetY
    });
  });

  $(window).on('mouseup', function () {
    if (isDragging) {
      $overlay.hide();
      isDragging = false;
      dragStarted = false;
    }
  });

  $(window).on('keydown', function(e){
    if (e.key === 'Escape') {
      shutdownDesktop();
    }
  })
}
function addAppView(name, path) {
  const $win = $(`
        <div id="${name}Window" class="window">
          <div class="titlebar">
            ${name.charAt(0).toUpperCase() + name.slice(1)}
            <div class="close-btn" onclick="closeApp('${name}')">x</div>
          </div>
          ${/^https?:\/\//.test(path)
      ? `<webview src="${path}" style="flex:1;"></webview>`
      : `<iframe src="${path}"></iframe>`}
        </div>
      `);

  $('body').append($win);
  makeDraggable($win);
}
function shutdownDesktop() {
  window.parent.postMessage({ action: 'hideSim' }, '*');
}
function openAbout() {
  window.open('https://github.com/Huang-Hau-Shuan/Orbital25'); //TODO: add an about page and open it
}
function toggleStartMenu() {
  $('#start-menu').toggle();
}
$(function () {
  $.getJSON('apps.json', function (appList) {
    const $desktop = $('#desktop');

    appList.forEach((app, i) => {
      const $container = $('<div class="app-container"></div>').css({
        top: `${40 + i * 100}px`,
        left: '40px'
      });

      const $icon = $(`<img src="${app.icon}" class="icon" />`);
      const $label = $(`<div class="icon-label">${app.name.charAt(0).toUpperCase() + app.name.slice(1)}</div>`);

      $icon.on('click', () => openApp(app.name));

      $container.append($icon).append($label);
      $desktop.append($container);
      
      addAppView(app.name, app.path);
    });
  });

  // Expose functions globally for onclick in template HTML
  $('#start-menu').toggle();
});