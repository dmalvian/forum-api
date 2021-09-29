const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if use case payload not contain comment content', async () => {
    // Arrange
    const useCasePayload = {};
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
  });

  it('should throw error if comment content not string', async () => {
    // Arrange
    const useCasePayload = {
      content: 1,
    };
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment content',
      credentialId: 'user-123',
      threadId: 'thread-123',
    };
    const { content, credentialId, threadId } = useCasePayload;
    const expectedAddedComment = new AddedComment({
      id: 'comment-321',
      content,
      owner: credentialId,
    });
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockCommentRepository.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.addCommentToThread).toBeCalledWith({
      content,
      owner: credentialId,
      threadId,
    });
  });
});
