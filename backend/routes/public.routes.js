const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Routes publiques (sans authentification)
router.get('/lab-info', publicController.getLabInfo);
router.get('/teams', publicController.getTeams);
router.get('/teams/:id', publicController.getTeamById);

module.exports = router;
