mergeInto(LibraryManager.library, {
  ShowSimulatedDesktop: function () {
    if (typeof showSimDesktop === 'function') {
      showSimDesktop();
    }else{
      window.parent.postMessage({ action: 'showSim' }, '*');
    }
  },
  HideSimulatedDesktop: function () {
    if (typeof hideSimDesktop === 'function') {
      hideSimDesktop();
    }else{
      window.parent.postMessage({ action: 'hideSim' }, '*');
    }
  }
});
