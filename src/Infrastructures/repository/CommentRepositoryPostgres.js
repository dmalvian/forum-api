const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const { mapCommentsTableToModel } = require('../../Commons/utils');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentToThread({ content, owner, threadId }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak tersedia');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_deleted, COUNT(cl.comment_id) AS like_count
        FROM comments AS c
        INNER JOIN users AS u
          ON c.owner = u.id
        LEFT JOIN commentlikes as cl
          ON c.id = cl.comment_id
        WHERE c.thread_id = $1
        GROUP BY c.id, u.username
        ORDER BY c.date`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapCommentsTableToModel);
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak tersedia');
    }
  }

  async verifyIfCommentLikedByUser(id, userId) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE comment_id = $1 AND user_id = $2',
      values: [id, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      return true;
    }

    return false;
  }

  async likeComment(id, userId) {
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2)',
      values: [id, userId],
    };

    await this._pool.query(query);
  }

  async cancelLikeComment(id, userId) {
    const query = {
      text: 'DELETE FROM commentlikes WHERE comment_id = $1 AND user_id = $2',
      values: [id, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
