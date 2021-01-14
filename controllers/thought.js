const Thought = require("../models/Thought");

exports.list = async (req, res) => {
  try {
    console.log(req.query);
    const message = req.query.message;
    const tasks = await Task.find({});
    res.render('thoughts', { thoughts: thoughts, message: message });
  } catch (e) {
    res.status(404).send({ message: "Could not list thoughts. " });
  }
};

exports.create = async (req, res) => {   
  console.log(req);
  let thought = new Thought({ }); 
  try {
   await thought.save();
   res.redirect('/thoughts/?message=Thought has been created. ')
 } catch (e) {
   return res.status(400).send({
     message: JSON.parse(e),
   });  
 }
}

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




exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const countries = await Country.find({});
    const tasters = await Taster.find({});
    const regions = await Region.find({});
    const tasting = await Tasting.findById(id);
    if (!tasting) throw Error('cant find tasting');
    res.render('update-tasting', {
      regions: regions,
      tasting: tasting,
      countries: countries,
      tasters: tasters,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('thoughts', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find taster ${id}`,
    });
  }
};