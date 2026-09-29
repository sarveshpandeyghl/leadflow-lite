import { escapeHtml } from '../utils/escapeHtml.js';

const COMPACT_BREAKPOINT_PX = 600;

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

    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  handleResize() {
    this.root.classList.toggle('is-compact', window.innerWidth < COMPACT_BREAKPOINT_PX);
  }

  render() {
    const c = this.contact;
    this.root.innerHTML = `
      <h2>${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</h2>
      <dl>
        <dt>Email</dt><dd data-field="email" contenteditable>${escapeHtml(c.email)}</dd>
        <dt>Phone</dt><dd data-field="phone" contenteditable>${escapeHtml(c.phone)}</dd>
        <dt>Tags</dt><dd>${c.tags.map(escapeHtml).join(', ')}</dd>
      </dl>
      <p class="error" hidden></p>`;

    this.root.querySelectorAll('[data-field]').forEach((el) => {
      el.addEventListener('blur', () => this.saveField(el.dataset.field, el.textContent.trim()));
    });
  }

  /**
   * Optimistically updates the UI, then persists.
   */
  async saveField(field, value) {
    if (this.contact[field] === value) return;

    this.contact = { ...this.contact, [field]: value };
    this.render();

    try {
      await this.api.update(this.locationId, this.contact.id, { [field]: value });
    } catch (err) {
      const errorEl = this.root.querySelector('.error');
      errorEl.textContent = `Couldn't save ${field}. Please try again.`;
      errorEl.hidden = false;
    }
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.root.innerHTML = '';
    this.contact = null;
  }
}
