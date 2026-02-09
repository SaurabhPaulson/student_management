import { Router } from 'express';
import { loginStudent, getMyTasks, completeTask } from '../controllers/studentController';
import { authenticateStudent } from '../middleware/auth';

const router = Router();

router.post('/login', loginStudent);
router.get('/tasks/list', authenticateStudent, getMyTasks);
router.patch('/tasks/:id', authenticateStudent, completeTask);

export default router;
