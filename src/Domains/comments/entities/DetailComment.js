class DetailComment {
  constructor(payload) {
    this._validatePayload(payload);

    const {
      id, username, date, content, isDeleted, likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
    this.likeCount = likeCount;
  }

  _validatePayload(payload) {
    const {
      id, username, date, content, isDeleted, likeCount,
    } = payload;

    if (
      !id
      || !username
      || !date
      || !content
      || isDeleted === undefined
      || likeCount === undefined
    ) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof isDeleted !== 'boolean'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
