import { escapeHtml } from '../utils/escapeHtml.js';

export function renderContactRow(contact) {
  return `<li class="contact" data-id="${escapeHtml(contact.id)}">
    <span class="contact__name">${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</span>
    <span class="contact__email">${escapeHtml(contact.email)}</span>
  </li>`;
}

export function renderContactList(container, contacts) {
  if (!contacts.length) {
    container.innerHTML = '<p class="empty">No contacts yet</p>';
    return;
  }
  container.innerHTML = `<ul class="contact-list">${contacts.map(renderContactRow).join('')}</ul>`;
}
