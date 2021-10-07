const mapCommentsTableToModel = ({
  id, username, date, content, is_deleted, like_count,
}) => ({
  id, username, date, content, isDeleted: is_deleted, likeCount: Number(like_count),
});

const mapRepliesTableToModel = ({
  id, username, date, content, is_deleted, comment_id,
}) => ({
  id, username, date, content, isDeleted: is_deleted, commentId: comment_id,
});

module.exports = { mapCommentsTableToModel, mapRepliesTableToModel };
