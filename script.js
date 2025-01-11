// Initial Setup: Nanobot Task Animations
document.addEventListener("DOMContentLoaded", () => {
  // Define task image animation
  const cancerImage = document.getElementById("cancer-task-image");
  const drugImage = document.getElementById("drug-delivery-image");
  const repairImage = document.getElementById("repair-task-image");

  // Nanobot Movement Animations (GSAP)
  gsap.to(cancerImage, {
    x: 200,
    duration: 2,
    repeat: -1,
    yoyo: true
  });

  gsap.to(drugImage, {
    x: 150,
    duration: 3,
    repeat: -1,
    yoyo: true
  });

  gsap.to(repairImage, {
    x: 180,
    duration: 3.5,
    repeat: -1,
    yoyo: true
  });

  // Tooltip and Hover Effects (anime.js)
  document.querySelectorAll('.task').forEach((task) => {
    task.addEventListener('mouseenter', function() {
      anime({
        targets: task.querySelector('.task-image'),
        scale: 1.1,
        duration: 500,
        easing: 'easeOutQuad'
      });
      task.querySelector('.task-content').style.animation = "zoomIn 1s ease-in-out";
    });
    task.addEventListener('mouseleave', function() {
      anime({
        targets: task.querySelector('.task-image'),
        scale: 1,
        duration: 500,
        easing: 'easeOutQuad'
      });
    });
  });

  // Modal Open & Close Logic
  const modalBtns = document.querySelectorAll(".learn-more-button");
  modalBtns.forEach(button => {
    button.addEventListener("click", function() {
      const targetModalId = this.getAttribute("data-target");
      const modal = document.getElementById(targetModalId);
      modal.style.display = "block";
    });
  });

  // Close Modal when clicking X
  const closeBtns = document.querySelectorAll(".close-btn");
  closeBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      this.closest(".modal").style.display = "none";
    });
  });

  // Close Modal if clicked outside modal content
  window.addEventListener("click", function(event) {
    const modal = event.target.closest(".modal");
    if (modal && !modal.contains(event.target)) {
      modal.style.display = "none";
    }
  });
});
