const { mapCommentsTableToModel, mapRepliesTableToModel } = require('../index');

describe('mapCommentsTableToModel function', () => {
  it('should map comment object correctly', () => {
    const expectedComment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment content',
      isDeleted: false,
      likeCount: 2,
    };

    const comment = mapCommentsTableToModel({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment content',
      is_deleted: false,
      like_count: '2',
    });

    expect(comment).toEqual(expectedComment);
  });
});

describe('mapRepliesTableToModel function', () => {
  it('should map reply object correctly', () => {
    const expectedReply = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'reply content',
      isDeleted: false,
      commentId: 'comment-123',
    };

    const reply = mapRepliesTableToModel({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'reply content',
      is_deleted: false,
      comment_id: 'comment-123',
    });

    expect(reply).toEqual(expectedReply);
  });
});
