import { Router } from 'express';
import * as controller from './workflow.controller';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteWorkflow);

export default router;
