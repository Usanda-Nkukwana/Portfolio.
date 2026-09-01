document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form form');

  if (!form) {
    return;
  }

  const apiUrl = window.location.port === '3000'
    ? '/api/contact'
    : 'http://localhost:3000/api/contact';

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

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    showStatus('Sending your message...', false);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const responseText = await response.text();
      let result = { success: false, message: 'Server returned an empty response.' };

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = {
            success: false,
            message: responseText.slice(0, 180) || 'The server returned an invalid response.'
          };
        }
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send your message.');
      }

      form.reset();
      showStatus(`Thanks ${name}! Your message has been sent successfully.`, false);
    } catch (error) {
      showStatus(error.message || 'Something went wrong while sending your message.', true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});
