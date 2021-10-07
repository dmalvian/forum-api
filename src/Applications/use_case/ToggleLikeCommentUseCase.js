class ToggleLikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ credentialId, threadId, commentId }) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const isCommentLiked = await this._commentRepository
      .verifyIfCommentLikedByUser(commentId, credentialId);

    if (!isCommentLiked) {
      await this._commentRepository.likeComment(commentId, credentialId);
    } else {
      await this._commentRepository.cancelLikeComment(commentId, credentialId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
