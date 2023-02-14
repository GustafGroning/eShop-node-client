const express = require('express');
const { db } = require('./database.js');
const mongoose = require('mongoose');


const Product = require('./models/Product.js');


const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/api/users', async (req, res) => {
  const client = await connectToDatabase();
  const collection = client.db('horrible_choices').collection('adjectives');
  const users = await collection.find().toArray();
  res.send(users);
});

// Get all products
app.get('/api/products', (req, res) => {
  Product.find({})
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving products');
    });
});

// Get a product by ID
app.get('/api/products/:id', (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Product not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving product');
    });
});

// Add a new product to the collection
app.post('/api/products', async (req, res) => {
  const { name, price, company_id } = req.body;
  const newProduct = new Product({ name, price, company_id });
  console.log(newProduct);
  try {
    const savedProduct = await newProduct.save();
    console.log(savedProduct);
    res.send(savedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Delete a product from the collection
app.delete('/api/products/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        res.sendStatus(204);
      } else {
        res.status(404).send('Product not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting product');
    });
});

app.get('/add-product', (req, res) => {
  res.sendFile('html/add-product.html', { root: __dirname });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
