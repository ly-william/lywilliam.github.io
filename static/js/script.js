function openLightbox(imageSrc) {
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImage = document.getElementById("lightboxImage");
  lightboxImage.src = imageSrc;
  lightboxModal.classList.remove("hidden");
}

document.getElementById("lightboxClose").addEventListener("click", () => {
  document.getElementById("lightboxModal").classList.add("hidden");
});

document.getElementById("lightboxModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("lightboxModal")) {
    document.getElementById("lightboxModal").classList.add("hidden");
  }
});

document.querySelectorAll(".dropdown-button").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".group");
    const content = card.querySelector(".dropdown-content");
    const arrow = btn.querySelector(".dropdown-arrow");

    const expanded =
      content.style.maxHeight && content.style.maxHeight !== "0px";

    if (expanded) {
      content.style.maxHeight = "0px";
      content.style.opacity = "0";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.opacity = "1";
    }

    arrow.classList.toggle("rotate-180");
  });
});
