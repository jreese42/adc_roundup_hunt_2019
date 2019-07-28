//Init Sequelize for thi file
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'adcHuntDb.sqlite'
  });

  sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  /*.finally(() => {
    sequelize.close();
  });*/

  var Foo = sequelize.define('foo', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING
 
  });


  let user = sequelize.define('user', {
    userId: {type: Sequelize.INTEGER, primaryKey: true},
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    Puzzle1: Sequelize.BOOLEAN,
    Puzzle2: Sequelize.BOOLEAN,
  });

  let users = [
      {userId: 1, firstName: 'Sam', lastName: 'Mendis'},
      {userId: 2, firstName: 'Bob', lastName: 'TheBuilder'},
      {userId: 3, firstName: 'Clark', lastName: 'Kent'},
      {userId: 4, firstName: 'John', lastName: 'Smith'},
      {userId: 5, firstName: 'Jane', lastName: 'Joe'},
  ];

  sequelize.sync({force:false}).then(() => {
    user.bulkCreate(users, {validate: true}).then(()=>{ 
    console.log('added row created');
  }).catch((error)=> {
    console.log('failed to create notes');
    console.log(err);
  });
 

   user.findOne({ where: { userId: 1 } }).then(user => {
    console.log(user.get({ plain: true }));
    })
});

async function countRows() {

    let n = await user.count();
    console.log(`There are ${n} rows`);
}

async function deleteRow(id) {
    let n = await user.destroy({ where: { userId: id } });
    console.log(`number of deleted rows: ${n}`);
}


async function updateRow( firstName) {
    let id = await user.update(
        { firstName: firstName.toString() },
        { where: { userId: 1 } });
}


//findUserbyPK
async function getRow( userId) {
    const row = user.findByPk(userId);
        //console.log("help!");
        console.log(row.firstName);
    return row;
}



  module.exports = 
{
deleteRow: (userId) => 
    {
        console.log("hi");
        deleteRow(userId);
    },
countRow: () => 
    {
        console.log("counting rows");
        countRow();
    },
updateUserSolvedPuzzleOne: (userId) => 
    {
        console.log("User solved Solution 1");
        updateRow(userId);
    },
hi: () => 
    {
        console.log("help!");
        return getRow(1);
    },
getUserRealName: (userId) => 
    {
        console.log("help!");
        var realName = getRow(userId).then( user => {
            return user.firstName + " " + user.lastName;
        });
        return "Name: " + realName;
    },
saveUser: (userObj) => 
    {
        console.log("saving user");
        
    }

    
};