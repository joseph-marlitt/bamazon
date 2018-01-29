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

  function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add Products to Inventory",
          "Add New Products"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View Products for Sale":
            productsForSale();
            break;
  
          case "View Low Inventory":
            // multiSearch();
            break;
  
          case "Add Products to Inventory":
            updateInventory();
            break;
  
          case "Add New Products":
            // songSearch();
            break;
        }
      });
  }

function updateInventory(){
    displayTable();
    connection.query("SELECT * FROM products", function(err, res) {
//         var table = new Table({
//         head: ['ID', 'PRODUCT NAME', 'DEPARTMENT NAME','PRICE', 'QUANTITY'],
//         colWidths: [5, 18, 20, 10, 12]
//      });
//         if (err) throw err;
//         for (i = 0; i < res.length; i++){
//             table.push(
//                 [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
//             );
//         };
//     console.log("------------------------------")
//     console.log(table.toString());
// });
    inquirer
      .prompt([
    {
        name: "product",
        type: "input",
        message: "Enter the ID of the product you would like to update",
        // validate: function(value){
        //     if(isNaN(value) == false){
        //       return true;
        //     } else{
        //         console.log("Please use a valid input")
        //       return false;
        //     }
        //   }
    },
    {
        name: "quantity",
        type: "input",
        message: "Restock amount",
        validate: function(value){
            if(isNaN(value) == false){
              return true;
            } else{
                console.log("Please use a valid input")
              return false;
            }
          }
    }]).then(function(answer) {
        var chosenProduct = (answer.product) -1;
        var amountChosen = parseInt(answer.quantity);
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                stock_quantity: (res[chosenProduct].stock_quantity + amountChosen)
                },
                {
                item_id: answer.product 
                }
              ],
        //   connection.end();
            )
            console.log("------------------------------------------")
                console.log(res[chosenProduct].product_name + " successfully updated!");
                console.log("Updated " + (res[chosenProduct].product_name) + " by " + amountChosen);
                console.log("The current stock of " + (res[chosenProduct].product_name) + " is " + (res[chosenProduct].stock_quantity));
                console.log("------------------------------------------")
                restartOption();
            });
    });
};

function productsForSale() {
    connection.query("SELECT * FROM products", function(err, res) {
        var table = new Table({
        head: ['ID', 'PRODUCT NAME', 'DEPARTMENT NAME','PRICE', 'QUANTITY'],
        colWidths: [5, 18, 20, 10, 12]
     });
        if (err) throw err;
        for (i = 0; i < res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        };
    console.log(table.toString());
    runSearch();
    });
};
runSearch();

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
};

function restartOption (){
    inquirer
    .prompt({
      name: "postOrBid",
      type: "list",
      message: "Would you like to manage anything else?",
      choices: ["Yes, I need to continue working", "No thank you"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid.toUpperCase() === "Yes, I need to continue working") {
        runSearch();
      }
      else {
        connection.end();
      }
    });
}