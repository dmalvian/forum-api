const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentToThread function', () => {
    it('should persist new comment', async () => {
      // Arrange
      const credentialId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: credentialId });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addCommentToThread({
        content: 'comment content',
        owner: credentialId,
        threadId,
      });

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const credentialId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: credentialId });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addCommentToThread({
        content: 'comment content',
        owner: credentialId,
        threadId,
      });

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'comment content',
        owner: credentialId,
      }));
    });
  });
});
