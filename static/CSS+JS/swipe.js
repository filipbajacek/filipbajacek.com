document.addEventListener("DOMContentLoaded", function () {
    const swipeTarget = document.querySelector("#lightbox"); // alebo ".lb-image"

    if (!swipeTarget) return;

    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    swipeTarget.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    swipeTarget.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > swipeThreshold) {
            // Získaj rozmery lightboxu
            const rect = swipeTarget.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;

            let clickX;
            if (deltaX < 0) {
                // swipe left → klik doprava
                clickX = rect.left + rect.width * 0.9;
            } else {
                // swipe right → klik doľava
                clickX = rect.left + rect.width * 0.1;
            }

            const simulatedClick = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                clientX: clickX,
                clientY: centerY
            });

            swipeTarget.dispatchEvent(simulatedClick);
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const swipeTarget = document.querySelector("#lightbox");

    if (!swipeTarget) return;

    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    swipeTarget.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    swipeTarget.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) {
                // swipe left → klikni na šípku dopredu
                const next = document.querySelector(".lb-next");
                if (next) next.click();
            } else {
                // swipe right → klikni na šípku dozadu
                const prev = document.querySelector(".lb-prev");
                if (prev) prev.click();
            }
        }
    });
});
