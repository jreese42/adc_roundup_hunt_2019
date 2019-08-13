//Init Sequelize for this file
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'adcHuntDb.sqlite'
  });

  //validating communcation to the database 
  sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  //defining the user table columns
  let user = sequelize.define('user', {
    userId: {type: Sequelize.INTEGER, primaryKey: true},
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    displayNameFormat: Sequelize.ENUM('FirstName LastName', 'FirstInitialLastName', 'Anonymous'),
    cookie: Sequelize.STRING,
    solution1: Sequelize.BOOLEAN,
    solution2: Sequelize.BOOLEAN,
    solution3: Sequelize.BOOLEAN,
    solution4: Sequelize.BOOLEAN,
    solution5: Sequelize.BOOLEAN,
    solution6: Sequelize.BOOLEAN,
    solution7: Sequelize.BOOLEAN,
    solution8: Sequelize.BOOLEAN,
    solution9: Sequelize.BOOLEAN,
    prizeLevel: Sequelize.ENUM('none', 'bluesticker', 'yellowsticker', 'starsticker'),
    score: Sequelize.INTEGER,
    hasClaimedSticker: Sequelize.BOOLEAN,
  });

  //adding fake users to the databases
  //DEV ONLY - REMOVE
  let users = [
      {userId: 1, firstName: 'Sam', lastName: 'Mendis', displayNameFormat:'Anonymous', cookie:"none",  solution1: 0, solution2: 0, solution3: 0, solution4: 0, solution5: 0, solution6: 0, solution7: 0, solution8: 0, solution9: 0,  prizeLevel: 'none',score: 0, hasClaimedSticker: 0},
      {userId: 2, firstName: 'Bob', lastName: 'TheBuilder',displayNameFormat:'Anonymous', cookie:"none",solution1: 0, solution2: 0, solution3: 0, solution4: 0, solution5: 0, solution6: 0, solution7: 0, solution8: 0, solution9: 0, prizeLevel: 'none',score: 0, hasClaimedSticker: 0},
      {userId: 3, firstName: 'Clark', lastName: 'Kent',displayNameFormat:'Anonymous', cookie:"none", solution1: 0, solution2: 0, solution3: 0, solution4: 0, solution5: 0, solution6: 0, solution7: 0, solution8: 0, solution9: 0, prizeLevel: 'none',score: 0, hasClaimedSticker: 0},
      {userId: 4, firstName: 'John', lastName: 'Smith',displayNameFormat:'Anonymous', cookie:"none", solution1: 0, solution2: 0, solution3: 0, solution4: 0, solution5: 0, solution6: 0, solution7: 0, solution8: 0, solution9: 0, prizeLevel: 'none',score: 0, hasClaimedSticker: 0},
      {userId: 5, firstName: 'Jane', lastName: 'Joe',displayNameFormat:'Anonymous', cookie:"none", solution1: 0, solution2: 0, solution3: 0, solution4: 0, solution5: 0, solution6: 0, solution7: 0, solution8: 0, solution9: 0, prizeLevel: 'none',score: 0, hasClaimedSticker: 0},
     ];
  sequelize.sync({force:true}).then(() => {
    user.bulkCreate(users, {validate: true}).then(()=>{ 
    console.log('added row created');
  }).catch((error)=> {
    console.log('failed to create notes');
    console.log(err);
  });
});

async function deleteUser(id) {
    let n = await user.destroy({ where: { userId: id } });
    console.log(`number of deleted rows: ${n}`);
}
//NOTE: SLM need to create this function 
async function createUser(fName, lName) {
  //let n = await user.createUser({ where: { userId: id } });
  console.log(`created new user: ${n}`);
}

//findUserbyPK
async function getUserFromDatabase( userId) {
    const row = user.findByPk(userId);
        console.log(row.firstName);
    return row;
}

  module.exports = 
{
// external function to remove a row
deleteUser: (userId) => 
    {
        console.log("Deleting row");
        deleteUser(userId);
    },
// external function to remove a row
createUser: (firstName, lastName) => 
    {
        console.log("creating new user in the database");
        createUser(firstName, lastName);
    },
// external functions to get a row from the database
getUser: (userId) => 
    {
        console.log("getting user from database");
        return getUserFromDatabase(userId);
    },  
// external function to remove a row
/*deleteBlogPost: (blogId) => 
    {
        console.log("Deleting row");
        //deleteBlogPost(blogId);
    },
// external function to create a row
createBlogPost: () => 
    {
        console.log("creating new user in the database");
        //createBlogPost();
    },
// external functions to get a row from the database
getBlogPost: (blogId) => 
    {
        console.log("getting blog post");
        return getBlogPostFromDatabase(blogId);
    },*/  
};