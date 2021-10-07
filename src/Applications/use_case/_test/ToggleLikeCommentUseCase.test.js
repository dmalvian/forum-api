const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const { credentialId, threadId, commentId } = useCasePayload;
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyIfCommentLikedByUser = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());

    // create use case instance
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyIfCommentLikedByUser).toBeCalledWith(commentId, credentialId);
    expect(mockCommentRepository.likeComment).toBeCalledWith(commentId, credentialId);
  });

  it('should orchestrating the cancel like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const { credentialId, threadId, commentId } = useCasePayload;
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyIfCommentLikedByUser = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.cancelLikeComment = jest.fn(() => Promise.resolve());

    // create use case instance
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyIfCommentLikedByUser).toBeCalledWith(commentId, credentialId);
    expect(mockCommentRepository.cancelLikeComment).toBeCalledWith(commentId, credentialId);
  });
});
