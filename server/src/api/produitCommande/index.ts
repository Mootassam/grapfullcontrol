export default (app) => {
  app.post(
    `/tenant/:tenantId/produit-commande`,
    require("./produitCommandeCreate").default
  );
  app.put(
    `/tenant/:tenantId/produit-commande/:id`,
    require("./produitCommandeUpdate").default
  );
  app.post(
    `/tenant/:tenantId/produit-commande/import`,
    require("./produitCommandeImport").default
  );
  app.delete(
    `/tenant/:tenantId/produit-commande`,
    require("./produitCommandeDestroy").default
  );
  app.get(
    `/tenant/:tenantId/produit-commande/autocomplete`,
    require("./produitCommandeAutocomplete").default
  );
  app.get(
    `/tenant/:tenantId/produit-commande`,
    require("./produitCommandeList").default
  );
  app.get(
    `/tenant/:tenantId/produit-commande/:id`,
    require("./produitCommandeFind").default
  );
  // !api for mobile   //
  // !list produitCommand for the currentUser //

  app.get(
    `/tenant/:tenantId/achatsCurrentUser`,
    require("./produitCurrentUser").default
  );
};
