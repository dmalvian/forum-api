const { mapCommentsTableToModel } = require('../index');

describe('mapCommentsTableToModel function', () => {
  it('should map comment object correctly', () => {
    const expectedComment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment content',
      isDeleted: false,
    };

    const comment = mapCommentsTableToModel({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment content',
      is_deleted: false,
    });

    expect(comment).toEqual(expectedComment);
  });
});
