import {AdminAPI} from "./AdminAPI/AdminAPI";
import {UserAPI} from "./UserAPI/UserAPI";
import { ControllerInterface } from "../abstract/ControllerInterface";

export const APIs: Array<ControllerInterface> = [new AdminAPI, new UserAPI];