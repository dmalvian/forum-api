const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId }) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    return new DetailThread({
      ...thread,
      comments: comments.map((comment) => {
        const filteredReplies = replies.filter((reply) => reply.commentId === comment.id);
        return {
          ...new DetailComment(comment),
          replies: filteredReplies.map((reply) => new DetailReply(reply)),
        };
      }),
    });
  }
}

module.exports = GetThreadUseCase;
