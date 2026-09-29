import { createHttpClient } from './api/httpClient.js';
import { createContactsApi } from './api/contactsApi.js';
import { renderContactList } from './ui/contactList.js';
import { ContactPanel } from './ui/contactPanel.js';

const LOCATION_ID = document.body.dataset.locationId || 'loc_demo';

const http = createHttpClient({
  baseUrl: '/api/v1',
  getToken: () => sessionStorage.getItem('accessToken'),
});
const contactsApi = createContactsApi(http);
const panel = new ContactPanel(document.getElementById('contact-panel'), contactsApi);

async function boot() {
  const listEl = document.getElementById('contact-list');
  const { contacts } = await contactsApi.list(LOCATION_ID);
  renderContactList(listEl, contacts);

  listEl.addEventListener('click', (e) => {
    const row = e.target.closest('.contact');
    if (row) panel.open(LOCATION_ID, row.dataset.id);
  });
}

boot();
