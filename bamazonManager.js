var mysql = require("mysql");
//Connect to Inquirer
var inquirer = require("inquirer");

//Connec to Figlet
var figlet = require('figlet');


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    figlet('WELCOME TO BAMAZON!', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        start();

    });
})

function start(){
    inquirer.prompt([
        {
            name: "action",
            message: "Please select an option",
            type: "list",
            choices: ["View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit"]

        }
    ]).then(function(response){
        switch(response.action){
            case "View Products for Sale":
            viewAllProducts();
            break;
            case "View Low Inventory":
            viewLowInventory();
            break;
            case "Add to Inventory":
            addToInventory();
            break;
            case "Add New Product":
            addNewProduct();
            break;
            default:
            connection.end();
            break;
        }
    })
}

function viewAllProducts(){
    connection.query("SELECT * FROM products", function (err, data){
        if (err){
            throw err;
        }
        data.forEach(function(row){
            console.log(`${row.item_id}: ${row.product_name} - Price: $${row.price} - Quantity: ${row.stock_quantity}`)
        })
        start();
    })
}

function viewLowInventory (){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, data){
        if (err){
            throw err;
        }
        console.log("Items in Inventory with Less Than 5 in Stock:")

        data.forEach(function(row){
            console.log(`${row.product_name} - Quantity: ${row.stock_quantity}`)
        })
        start();
    })
}

function addToInventory (){
        connection.query("SELECT * FROM products", function (err, data) {
          var productName = data.map(function (row) {
            return row.product_name;    
          });
          var quantity =data.stock_quantity;
      
          inquirer.prompt([
            {
              name: "product",
              message: "Pick a Product to Add More Inventory",
              choices: productName,
              type: "list"
            }
          ]).then(function (answers) {
            inquirer.prompt([
              {
                name: "quantity",
                message: "Please enter a new quantity",
                type: "input"
              }
            ]).then(function(response){
                var newQuantity = answers.quantity;
                var productID = answers.product;
                var updatedQuantity = newQuantity + quantity
                console.log(answers.quantity)
              connection.query("UPDATE products Set stock_quantity =? Where item_id=?", [updatedQuantity, productID],function (err, data){
                console.log(`${answers.product} has been changed to ${updatedQuantity}`)
                start();
              });
            })
          })
        });
}

function addNewProduct (){
    inquirer.prompt([
        {
            name: "product",
            message: "Enter the Name of the Product You Want to Add",
            type: "input"
        }, {
            name:"price",
            message:"Enter the Price",
            type: "input"
        }, {
            name: "quantity",
            message: "Enter the Quantity of Product",
            type:"input"
        }, {
            name:"department",
            message: "Enter the Department",
            type:"input"
        }
    ]).then(function(response){
        connection.query("INSERT INTO products SET ?", [{
            product_name: response.product,
            price: response.price,
            department_name: response.department,
            stock_quantity: response.quantity
         }], function (err, data){
            if (err){
                throw err;
            }
            console.log("Your Inventory has Been Updated");
            start();
        })
    })
}