from app.extensions import db

# Tabla de asociación para la relación Many-to-Many
grant_tags = db.Table(
    "grant_tags",
    db.Column("grant_id", db.Integer, db.ForeignKey("grant.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tag.id"), primary_key=True),
)


class Grant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    grant_name = db.Column(db.String(255), unique=True, nullable=False)
    grant_description = db.Column(db.Text, nullable=False)

    # Relación Many-to-Many
    tags = db.relationship(
        "Tag",
        secondary=grant_tags,
        lazy="subquery",
        backref=db.backref("grants", lazy=True),
    )

    def __repr__(self):
        return f"<Grant {self.grant_name}>"


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<Tag {self.name}>"
