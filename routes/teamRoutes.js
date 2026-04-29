import express from 'express';
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMember,
} from '../controller/teamController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const teamRouter = express.Router();

teamRouter.use(adminProtect);

teamRouter.get('/', getAllTeamMembers);
teamRouter.get('/:id', getTeamMember);
teamRouter.post('/', createTeamMember);
teamRouter.put('/:id', updateTeamMember);
teamRouter.delete('/:id', deleteTeamMember);

export default teamRouter;
