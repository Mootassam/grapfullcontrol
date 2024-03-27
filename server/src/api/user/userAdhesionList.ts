import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import DetailsCampagneService from '../../services/detailsCampagneService';

export default async (req, res) => {
  try {
    new PermissionChecker(req).validateHas(
      Permissions.values.userRead,
    );

    const payload = await new DetailsCampagneService(
        req,
      ).findAdhesionAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
