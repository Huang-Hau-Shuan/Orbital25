mergeInto(LibraryManager.library, {
  SimuNUS_ExitGame: function () {
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ type: 'SimuNUS_ExitGame' }, '*');
    } else {
      console.log('ExitGame called outside iframe.');
    }
  },

  SimuNUS_SaveGame: function () {
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ type: 'SimuNUS_SaveGame' }, '*');
    } else {
      console.log('SaveGame called outside iframe.');
    }
  },

  SimuNUS_LoadGame: function () {
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ type: 'SimuNUS_LoadGame' }, '*');
    } else {
      console.log('LoadGame called outside iframe.');
    }
  }
});
