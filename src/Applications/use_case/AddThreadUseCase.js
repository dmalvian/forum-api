const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ title, body, credentialId }) {
    const newThread = new NewThread({ title, body });
    return this._threadRepository.addThread(newThread, credentialId);
  }
}

module.exports = AddThreadUseCase;
