document.addEventListener('DOMContentLoaded', () => {
  // Finds the form directly in your HTML
  const form = document.querySelector('form');

  if (!form) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const requiredFields = form.querySelectorAll('input, textarea');
  let isSending = false;

  const updateSubmitButton = () => {
    const hasEmptyField = Array.from(requiredFields).some(field => !field.value.trim());
    submitButton.disabled = isSending || hasEmptyField;
  };

  requiredFields.forEach((field) => {
    field.addEventListener('input', updateSubmitButton);
  });
  updateSubmitButton();

  // Uses your Formspree action endpoint
  const apiUrl = form.getAttribute('action') || 'https://formspree.io/f/xkjnbzqe';

  const statusBox = document.createElement('p');
  statusBox.className = 'form-status';
  statusBox.setAttribute('aria-live', 'polite');
  form.appendChild(statusBox);

  const showStatus = (message, isError) => {
    statusBox.textContent = message;
    statusBox.classList.toggle('error', isError);
    statusBox.classList.toggle('success', !isError);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const subject = form.querySelector('#subject').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus('Please fill in your name, email, and message.', true);
      return;
    }

    if (!emailPattern.test(email)) {
      showStatus('Please enter a valid email address.', true);
      return;
    }

    const originalText = submitButton.textContent;
    isSending = true;
    updateSubmitButton();
    submitButton.textContent = 'Sending...';
    showStatus('Sending your message...', false);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok) {
        form.reset();
        showStatus(`Thanks ${name}! Your message has been sent successfully.`, false);
      } else {
        if (Object.hasOwn(data, 'errors')) {
          const errorMsg = data.errors.map(err => err.message).join(', ');
          throw new Error(errorMsg);
        } else {
          throw new Error('Failed to send your message.');
        }
      }
    } catch (error) {
      showStatus(error.message || 'Something went wrong while sending your message.', true);
    } finally {
      isSending = false;
      updateSubmitButton();
      submitButton.textContent = originalText;
    }
  });
});