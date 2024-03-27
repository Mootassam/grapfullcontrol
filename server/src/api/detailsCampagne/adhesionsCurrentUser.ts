import DetailsCampagneService from "../../services/detailsCampagneService";
import PermissionChecker from "../../services/user/permissionChecker";
import ApiResponseHandler from "../apiResponseHandler";
import Permissions from "../../security/permissions";

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(
      Permissions.values.detailsCampagneRead
    );
    const payload = await new DetailsCampagneService(
      req
    ).findDetatilsCompagne();
    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
