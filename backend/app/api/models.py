from app.extensions import db

# Association table for the Many-to-Many relationship
# NOTE: The table name is set to "grant_tags" here.
# The ForeignKeys MUST point to the new table names: 'grants.id' and 'tags.id'
grant_tags = db.Table(
    "grant_tags",
    db.Column("grant_id", db.Integer, db.ForeignKey("grants.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)


class Grant(db.Model):
    __tablename__ = 'grants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)

    # Many-to-Many relationship
    tags = db.relationship(
        "Tag",
        secondary=grant_tags,
        lazy="subquery",
        backref=db.backref("grants", lazy=True),
    )

    def __repr__(self):
        return f"<Grant {self.name}>"


class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<Tag {self.name}>"