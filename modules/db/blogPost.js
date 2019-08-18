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
    teaserText: {
        type: DataTypes.VIRTUAL,
        get() {
            var text = this.getDataValue('text');
            if (text) {
                return text.split(" ").slice(0,35).join(" ") + " ..."
            }
            return "";
        }
    }

  }, { sequelize, modelName: 'BlogPost' });
//   BlogPost.sync();
  BlogPost.sync({force: true}); //TODO: Remove this.  This wipes the blog list on each start, which is good for dev.

  return BlogPost;
}