import { escapeHtml } from '../utils/escapeHtml.js';

export class ContactPanel {
  constructor(root, contactsApi) {
    this.root = root;
    this.api = contactsApi;
    this.contact = null;
    this.locationId = null;
  }

  async open(locationId, contactId) {
    this.locationId = locationId;
    this.root.innerHTML = '<p class="loading">Loading…</p>';
    this.contact = await this.api.get(locationId, contactId);
    this.render();
  }

  render() {
    const c = this.contact;
    this.root.innerHTML = `
      <h2>${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</h2>
      <dl>
        <dt>Email</dt><dd>${escapeHtml(c.email)}</dd>
        <dt>Phone</dt><dd>${escapeHtml(c.phone)}</dd>
        <dt>Tags</dt><dd>${c.tags.map(escapeHtml).join(', ')}</dd>
      </dl>`;
  }

  destroy() {
    this.root.innerHTML = '';
    this.contact = null;
  }
}
