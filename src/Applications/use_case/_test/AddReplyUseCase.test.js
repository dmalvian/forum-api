const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should throw error if use case payload not contain reply content', async () => {
    // Arrange
    const useCasePayload = {};
    const addReplyUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.NOT_CONTAIN_CONTENT');
  });

  it('should throw error if reply content not string', async () => {
    // Arrange
    const useCasePayload = {
      content: 1,
    };
    const addReplyUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'reply content',
      credentialId: 'user-123',
      threadId: 'thread-123',
    };
    const {
      content, credentialId, threadId, commentId,
    } = useCasePayload;
    const expectedAddedReply = new AddedReply({
      id: 'reply-321',
      content,
      owner: credentialId,
    });
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockReplyRepository.addReplyToComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReplyToComment).toBeCalledWith({
      content,
      owner: credentialId,
      commentId,
    });
  });
});
