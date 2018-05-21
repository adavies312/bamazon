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

function start() {
    console.log("ITEMS FOR SALE");
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) {
            throw err;
        }
        data.forEach(function (row) {
            console.log(`${row.item_id}: ${row.product_name} - ${row.price}`);
        })
        shopping();
        // console.log(data);
    })
};




function shopping() {
    inquirer.prompt([
        {
            name: "item",
            message: "Please enter the item number of the product you want to buy",
            type: "input"
        }, {
            name: "quantity",
            message: "Please enter the number of units you would like to buy",
            type: "input"
        }
    ]).then (function (answers){
        var quantityDesired = answers.quantity;
        var productID = answers.item;
        // purchase(productID, quantityDesired);
        connection.query("SELECT * FROM products WHERE item_id=?", answers.item, function(err, data){
            if(err){
                throw err;
            }

            data.forEach(function (row) {
                // console.log(`${row.item_id}: ${row.product_name} - ${row.price} - ${row.stock_quantity}`);
                if (quantityDesired <= row.stock_quantity){
                    // console.log("Oh baby weeeee, we've got what you need");
                        quantityLeft = row.stock_quantity - quantityDesired
                    connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [quantityLeft, productID], function (err, data){
                        if (err){
                            throw err;
                        } console.log("Your Total Price is $" + row.price * quantityDesired);
                        start();

                    });
                } else {
                    console.log("Insufficient Quantity. Check Back Later");
                    start();
                }
            })
    
            // if(quantityDesired <= stock_quantity){
            //     console.log("We Have What You Need");
            // }
        })
    });
};


