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
            var shortText = text.split(" ").slice(0,35).join(" ");
            var strippedShortText = shortText.replace(/(<([^>]+)>)/ig,"");
            this.setDataValue('teaserText', strippedShortText + " ...");
        }
    },
    teaserText: DataTypes.STRING

  }, { sequelize, modelName: 'BlogPost' });

  return BlogPost;
}