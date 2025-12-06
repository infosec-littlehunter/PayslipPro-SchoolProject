// Drag to Scroll Implementation
// Enables "grab and drag" scrolling behavior for mobile only

document.addEventListener("DOMContentLoaded", () => {
  const ele = document.documentElement;

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  // --- Touch Events (Mobile) ---
  const touchStartHandler = function (e) {
    // We don't prevent default here to allow clicks, but we might need to if it interferes
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    document.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });
    document.addEventListener("touchend", touchEndHandler);
  };

  const touchMoveHandler = function (e) {
    // Prevent native scrolling
    if (e.cancelable) e.preventDefault();

    const dx = e.touches[0].clientX - pos.x;
    const dy = e.touches[0].clientY - pos.y;
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const touchEndHandler = function () {
    document.removeEventListener("touchmove", touchMoveHandler);
    document.removeEventListener("touchend", touchEndHandler);
  };

  // Attach handlers
  document.addEventListener("touchstart", touchStartHandler, {
    passive: false,
  });
});
