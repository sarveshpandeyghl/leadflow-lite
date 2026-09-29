import { escapeHtml } from '../utils/escapeHtml.js';
import { highlight } from './contactSearch.js';

export function renderContactRow(contact, query = '') {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  return `<li class="contact" data-id="${escapeHtml(contact.id)}">
    <span class="contact__name">${highlight(fullName, query)}</span>
    <span class="contact__email">${highlight(escapeHtml(contact.email), query)}</span>
  </li>`;
}

export function renderContactList(container, contacts, query = '') {
  if (!contacts.length) {
    container.innerHTML = query
      ? '<p class="empty">No contacts match your search</p>'
      : '<p class="empty">No contacts yet</p>';
    return;
  }
  container.innerHTML = `<ul class="contact-list">${contacts
    .map((c) => renderContactRow(c, query))
    .join('')}</ul>`;
}
