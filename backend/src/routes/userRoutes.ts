import { Router } from 'express';
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from '../controllers';
import { searchById } from '@/middlewares/searchById';
import { objectIdValidation } from '@/middlewares/objectIdValidation';
import { usernameValidation } from '@/middlewares/usernameValidation';

const router = Router();

router
  .route('/')
  .get(getAllUsers)
  .post(usernameValidation, createNewUser)
  .patch(objectIdValidation, searchById, usernameValidation, updateUser)
  .delete(objectIdValidation, searchById, deleteUser);

export default router;
