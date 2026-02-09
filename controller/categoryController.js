const CategoryModel = require("../models/categoryModel");

// add category
exports.addCategory = async (req, res) => {
  let categoryExists = await CategoryModel.findOne({
    category_name: req.body.category_name,
  });
  if (categoryExists) {
    return res.status(400).json({ error: "Category already exists" });
  }

  let newCategory = await CategoryModel.create({
    category_name: req.body.category_name,
  });

  if (!newCategory) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(newCategory);
};

//get all categories
exports.getAllCategories = async (req, res) => {
  let categories = await CategoryModel.find();
  if (!categories) {
    return res.status(400).json({ error: "Something is wrong" });
  }
  res.send(categories);
};

//get category details
exports.getCategoryDetails = async (req, res) => {
  let category = await CategoryModel.findById(req.params.id);
  if (!category) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(category);
};

//update catogory
exports.updateCategory = async (req, res) => {
  let categoryToUpdate = await CategoryModel.findByIdAndUpdate(
    req.params.id,
    {
      category_name: req.body.category_name,
    },
    { new: true }
  );
  if (!categoryToUpdate) {
    return res.status(400).json({ error: "somrthing went wrong" });
  }
  res.send(categoryToUpdate);
};

//delete catogory
exports.deleteCategory = (req, res) => { 
  CategoryModel.findByIdAndDelete(req.params.id)
    .then((deleteCategory) => {
      if (!deleteCategory) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.send({ message: "Category deleted Succesfully" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};




/*
CRUD 

1. CREATE - modelname.create(new obj)

2.REtrive - modelname.find({}) - all data
 modelname.findById(id) - single data
    modelname.findOne(filter object) - single data
    modelname.findOne() - first data


3. UPDATE - modelname.findByIdAndUpdate(id,update obj,options) 
    id-> id of the data to be updated
    update obj -> what to update
    options -> {new:true} - return updated data

    4. DELETE - modelname.findByIdAndDelete(id) - delete data by id - removes the data from the database with given id 



    // to get data from user
req.body - data is passed using body of a form
    body: (category_name:"xyz")

    req.params - data is passed through url
    profile/abc

    req.query - data is passed through url using variable 
    search?q=apple&q2=ball



    //
    res.json(json_object) - data in form of json
    res.send(result) - return result whcih can be string object boolean 


    //
    status code(optional) 
    it gives default as 200 OK
                        400 bad request
                        404 not found
                        500 server error
                        401 authorization error
                        403 unauthorized error



    */
