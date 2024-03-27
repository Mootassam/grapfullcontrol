import importerActions from 'src/modules/shared/importer/importerActions';
import selectors from 'src/modules/coupons/importer/couponsImporterSelectors';
import fields from 'src/modules/coupons/importer/couponsImporterFields';
import { i18n } from 'src/i18n';
import ProductService from 'src/modules/product/productService';

const productImporterActions = importerActions(
  'COUPONS_IMPORTER',
  selectors,
  ProductService.import,
  fields,
  i18n('entities.coupons.importer.fileName'),
);

export default productImporterActions;