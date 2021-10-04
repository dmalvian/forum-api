const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedThread = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'comment content',
        isDeleted: false,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-08-08T07:25:33.555Z',
        content: 'reply content',
        isDeleted: false,
        commentId: 'comment-123',
      },
    ];
    const expectedDetailThread = new DetailThread({
      ...expectedThread,
      comments: expectedComments.map((comment) => {
        const filteredReplies = expectedReplies.filter((reply) => reply.commentId === comment.id);
        return {
          ...new DetailComment(comment),
          replies: filteredReplies.map((reply) => new DetailReply(reply)),
        };
      }),
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(useCasePayload.threadId);
  });
});
