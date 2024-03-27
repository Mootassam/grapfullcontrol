export default (app) => {
  app.post(
    `/tenant/:tenantId/record`,
    require('./recordCreate').default,
  );
  app.put(
    `/tenant/:tenantId/record/:id`,
    require('./recordUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/record/import`,
    require('./recordImport').default,
  );
  app.delete(
    `/tenant/:tenantId/record`,
    require('./recordDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/record/autocomplete`,
    require('./recordAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/record`,
    require('./recordList').default,
  );
  app.get(
    `/tenant/:tenantId/record/:id`,
    require('./recordFind').default,
  );
};
