const mapCommentsTableToModel = ({
  id, username, date, content, is_deleted,
}) => ({
  id, username, date, content, isDeleted: is_deleted,
});

module.exports = { mapCommentsTableToModel };
