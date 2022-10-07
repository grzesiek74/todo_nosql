const express = require('express');
const { TodoRecord } = require('../records/todo.record');

const todoRouter = express.Router();

todoRouter
    .get('/', async (req, res) => {
        const allTasks = await TodoRecord.findAll();

        res.render('tasks/all-task', {
            allTasks,
        });
    })

    .delete('/:id', async (req, res) => {
        const id = req.params.id;
        const todo = await TodoRecord.find(id);
        todo.delete();
        res.redirect('/');
    })


    .post('/', async (req, res) => {
        const title = req.body.title;
        const newTodo = new TodoRecord({
            title,
        });
        await newTodo.insert();
        res.redirect('/');
        
    })


module.exports = {
    todoRouter,
}