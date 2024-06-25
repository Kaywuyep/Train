const express = require('express');
const workoutRouter = express.Router();
//const isAdmin = require('../middlewares/isAdmin');
const isTrainer = require('../middlewares/isTrainer');
const isLoggedIn = require('../middlewares/isLoggedIn');
const {
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout
} = require('../controllers/workoutcController');

workoutRouter.get('/', isLoggedIn, getWorkouts);
workoutRouter.post('/new', isLoggedIn, isTrainer, createWorkout);
workoutRouter.get('/:id', isLoggedIn, getWorkout);
workoutRouter.put('/:id/update', isLoggedIn, isTrainer, updateWorkout);
workoutRouter.delete('/:id/delete', isLoggedIn, isTrainer, deleteWorkout);

module.exports = workoutRouter;
