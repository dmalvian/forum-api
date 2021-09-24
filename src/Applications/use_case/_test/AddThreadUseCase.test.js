const NewThread = require('../../../Domains/threads/entitites/NewThread');
const AddedThread = require('../../../Domains/threads/entitites/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };
    const credentialId = 'user-321';
    const expectedAddedThread = new AddedThread({
      id: 'thread-321',
      title: useCasePayload.title,
      owner: credentialId,
    });
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    // create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      credentialId,
    );
  });
});
