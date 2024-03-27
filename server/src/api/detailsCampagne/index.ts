export default (app) => {
  app.post(
    `/tenant/:tenantId/details-campagne`,
    require("./detailsCampagneCreate").default
  );
  app.put(
    `/tenant/:tenantId/details-campagne/:id`,
    require("./detailsCampagneUpdate").default
  );
  app.post(
    `/tenant/:tenantId/details-campagne/import`,
    require("./detailsCampagneImport").default
  );
  app.delete(
    `/tenant/:tenantId/details-campagne`,
    require("./detailsCampagneDestroy").default
  );
  app.get(
    `/tenant/:tenantId/details-campagne/autocomplete`,
    require("./detailsCampagneAutocomplete").default
  );
  app.get(
    `/tenant/:tenantId/details-campagne`,
    require("./detailsCampagneList").default
  );
  app.get(
    `/tenant/:tenantId/details-campagne/:id`,
    require("./detailsCampagneFind").default
  );

  // !api for mobile   //
  // !list adherent for the currentUser //

  app.get(
    `/tenant/:tenantId/adhesionsCurrentUser`,
    require("./adhesionsCurrentUser").default
  );
};
