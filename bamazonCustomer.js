var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
  });
  connection.connect(function(err) {
    if (err) throw err;
  });

function displayTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        var table = new Table({
        head: ['ID', 'PRODUCT NAME','PRICE', 'QUANTITY'],
        colWidths: [5, 18, 10, 12]
     });
        if (err) throw err;
        for (i = 0; i < res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
            );
        };
    console.log(table.toString())
    });
startFunction();
};

function restartOption (){
    inquirer
    .prompt({
      name: "postOrBid",
      type: "list",
      message: "Would you like to make another purchase?",
      choices: ["I need more stuff!", "No more gold :("]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid.toUpperCase() === "MOAR SHOPPING") {
        displayTable();
      }
      else {
        connection.end();
      }
    });
}

function startFunction(){
    connection.query("SELECT * FROM products", function(err, res) {
inquirer.prompt([
    {
        type: 'input',
        name: 'product',
        message: "\nTell us the ID of the product you would like to purchase.\n",
        validate: function(value){
            if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
              return true;
            } else{
                console.log("Please use a valid input")
              return false;
            }
          }
    } ,
    {
        type: 'input',
        name: 'quantity',
        message: "\nQuantity desired.\n",
        validate: function(value) {
            if (isNaN(value) === false) { 
              return true;
            }
            console.log("Please use a valid ID")
            return false;
          }
    }  
    ]).then(function(answer){
        var chosenProduct = (answer.product) -1;
        var amountChosen = parseInt(answer.quantity);

        if ((res[chosenProduct].stock_quantity) >= parseInt(answer.quantity)){
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                stock_quantity: (res[chosenProduct].stock_quantity - amountChosen)
                },
                {
                item_id: answer.product 
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("------------------------------------------")
                console.log(res[chosenProduct].product_name + " successfully purchased!");
                console.log("Your total is : $" + ((res[chosenProduct].price) * amountChosen));
                console.log("------------------------------------------")
                restartOption();
              }
            );
        } else {
            console.log("------------------------------------------")
            console.log("\nSorry, we do not have enough stock to complete your request.\n")
            console.log("------------------------------------------")
            restartOption();
            return false;
        }
        });
    });
};
displayTable();