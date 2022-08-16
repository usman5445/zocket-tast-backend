const { json } = require("express");
const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;
app.use(json());

//connection to the database
mongoose
  .connect(DB_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

//schema and model for campaigns
const schema = new mongoose.Schema(
  {
    isOn: Boolean,
    campaignName: String,
    campaignImg: String,
    dateRange: String,
    clicks: Number,
    budget: Number,
    location: String,
    platform: String,
    status: String,
    productId: String,
  },
  { timestamps: true }
);
const Campaign = mongoose.model("Campaign", schema);

//schema and model for products
const Products = mongoose.model("Products", {
  name: String,
  imgUrl: String,
  price: Number,
});

app.get("/", (req, res) => {
  res.send("Zocket-Backend");
});

//get all products
app.get("/products", (req, res) => {
  Products.find({})
    .then((products) => res.send(products))
    .catch((err) => res.status(404).send(err));
});

//create new product
app.post("/products", (req, res) => {
  const product = new Products({ ...req.body });
  product
    .save()
    .then((resp) => res.send({ resp }))
    .catch((err) => res.status(404).send(err));
});

//get all campaigns
app.get("/campaigns", (req, res) => {
  Campaign.find({})
    .then((campaigns) => res.send(campaigns))
    .catch((err) => res.status(404).send(err));
});

//create new campaign
app.post("/campaigns", async (req, res) => {
  const product = await Products.findById(req.body.productId);

  const campaign = new Campaign({
    ...req.body,
    campaignName: `${product.name} Campaign`,
    campaignImg: product.imgUrl,
  });
  campaign
    .save()
    .then((resp) => res.send({ resp }))
    .catch((err) => res.status(404).send(err));
});

//update campaign
app.put("/campaigns/:campaignId", (req, res) => {
  Campaign.findByIdAndUpdate(req.params.campaignId, { ...req.body })
    .then((resp) => res.send(resp))
    .catch((err) => {
      res.status(404).send(err);
    });
});

//delete campaign
app.delete("/campaigns/:campaignId", (req, res) => {
  Campaign.findByIdAndDelete(req.params.campaignId)
    .then((resp) => res.send(`${req.params.campaignId} deleted successfully`))
    .catch((err) => {
      res.status(404).send(err);
    });
});
//listning to the server
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
