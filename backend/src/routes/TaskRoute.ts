import { Router } from "express";
import { verifyFirebaseUser } from "@/middleware/auth.js";
import {
  createTask,
  listTasks,
  updateTask,
  completeTask,
  deleteTask,
} from "@/controllers/TaskController.js";

const router = Router();
router.use(verifyFirebaseUser);

router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.post("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

export default router;
