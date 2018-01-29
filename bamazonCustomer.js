var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
  });

function displayTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        var table = new Table({
        head: ['ID', 'PRODUCT NAME','PRICE', 'QUANTITY']
      , colWidths: [5, 25, 17, 5]
     });
        if (err) throw err;
        for (i = 0; i < res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
            )
        };
        console.log(table.toString())
        
    });
startFunction();
}


function startFunction(){
inquirer.prompt([
    {
        type: 'input',
        name: 'product',
        message: "\nTell us the ID of the product you would like to purchase.\n",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            console.log("Please use a valid ID")
            return false;
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
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                  item_id: parseInt(answer.product)
                },
                {
                  stock_quantity: "-" + parseInt(answer.quantity)
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Item successfully purchased!");
                displayTable();
              }
        );
        
        
        //   runSearch();
        });
     
     
    };
  
// function multipleAppearances() {
//     connection.query("SELECT artist FROM music GROUP BY artist HAVING COUNT(*) > 1", function(err, res) {
//         if (err) throw err;
//       console.log(res);
//       connection.end();
//     });
//     console.log(answers);
// }

// function byArtist(answers) {
//     console.log(answers )
//     connection.query("SELECT * FROM music WHERE artist =?", answers, function(err, res) {
//         if (err) throw err;
//             console.log(res);
//             connection.end();
//     });
//     console.log(answers);
// }
displayTable();
// startFunction();