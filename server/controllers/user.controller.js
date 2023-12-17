const User = require("../models/user.model");
const brain = require("brain.js");
const jwt = require("jsonwebtoken");

const net = new brain.NeuralNetwork({ 
  activation: 'sigmoid',
  learningRate: 0.01,
});

let Data = [
  { T1: 10, T2: 12, T3: 20 },
  { T1: 8,  T2: 15, T3: 25 },
  { T1: 14, T2: 9,  T3: 30 },
  { T1: 17, T2: 7,  T3: 18 },
  { T1: 13, T2: 16, T3: 28 },
  { T1: 11, T2: 7,  T3: 22 },
  { T1: 16, T2: 18, T3: 17 },
  { T1: 6,  T2: 14, T3: 27 },
  { T1: 9,  T2: 10, T3: 16 },
  { T1: 18, T2: 8,  T3: 33 },
  { T1: 12, T2: 11, T3: 19 },
  { T1: 15, T2: 17, T3: 26 },
  { T1: 7,  T2: 13, T3: 15 },
  { T1: 10, T2: 16, T3: 21 },
  { T1: 8,  T2: 14, T3: 32 },
  { T1: 14, T2: 6,  T3: 16 },
  { T1: 17, T2: 15, T3: 29 },
  { T1: 13, T2: 18, T3: 23 },
  { T1: 11, T2: 12, T3: 18 },
  { T1: 16, T2: 7,  T3: 30 },
  { T1: 6,  T2: 11, T3: 19 },
  { T1: 9,  T2: 9,  T3: 22 },
  { T1: 18, T2: 13, T3: 15 },
  { T1: 12, T2: 16, T3: 24 },
  { T1: 15, T2: 10, T3: 20 },
  { T1: 7,  T2: 14, T3: 28 },
  { T1: 10, T2: 12, T3: 18 },
  { T1: 8,  T2: 15, T3: 27 },
  { T1: 14, T2: 9,  T3: 16 },
  { T1: 17, T2: 7,  T3: 25 },
  { T1: 13, T2: 16, T3: 20 },
  { T1: 11, T2: 7,  T3: 29 },
];
const trainingData = Data.map(user => ({
  input: { T1: user.T1, T2: user.T2 },
  output: { T3: user.T3 },
}));
net.train(trainingData);
// net.train(trainingData);

// const trainingData = async ()=>
// {
//   const users = await User.find({});
//   // console.log(users);
//   const trainingData = users.map(user => ({
//       input: { T1: user.T1, T2: user.T2 },
//       output: { T3: user.T3 },
//     }));
//   net.train(trainingData);
// }
// trainingData();
async function predictT3(req, res) 
{
  try {
      // const { T1, T2 } = req.body;
    // const users = await User.find({});
    // console.log(users);
    // const trainingData = users.map(user => ({
    //     input: { T1: user.T1, T2: user.T2 },
    //     output: { T3: user.T3 },
    //   }));
    // // net.train(trainingData);
    const T1=req.query.T1;
    const T2=req.query.T2;
    // const T1=10;
    // const T2=13;
    
    if (!T1 || !T2) {
        return res.status(400).json({ error: "T1 and T2 are required for prediction." });
      }
      net.train(trainingData);
      const prediction = net.run({ T1, T2 });
      const predictedT3 = prediction.T3;
     
      // console.log(({T1:T1,T2:T2,T3Prediction: predictedT3*(T1+T2)/40*35 })); 
      const normalizer= (+T1 + +T2)*35/40;
      console.log(T1,T2,predictedT3,normalizer,predictedT3*normalizer);
      res.json({T1:T1,T2:T2,T3Prediction: predictedT3*normalizer });
    } catch (error) {
      console.error('Error predicting T3:', error);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
}

async function getUser(req, res) {
  try {
    const Name = req.query.studentName;
    const email = req.query.studentMail;

    const user = await User.findOne({ Name: Name });

    if (!user) {
      console.log(`${Name} Not found`);
      return res.send("");
    }

    const token = jwt.sign(
      { name: email },
      "YourSecretKey"
    );

    return res.json({ token, userData: user });
  } catch (error) {
    console.error('Error in /getd:', error);
    return res.status(500).send('Internal Server Error');
  }
}

async function rankUsersByT1(req, res) {
  try {
    const users = await User.find({});
    const sortedUsers = users.sort((a, b) => b.T1 - a.T1);
    const rankedUsers = sortedUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));
    res.json(rankedUsers);
  } catch (error) {
    console.error('Error ranking users by T1 marks:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function rankUsersByT2(req, res) {
  try {
    const users = await User.find({});
    const sortedUsers = users.sort((a, b) => b.T2 - a.T2);
    const rankedUsers = sortedUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));
    res.json(rankedUsers);
  } catch (error) {
    console.error('Error ranking users by T2 marks:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function rankUsersByT3(req, res) {
  try {
    const users = await User.find({});
    const sortedUsers = users.sort((a, b) => b.T3 - a.T3);
    const rankedUsers = sortedUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));
    res.json(rankedUsers);
  } catch (error) {
    console.error('Error ranking users by T3 marks:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    // console.log(users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = {
  predictT3,
  getUser,
  rankUsersByT1,
  rankUsersByT2,
  rankUsersByT3,
  getAllUsers,
};
