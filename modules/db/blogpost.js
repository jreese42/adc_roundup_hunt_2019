const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlogPost extends Sequelize.Model {};
  BlogPost.init({
    blogId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    releaseTime: DataTypes.DATE,
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    imagePath: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    author: DataTypes.STRING,
    text: DataTypes.STRING,
    text: {
        type: DataTypes.STRING,
        set(text) {
            this.setDataValue('text', text);
            this.setDataValue('teaserText', text.split(" ").slice(0,35).join(" ") + " ...");
        }
    },
    teaserText: DataTypes.STRING

  }, { sequelize, modelName: 'BlogPost' });
  // BlogPost.sync();
  BlogPost.sync({force: true}); //TODO: Remove this.  This wipes the blog list on each start, which is good for dev.


  return BlogPost;
}