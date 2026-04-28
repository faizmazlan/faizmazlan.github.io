/* ==========================================================================
   Contact — Form Validation & Submission
   Premium SPA Résumé Website
   ========================================================================== */

/**
 * Email regex — standard RFC-compatible pattern.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Field validation rules.
 * Each key matches the input `name` attribute.
 */
const RULES = {
  name: {
    required: true,
    message: 'Please enter your name.',
  },
  email: {
    required: true,
    validate: (v) => EMAIL_RE.test(v),
    message: 'Please enter a valid email address.',
  },
  message: {
    required: true,
    message: 'Please enter a message.',
  },
};

/**
 * Validate a single field.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @returns {string} Error message or empty string if valid.
 */
function validateField(input) {
  const rule = RULES[input.name];
  if (!rule) return '';

  const value = input.value.trim();

  if (rule.required && !value) {
    return rule.message;
  }

  if (value && rule.validate && !rule.validate(value)) {
    return rule.message;
  }

  return '';
}

/**
 * Show or hide an inline error for a field.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @param {string} message
 */
function setFieldError(input, message) {
  const errorEl = document.getElementById(input.getAttribute('aria-describedby'));
  if (!errorEl) return;

  if (message) {
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
  } else {
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
    input.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  }
}

/**
 * Update the floating label state based on whether the input has a value.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 */
function updateLabelState(input) {
  if (input.value.trim()) {
    input.classList.add('has-value');
  } else {
    input.classList.remove('has-value');
  }
}

/**
 * Initialize the contact form module.
 */
export function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.contact__input');
  const submitBtn = document.getElementById('contact-submit');
  const successEl = document.getElementById('contact-success');

  // Real-time validation on blur and input
  inputs.forEach((input) => {
    input.addEventListener('blur', () => {
      const error = validateField(input);
      setFieldError(input, error);
      updateLabelState(input);
    });

    input.addEventListener('input', () => {
      updateLabelState(input);

      // Clear error as user types (if previously shown)
      if (input.classList.contains('has-error')) {
        const error = validateField(input);
        setFieldError(input, error);
      }
    });
  });

  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let firstInvalid = null;
    inputs.forEach((input) => {
      const error = validateField(input);
      setFieldError(input, error);
      if (error && !firstInvalid) {
        firstInvalid = input;
      }
    });

    // Focus first invalid field
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Show loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // Simulate submission (no backend)
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Fade out form, show success
      form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      form.style.opacity = '0';
      form.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        form.hidden = true;
        successEl.hidden = false;

        // Trigger reflow then add visible class for animation
        void successEl.offsetHeight;
        successEl.classList.add('is-visible');
      }, 400);
    }, 1500);
  });
}
