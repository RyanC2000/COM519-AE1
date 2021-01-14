const Task = require("../models/Task");

// CREATE
exports.create = async (req, res) => {   
  console.log(req);
  let task = new Task({ text: req.body.task_description, deadline: req.body.deadline, user_id: req.body.user_id}); 
  try {
   await task.save();
   res.redirect('/add-task/?message=Task has been created. ')
 } catch (e) {
   return res.status(400).send({
     message: JSON.parse(e),
   });  
 }
}

// RETRIEVE 
exports.listDaily = async (req, res) => {
  try {
    console.log(req.query);
    const message = req.query.message;
    const tasks = await Task.find({});
    res.render('daily', { tasks: tasks, message: message });
  } catch (e) {
    res.status(404).send({ message: "Could not list tasks. " });
  }
};

exports.listWeekly = async (req, res) => {
  try {
    console.log(req.query);
    const message = req.query.message;
    const tasks = await Task.find({});
    res.render('weekly', { tasks: tasks, message: message });
  } catch (e) {
    res.status(404).send({ message: "Could not list tasks. " });
  }
};

// UPDATE
exports.editDaily = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task) throw Error('Cannot retrive task. ');
    res.render('edit-task', {
      task: task,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('edit-task', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `Could not find task ${id}`,
    });
  }
};

exports.editWeekly = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task) throw Error('Cannot retrive task. ');
    res.render('edit-task', {
      task: task,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('edit-task', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `Could not find task ${id}`,
    });
  }
};

exports.updateDaily = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.updateOne({ _id: id }, req.body);
    res.redirect('/daily/?message= Task has been updated. ');
  } catch (e) {
    res.status(404).send({
      message: `Could not find task ${id}.`,
    });
  }
};

exports.updateWeekly = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.updateOne({ _id: id }, req.body);
    res.redirect('/weekly/?message= Task has been updated. ');
  } catch (e) {
    res.status(404).send({
      message: `Could not find task ${id}.`,
    });
  }
};

// DELETE
exports.deleteDaily = async (req, res) => {
  const id = req.params.id;
  try {
    await Task.findByIdAndRemove(id);
    res.redirect("/daily");
  } catch (e) {
    res.status(404).send({
      message: `Could not delete task ${id}.`,
    });
  }
};

exports.deleteWeekly = async (req, res) => {
  const id = req.params.id;
  try {
    await Task.findByIdAndRemove(id);
    res.redirect("/weekly");
  } catch (e) {
    res.status(404).send({
      message: `Could not delete task ${id}.`,
    });
  }
};