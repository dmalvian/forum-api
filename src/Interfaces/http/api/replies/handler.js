const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addedReply = await addReplyUseCase.execute({
      ...request.payload,
      credentialId,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    await deleteReplyUseCase.execute({
      credentialId,
      threadId,
      commentId,
      replyId,
    });
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
