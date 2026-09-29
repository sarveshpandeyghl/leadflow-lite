export function createContactsApi(http) {
  return {
    list: (locationId) => http.get(`/locations/${locationId}/contacts`),
    get: (locationId, contactId) => http.get(`/locations/${locationId}/contacts/${contactId}`),
    update: (locationId, contactId, patch) =>
      http.put(`/locations/${locationId}/contacts/${contactId}`, patch),
    create: (locationId, contact) => http.post(`/locations/${locationId}/contacts`, contact),
  };
}
