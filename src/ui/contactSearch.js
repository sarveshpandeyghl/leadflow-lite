import { debounce } from '../utils/debounce.js';
import { renderContactList } from './contactList.js';

export const PAGE_SIZE = 20;

/**
 * Case-insensitive match against full name and email.
 */
export function buildMatcher(query) {
  const pattern = new RegExp(query.trim(), 'gi');
  return (contact) =>
    pattern.test(`${contact.firstName} ${contact.lastName}`) || pattern.test(contact.email);
}

/**
 * Wraps every occurrence of `query` in <mark> for display.
 */
export function highlight(text, query) {
  if (!query) return text;
  return text.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.floor(items.length / pageSize));
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    totalPages,
  };
}

function renderPager(pager, { page, totalPages }) {
  pager.innerHTML = `
    <button data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>Prev</button>
    <span>Page ${page} of ${totalPages}</span>
    <button data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>Next</button>`;
}

export function mountContactSearch({ input, container, pager, getContacts }) {
  let query = '';
  let page = 1;

  function update() {
    const all = getContacts();
    const matches = query ? all.filter(buildMatcher(query)) : all;
    const result = paginate(matches, page);
    renderContactList(container, result.items, query);
    renderPager(pager, result);
  }

  input.addEventListener('input', debounce((e) => {
    query = e.target.value;
    page = 1;
    update();
  }, 200));

  pager.addEventListener('click', (e) => {
    const target = e.target.closest('button[data-page]');
    if (!target || target.disabled) return;
    page = Number(target.dataset.page);
    update();
  });

  update();
}
