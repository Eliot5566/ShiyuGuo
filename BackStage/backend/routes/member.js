const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const memberController = require('../controllers/memberController');

router.post('/',verifyJWT, memberController.handleMember);
router.put('/', memberController.handleEditMember);
router.delete('/', memberController.handleDeleteMember);

module.exports = router;