import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../databases/readingDatabase.js";

const Reading = sequelize.define(
  'Reading',
  {
    title: {
      type: DataTypes.STRING, // VARCHAR(255)
    },
    author: {
      type: DataTypes.STRING, // VARCHAR(255)
    },
    publisher: {
      type: DataTypes.STRING, // VARCHAR(255)
    },
    total_page: {
      type: DataTypes.SMALLINT, // SMALLINT
    },
    current_page: {
      type: DataTypes.SMALLINT, // SMALLINT
    },
    status: {
      type: DataTypes.ENUM,
      values: ['TBR', 'Reading', 'Finished', 'Dropped'],
    }
  },
  {
    tableName: "my_reading_list",
    timestamps: false,
  }
);

export default Reading;