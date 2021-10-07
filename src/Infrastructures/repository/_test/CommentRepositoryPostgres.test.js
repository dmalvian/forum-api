const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
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

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment owner is not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-000'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner is match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should soft delete comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123'));

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_deleted).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments array correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', date: '2021-08-08T07:22:33.555Z' });
      await CommentsTableTestHelper.addComment({ id: 'comment-124', date: '2021-08-08T07:26:21.338Z' });
      await CommentLikesTableTestHelper.addCommentLike('comment-123', 'user-123');
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: 'comment content',
          isDeleted: false,
          likeCount: 1,
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'comment content',
          isDeleted: false,
          likeCount: 0,
        },
      ]);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyIfCommentLikedByUser function', () => {
    it('should return false when the comment is not liked by provided user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const isCommentLiked = await commentRepositoryPostgres.verifyIfCommentLikedByUser('comment-123', 'user-123');

      // Assert
      expect(isCommentLiked).toEqual(false);
    });

    it('should return true when the comment is already liked by provided user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike('comment-123', 'user-123');
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const isCommentLiked = await commentRepositoryPostgres.verifyIfCommentLikedByUser('comment-123', 'user-123');

      // Assert
      expect(isCommentLiked).toEqual(true);
    });
  });

  describe('likeComment function', () => {
    it('should add like data to database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.likeComment('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikes('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('cancelLikeComment function', () => {
    it('should delete like data from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike('comment-123', 'user-123');
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.cancelLikeComment('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikes('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });
});
