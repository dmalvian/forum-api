exports.up = (pgm) => {
  pgm.createTable('commentlikes', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('commentlikes', 'pk_comment_id_and_user_id', {
    primaryKey: ['comment_id', 'user_id'],
  });

  pgm.addConstraint(
    'commentlikes',
    'fk_commentlikes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'commentlikes',
    'fk_commentlikes.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('commentlikes');
};
