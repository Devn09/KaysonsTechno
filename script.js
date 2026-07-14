(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('[data-current-year]').forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });

  const demoForm = document.querySelector('[data-demo-form]');
  const formMessage = document.querySelector('[data-form-message]');

  if (demoForm && formMessage) {
    demoForm.addEventListener('submit', function (event) {
      event.preventDefault();
      formMessage.textContent = 'Demo only: connect the final company email or form service before launch.';
      formMessage.classList.add('is-visible');
    });
  }
})();
