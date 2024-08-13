"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "comments",
      [
        {
          content: "First post of the year!",
          UserId: 1,
        },
        {
          content: "Looking forward to great collaborations.",
          UserId: 1,
        },
        {
          content: "Excited about new projects!",
          UserId: 2,
        },
        {
          content: "Happy to be part of this community!",
          UserId: 3,
        },
        {
          content: "Can't wait for the upcoming events!",
          UserId: 2,
        },
        {
          content: "Here's to making a difference!",
          UserId: 3,
        },
        {
          content: "Thrilled about the new features we're launching.",
          UserId: 1,
        },
        {
          content: "Ready to tackle new challenges!",
          UserId: 2,
        },
        {
          content: "Inspired by the positive feedback we've received.",
          UserId: 1,
        },
        {
          content: "Celebrating our team's achievements.",
          UserId: 3,
        },
        {
          content: "Eager to see what the future holds!",
          UserId: 2,
        },
        {
          content: "Grateful for all the support from our followers.",
          UserId: 3,
        },
        {
          content: "Let's make this year count!",
          UserId: 1,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("comments", null, {});
  },
};
