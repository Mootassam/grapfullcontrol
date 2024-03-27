import Permissions from "../../security/permissions";
import PermissionChecker from "../../services/user/permissionChecker";
import VotesService from "../../services/votesService";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.votesRead);
    const payload = await new VotesService(req).findVotes();
    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
