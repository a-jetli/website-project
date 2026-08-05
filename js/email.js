const emailTriggers = document.querySelectorAll('[data-email-trigger]');

if (emailTriggers.length > 0) {
  const emailParts = ['ansh', 'jetli', 'gmail', 'com'];
  const displayParts = [
    emailParts[0],
    '[dot]',
    emailParts[1],
    '[at]',
    emailParts[2],
    '[dot]',
    emailParts[3]
  ];

  const emailDialog = document.createElement('dialog');
  emailDialog.className = 'modal';
  emailDialog.id = 'email-dialog';
  emailDialog.setAttribute('aria-labelledby', 'email-dialog-title');
  emailDialog.setAttribute('aria-describedby', 'email-dialog-description');
  emailDialog.innerHTML = `
    <div class="modal__content">
      <h2 class="modal__title" id="email-dialog-title">Email me</h2>
      <p class="modal__text" id="email-dialog-description">
        To limit web scrapers, my email address is written out below.
      </p>
      <p class="modal__code" data-email-address></p>
      <div class="modal__actions">
        <button type="button" class="modal__button modal__button--primary" data-email-copy>
          Copy address
        </button>
        <button type="button" class="modal__button" data-email-close>Close</button>
      </div>
      <p class="modal__status" role="status" aria-live="polite"></p>
    </div>
  `;
  document.body.appendChild(emailDialog);

  const addressDisplay = emailDialog.querySelector('[data-email-address]');
  const copyButton = emailDialog.querySelector('[data-email-copy]');
  const status = emailDialog.querySelector('.modal__status');
  let activeTrigger = null;
  let resetTimer = null;

  addressDisplay.textContent = displayParts.join(' ');
  addressDisplay.setAttribute('aria-label', displayParts.join(' ').replaceAll('[', '').replaceAll(']', ''));

  function buildEmailAddress() {
    return `${emailParts[0]}.${emailParts[1]}${String.fromCharCode(64)}${emailParts[2]}.${emailParts[3]}`;
  }

  function resetCopyState() {
    window.clearTimeout(resetTimer);
    copyButton.textContent = 'Copy address';
    status.textContent = '';
  }

  emailTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      activeTrigger = trigger;
      resetCopyState();
      emailDialog.showModal();
    });
  });

  emailDialog.querySelectorAll('[data-email-close]').forEach(button => {
    button.addEventListener('click', () => emailDialog.close());
  });

  emailDialog.addEventListener('close', () => {
    resetCopyState();
    activeTrigger?.focus();
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildEmailAddress());
      copyButton.textContent = 'Copied';
      status.textContent = 'Email address copied to clipboard.';
      resetTimer = window.setTimeout(resetCopyState, 2500);
    } catch {
      status.textContent = 'Copy unavailable. Please enter the address manually.';
    }
  });
}
