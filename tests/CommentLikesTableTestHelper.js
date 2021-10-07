/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addCommentLike(
    commentId = 'comment-123',
    userId = 'user-123',
  ) {
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2)',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async findCommentLikes(commentId, userId) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM commentlikes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
