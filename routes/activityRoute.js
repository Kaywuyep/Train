const express = require('express');
const activityRouter = express.Router();
//const isAdmin = require('../middlewares/isAdmin');
//const isTrainer = require('../middlewares/isTrainer');
const isLoggedIn = require('../middlewares/isLoggedIn');

const {
    getActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity
} = require('../controllers/activityController');

//activityRouter.get('/', isLoggedIn, getActivities);
activityRouter.post('/new', isLoggedIn, createActivity);
activityRouter.get('/:id', isLoggedIn, getActivity);
activityRouter.put('/:id/update', isLoggedIn, updateActivity);
activityRouter.delete('/:id/delete', isLoggedIn, deleteActivity);

module.exports = activityRouter;