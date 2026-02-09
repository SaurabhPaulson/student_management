import { Router } from 'express';
import { loginAdmin, addStudent, assignTask, listStudents, listTasks } from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', loginAdmin);
router.post('/students/create', authenticateAdmin, addStudent);
router.post('/tasks/create', authenticateAdmin, assignTask);
router.get('/students/list', authenticateAdmin, listStudents);
router.get('/tasks/list', authenticateAdmin, listTasks);

export default router;
