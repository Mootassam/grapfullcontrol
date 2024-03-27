export default (app) => {
  app.post(`/tenant/:tenantId/dons`, require("./donsCreate").default);
  app.put(`/tenant/:tenantId/dons/:id`, require("./donsUpdate").default);
  app.post(`/tenant/:tenantId/dons/import`, require("./donsImport").default);
  app.delete(`/tenant/:tenantId/dons`, require("./donsDestroy").default);
  app.get(
    `/tenant/:tenantId/dons/autocomplete`,
    require("./donsAutocomplete").default
  );
  app.get(`/tenant/:tenantId/donss`, require("./donsList").default);
  app.get(`/tenant/:tenantId/dons/:id`, require("./donsFind").default);

  // !api for mobile   //
  // !list Dons for the currentUser //
  app.get(
    `/tenant/:tenantId/donsCurrentUSer`,
    require("./donsCurrentUser").default
  );
};
