// Form checks. Each function returns an error message, or '' when the value is fine.
import { parseDateString } from './dates';

// Institutional email: <ID>.cst@rub.edu.bt  (same shape for students and staff)
const EMAIL_PATTERN = /^([a-z0-9]+)\.cst@rub\.edu\.bt$/i;

export function validateRequired(value, label) {
  if (!value || !String(value).trim()) return `${label} is required`;
  return '';
}

export function validateInstitutionalEmail(email) {
  const value = (email || '').trim();
  if (!value) return 'Email is required';
  if (!EMAIL_PATTERN.test(value)) {
    return 'Use your institutional email, e.g. 02240189.cst@rub.edu.bt';
  }
  return '';
}

// The part before ".cst@rub.edu.bt", or '' if the email is not valid.
export function getIdFromEmail(email) {
  const match = (email || '').trim().match(EMAIL_PATTERN);
  return match ? match[1] : '';
}

// The ID typed by the user must match the ID inside their institutional email.
export function validateUserId(id, email) {
  const value = (id || '').trim();
  if (!value) return 'Student/Staff ID is required';
  const fromEmail = getIdFromEmail(email);
  if (fromEmail && fromEmail.toLowerCase() !== value.toLowerCase()) {
    return 'ID does not match the ID in your email';
  }
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password needs at least one letter and one number';
  }
  return '';
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
}

export function validateItemDate(text) {
  if (!text || !text.trim()) return 'Date is required';
  const date = parseDateString(text);
  if (!date) return 'Enter a real date as YYYY-MM-DD';
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (date > endOfToday) return 'Date cannot be in the future';
  return '';
}
