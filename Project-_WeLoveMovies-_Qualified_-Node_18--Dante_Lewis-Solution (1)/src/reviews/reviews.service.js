const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function addCriticsToReviews(review) {
  return knex("reviews as r")
    .select()
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({ "r.review_id": review.review_id })
    .first()
    .then(addCritics);
}

function list(movie_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ movie_id })
    .then((data) => {
      return data.map((item) => {
        return addCritics(item);
      });
    });
}

function read(review_id) {
  return knex("reviews").select().where({ review_id }).first();
}

function update(updatedReview) {
  return knex("reviews")
    .select()
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  list,
  read,
  update,
  addCriticsToReviews,
  delete: destroy,
};