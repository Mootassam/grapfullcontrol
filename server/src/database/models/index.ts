const models = [
  require('./tenant').default,
  require('./auditLog').default,
  require('./settings').default,
  require('./user').default,
  require('./association').default,
  require('./mandat').default,
  require('./categorieMouv').default,
  require('./mouvements').default,
  require('./campagne').default,
  require('./detailsCampagne').default,
  require('./palier').default,
  require('./historiquePoints').default,
  require('./projet').default,
  require('./votes').default,
  require('./dons').default,
  require('./produitCategorie').default,
  require('./produit').default,
  require('./produitCommande').default,
  require('./commandLine').default,
];

export default function init(database) {
  for (let model of models) {
    model(database);
  }

  return database;
}

export async function createCollections(database) {
  for (let model of models) {
    await model(database).createCollection();
  }

  return database;
}
