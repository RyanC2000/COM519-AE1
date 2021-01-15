const Thought = require("../models/Thought");

// CREATE
exports.create = async (req, res) => {   
  console.log(req);
  let thought = new Thought({ text: req.body.thought, user_id: req.session.userID}); 
  try {
   await thought.save();
   res.redirect('/thoughts/?message=Thought has been created. ')
 } catch (e) {
  console.log(e.errors);
  res.render('thoughts', { errors: e.errors })
  return;
  };
}

// RETRIEVE 
exports.list = async (req, res) => {
  try {
    console.log(req.query);
    const message = req.query.message;
    const thoughts = await Thought.find({ "user_id" : req.session.userID});
    res.render('thoughts', { thoughts: thoughts, message: message });
  } catch (e) {
    res.status(404).send({ message: "Could not list thoughts. " });
  }
};

// UPDATE
exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const thought = await Thought.findById(id);
    if (!thought) throw Error('Cannot retrive thought. ');
    res.render('edit-thought', {
      thought: thought,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('edit-thought', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `Could not find thought ${id}`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const thought = await Thought.updateOne({ _id: id }, req.body);
    res.redirect('/thoughts/?message= Thought has been updated. ');
  } catch (e) {
    res.status(404).send({
      message: `Could not find thought ${id}.`,
    });
  }
};

//DELETE
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Thought.findByIdAndRemove(id);
    res.redirect("/thoughts");
  } catch (e) {
    res.status(404).send({
      message: `Could not delete thought ${id}.`,
    });
  }
};




