const express = require('express')
const app = express();
const port = process.env.PORT;
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
var path = require('path');
var cors = require('cors')
const morgan = require('morgan'); // Importa morgan

// To access public folder
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(morgan('dev'));

// Set up Global configuration access
dotenv.config();

// MULTER
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    let uploadFile = file.originalname.split('.');
    let name = `${uploadFile[0]}-${Date.now()}.${uploadFile[uploadFile.length - 1]}`;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

const { register, login, updateUser, deleteUser, userById, resetPassword } = require("./controllers/auth/auth");
const { addProduct, updateProduct, deleteProduct, getAllProducts } = require("./controllers/products/products")
const { checkout, addToCart, cart, removeFromCart } = require("./controllers/user/cart")
const { isAdmin, checkAuth } = require("./controllers/middlewares/auth");
const { dashboardData, getAllUsers } = require('./controllers/admin/dashboard');
const { getAllOrders, changeStatusOfOrder } = require('./controllers/admin/orders');
const { orders } = require('./controllers/user/orders');
const { addCategory, getCategories, updateCategory, deleteCategory } = require('./controllers/categories/category');
const { addToWishlist, wishlist, removeFromWishlist } = require('./controllers/user/wishlist');
const mongoose = require("./config/database")()


app.get('/', (req, res) => {
  res.send('Hello World!')
});


// AUTH
app.post('/register', register);
app.post("/login", login)


// User Routes
app.post("/update-user", updateUser)
app.get("/user", userById)
app.get("/delete-user", deleteUser)
app.post("/reset-password", resetPassword)


// Products
app.post("/product", [isAdmin], addProduct)
app.get("/products", getAllProducts)
app.post("/update-product", [isAdmin], updateProduct)
app.get("/delete-product", [isAdmin], deleteProduct)


// CATEGORIES
app.post("/category", [isAdmin], addCategory)
app.get("/categories", getCategories)
app.post("/update-category", [isAdmin], updateCategory)
app.get("/delete-category", [isAdmin], deleteCategory)


// ORDERS
app.get("/orders",[checkAuth],orders)

// CHECKOUT
app.post("/checkout",[checkAuth],checkout)

// WISHLIST
app.post("/add-to-wishlist",[checkAuth],addToWishlist)
app.get("/wishlist",[checkAuth],wishlist)
app.get("/remove-from-wishlist",[checkAuth],removeFromWishlist)

// ADMIN
app.get("/dashboard",[isAdmin],dashboardData)
app.get("/admin/orders",[isAdmin],getAllOrders)
app.get("/admin/order-status",[isAdmin],changeStatusOfOrder)
app.get("/admin/users",[isAdmin],getAllUsers)

// HELPER
app.post('/photos/upload', upload.single('image'), function (req, res) {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file,);
    if (!req.file) {
      return res.status(400).json({ err: 'Please send an image', msg: 'Please send an image' });
    }

    // La imagen se ha cargado con éxito, puedes acceder a la información de la imagen en req.file
    const imageFileName = req.file.filename;

    // Aquí puedes procesar la imagen, que se ha guardado en la carpeta "public/uploads"

    // Por ejemplo, puedes guardar la ruta de la imagen en una base de datos.

    // Luego, puedes responder con un mensaje de éxito
    return res.json({ message: 'Image uploaded successfully', filename: imageFileName });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});