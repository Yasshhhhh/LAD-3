const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);
const url = "mongodb+srv://YashA:123@mlbd.tmzqfea.mongodb.net/users?retryWrites=true&w=majority";
async function connectToDatabase() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to user database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();
const PORT = process.env.PORT || 5000;
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
