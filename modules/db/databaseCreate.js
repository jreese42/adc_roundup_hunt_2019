
var blog1 = 'INSERT INTO blog ( event_id, title , image_string, template) VALUES ( 1, "title_1", "image_1.png", "template_1.pug"),\
                                                                                 ( 2, "title_2", "image_2.png", "template_2.pug")'
module.exports = 
{
    createDatabase: () => 
    {        
        const sqlite3 = require('sqlite3').verbose();
        //connecting to database
        let db = new sqlite3.Database('adcHuntDb.db', (err) => {
            if (err) 
            {
                console.error(err.message);
            } 
            else 
            {
                console.log('connected to database');
            }
        })
        // running commands to database
        //
        db.run('CREATE TABLE blog ( event_id INTEGER PRIMARY KEY, title TEXT NOT NULL, image_string TEXT NOT NULL, template text NOT NULL)', function(err) 
        {
           if (err) 
           {
             return console.log(err.message);
           }
           else
           {
            console.log(`added`);
           }
        });
        db.run(blog1, function(err)
        {
            if (err) 
            {
              return console.log(err.message);
            }
            else
            {
             console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
         });
        db.run(`INSERT INTO blog(event_id) VALUES(?)`, ['1'], function(err) 
        {
           if (err) 
           {
             return console.log(err.message);
           }
           else
           {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
           }
        });
        // 
        db
        // close the database connection
        console.log("close DB");
        db.close((err) => 
        {
           if (err) 
           {
               return console.error(err.message);
           }
           else
           {
               console.log('Close the database connection.');
           }
        });
    },

    printLog: () => 
    {
        console.log("within database page");
    }
};



