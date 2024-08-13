"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "fox",
          password:
            "$2a$10$dAhJTZ1yFYsl6LD4BMFgi.kgEE.MSzJ.IEmDuexgR2s6aoIR62NG.",
        },
        {
          name: "<u>w</u>",
          password:
            "$2a$10$wWiBKhJW1HKju1Zk/bymhOTK6s.Z4INzqsdc6ptsAnk7fDiJVxlMu",
        },
        {
          name: "881",
          password:
            "$2a$10$3AjVu1Ci8vSHQX1034objudFpgYFDWpwtNS6aKoie88gUq1.EClTS",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
