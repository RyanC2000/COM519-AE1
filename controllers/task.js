const Task = require("../models/Task");
const moment = require("moment");

// CREATE
exports.create = async (req, res) => {
  console.log(req);
  let task = new Task({ text: req.body.task_description, deadline: req.body.deadline, user_id: req.session.userID });
  try {
    await task.save();
    res.redirect('add-task')
  } catch (e) {
    console.log(e.errors);
    res.render('add-task', { errors: e.errors })
    return;
    };
  }

// RETRIEVE 
exports.listDaily = async (req, res) => {
  try {
    console.log(req.query);
    const message = req.query.message;
    var startOfToday = moment().startOf('day').toDate();
    var endOfToday = moment().endOf('day').toDate();
    //console.log(startOfToday);
    //console.log(endOfToday);
    const tasks = await Task.find( {$and: [ { "deadline": { $gte: startOfToday, $lte: endOfToday }}, { "user_id" : req.session.userID} ]});
    res.render('daily', { tasks: tasks, message: message });
  } catch (e) {
    res.status(404).send({ message: "Could not list tasks. " });
  }
};

exports.listWeekly = async (req, res) => {
  try {
    console.log(req.query);
    var startOfWeek = moment().startOf('isoWeek').toDate();
    var endOfWeek = moment().endOf('isoWeek').toDate();
    //console.log(startOfWeek);
    //console.log(endOfWeek);
    const message = req.query.message;
    const tasks = await Task.find( {$and: [{ "deadline": { $gte: startOfWeek, $lte: endOfWeek } }, { "user_id" : req.session.userID}]});
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