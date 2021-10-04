const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const { mapRepliesTableToModel } = require('../../Commons/utils');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyToComment({ content, owner, commentId }) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, owner, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak tersedia');
    }

    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT r.id, u.username, r.date, r.content, r.is_deleted, r.comment_id
        FROM replies AS r
        INNER JOIN users AS u
          ON r.owner = u.id
        INNER JOIN comments AS c
          ON r.comment_id = c.id
        WHERE c.thread_id = $1
        ORDER BY r.date`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapRepliesTableToModel);
  }
}

module.exports = ReplyRepositoryPostgres;
