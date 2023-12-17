const Teacher = require('../models/teacher.model');
var jwt = require('jsonwebtoken');
const JWT_SECRET="a66424313d590e5a33f60bc8bcb1924302e2687e970c464a9b9060587e3217a85788617c4bc34fd452a56cb31c4ac8db8686f15d9c2f9c0b4ea7752e4e1dfe20";

const teacherController = {
  login: async (req, res) => {
    const user = await Teacher.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(req.body);
    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
          password: user.password,
        },
        JWT_SECRET
      );
      return res.json({ status: "ok", user: token });
    } else {
      return res.json({ status: "error", user: false });
    }
  },
};

module.exports = teacherController;
