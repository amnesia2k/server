import express from "express";
import {
  validateData,
  validateToken,
  validateUserRole,
} from "../middleware/validation-middleware";
import { loginUserSchema, registerUserSchema } from "../db/schema-validator";
import {
  adminDeleteUser,
  deleteAccount,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/auth/user-controller";

const router = express.Router();

router.post("/register", validateData(registerUserSchema), registerUser);
router.post("/login", validateData(loginUserSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/users", validateToken, validateUserRole(["admin"]), getAllUsers);
router.get("/user", validateToken, getUser);
router.delete("/delete", validateToken, deleteAccount);
router.delete(
  "/admin/delete",
  validateToken,
  validateUserRole(["admin"]),
  adminDeleteUser
);
router.patch("/user", validateToken, updateUser);

export default router;
