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
        head: ['ID', 'PRODUCT NAME','PRICE']
      , colWidths: [5, 20, 17, 7, 10, 14]
     });
        if (err) throw err;
        for (i = 0; i < res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price]
            )
        };
        console.log(table.toString())
    });
}

function startFunction(){
inquirer.prompt([
    {
        type: 'input',
        name: 'product',
        message: "\nTell us the ID of the product you would like to purchase.\n"
        // choices: [
        //     "Purchase an item",
        //     new inquirer.Separator(),
        //     "Search by top appearances more than once",
        //     new inquirer.Separator(),
        //     "Search by date range (for exampe 1990 and 2007)",
        //     new inquirer.Separator()
        // ]
    } ,
    {
        type: 'input',
        name: 'quantity',
        message: "\nQuantity desired.\n",

    }  
    ]).then(answers => {
    if (answers.choice === "Search by artist"){
        inquirer.prompt([
        {
           type: "input",
            name: "artist",
            message: "Which artist would you like to search by?" 
        }   
        ]).then(answers => {
        //    byArtist(answers.artist); 
        })   
    }
    else if (answers.choice === "Search by top appearances more than once"){
                console.log("search");
                // multipleAppearances();
            }   
    });
}
  
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
startFunction();