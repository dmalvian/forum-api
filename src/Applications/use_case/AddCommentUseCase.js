class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { content, credentialId, threadId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    return this._commentRepository.addCommentToThread({
      content,
      owner: credentialId,
      threadId,
    });
  }

  _validatePayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;
