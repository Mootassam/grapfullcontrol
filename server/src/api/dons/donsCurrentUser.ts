import Permissions from "../../security/permissions";
import DonsService from "../../services/donsService";
import PermissionChecker from "../../services/user/permissionChecker";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.donsDestroy);
    const payload = await new DonsService(req).findDons();
    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
