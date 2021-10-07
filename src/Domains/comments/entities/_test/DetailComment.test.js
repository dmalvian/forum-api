const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-321',
      username: 'owner username',
      date: 'comment date',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-321',
      username: 'dicoding',
      date: {},
      content: {},
      isDeleted: {},
      likeCount: {},
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-321',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment content',
      isDeleted: false,
      likeCount: 2,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
  });

  it('should create comment object correctly and replace content value when isDeleted is true', () => {
    // Arrange
    const payload = {
      id: 'comment-321',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment content',
      isDeleted: true,
      likeCount: 2,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.likeCount).toEqual(payload.likeCount);
  });
});
