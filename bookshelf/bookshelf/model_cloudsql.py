# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask
from flask_sqlalchemy import SQLAlchemy


builtin_list = list


db = SQLAlchemy()


def init_app(app):
    # Disable track modifications, as it unnecessarily uses memory.
    app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    db.init_app(app)


def from_sql(row):
    """Translates a SQLAlchemy model instance into a dictionary"""
    data = row.__dict__.copy()
    data['id'] = row.id
    data.pop('_sa_instance_state')
    return data


# [START model]
class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    author = db.Column(db.String(255))
    publishedDate = db.Column(db.String(255))
    imageUrl = db.Column(db.String(255))
    description = db.Column(db.String(4096))
    createdBy = db.Column(db.String(255))
    createdById = db.Column(db.String(255))

    def __repr__(self):
        return "<Book(title='%s', author=%s)" % (self.title, self.author)

class Rate(db.Model):
    __tablename__ = 'rates'
    #__table_args__ = (UniqueConstraint("userid","bookid"),)

    userid = db.Column(db.Integer, primary_key=True)
    bookid = db.Column(db.Integer, db.ForeignKey("books.id") ,primary_key=True)
    rate = db.Column(db.Integer)

    def __repr__(self):
        return "<Rate(book='%d', user='%d', rate='%d')" % (self.bookid, self.userid, self.rate)

# [END model]


# [START list]
def list(limit=10, cursor=None, title=None, author=None, year=None):
    print("list!")
    print(cursor, title, author, year)
    cursor = int(cursor) if cursor else 0

    if title == None or author == None or year == None:
        query = (Book.query
                .order_by(Book.title)
                .limit(limit)
                .offset(cursor))
    else:
        query = (Book.query
                .filter(Book.title.contains(title) & Book.author.contains(author) & Book.publishedDate.contains(year))
                .order_by(Book.title)
                .limit(limit)
                .offset(cursor))
    books = builtin_list(map(from_sql, query.all()))
    next_page = cursor + limit if len(books) == limit else None
    return (books, next_page)
# [END list]


# [START read]
def read(id):
    print("read!")
    result = Book.query.get(id)
    if not result:
        return None
    return from_sql(result)
# [END read]

# [START avg_rate]
def avg_rate(id):
    print("avg_rate!")
    results = Rate.query.filter_by(bookid=id).all()
    if len(results)==0:
        return "Not Rated Yet"
    avg_rates = 0
    for result in results:
        avg_rates += result.rate
    avg_rates = avg_rates/len(results)
    return avg_rates
# [END avg_rate]

# [START create]
def create(data):
    print("create!")
    book = Book(**data)
    db.session.add(book)
    db.session.commit()
    return from_sql(book)
# [END create]


# [START update]
def update(data, id):
    print("update!")
    book = Book.query.get(id)
    print(book)
    for k, v in data.items():
        setattr(book, k, v)
    db.session.commit()
    return from_sql(book)
# [END update]

# [START rate]
def rate(data, id):
    print("rate created!")
    existed_num = Rate.query.filter_by(userid=data['userid'], bookid=id).count()
    data["bookid"] = id

    if existed_num == 0:
        rate = Rate(**data)
        db.session.add(rate)
        db.session.commit()
    elif existed_num == 1:
        existed_info = Rate.query.filter_by(userid=data['userid'], bookid=id).first()
        existed_info.rate = data["rate"]
        db.session.commit()
    else:
        print("[Error]: two or more reviews exist.")
    return data
    #return from_sql(rate)
# [END rate]

def delete(id):
    Book.query.filter_by(id=id).delete()
    db.session.commit()


def _create_database():
    """
    If this script is run directly, create all the tables necessary to run the
    application.
    """
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')
    init_app(app)
    with app.app_context():
        db.create_all()
    print("All tables created")


if __name__ == '__main__':
    _create_database()
