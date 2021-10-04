const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-321',
      username: 'owner username',
      date: 'reply date',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-321',
      username: 'dicoding',
      date: {},
      content: {},
      isDeleted: {},
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-321',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'reply content',
      isDeleted: false,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.content).toEqual(payload.content);
  });

  it('should create reply object correctly and replace content value when isDeleted is true', () => {
    // Arrange
    const payload = {
      id: 'reply-321',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'reply content',
      isDeleted: true,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });
});
