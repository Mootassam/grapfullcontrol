export default (app) => {
  app.post(`/tenant/:tenantId/votes`, require("./votesCreate").default);
  app.put(`/tenant/:tenantId/votes/:id`, require("./votesUpdate").default);
  app.post(`/tenant/:tenantId/votes/import`, require("./votesImport").default);
  app.delete(`/tenant/:tenantId/votes`, require("./votesDestroy").default);
  app.get(
    `/tenant/:tenantId/votes/autocomplete`,
    require("./votesAutocomplete").default
  );
  app.get(`/tenant/:tenantId/votes`, require("./votesList").default);
  app.get(`/tenant/:tenantId/votes/:id`, require("./votesFind").default);
  // !api for mobile   //
  // !list Votes for the currentUser //
  app.get(
    `/tenant/:tenantId/votesCurrentUser`,
    require("./VotesCurrentUser").default
  );
};
