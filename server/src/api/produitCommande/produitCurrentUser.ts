import Permissions from "../../security/permissions";
import ProduitCommandeService from "../../services/produitCommandeService";
import PermissionChecker from "../../services/user/permissionChecker";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.votesRead);
    const payload = await new ProduitCommandeService(req).findAchats();
    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
