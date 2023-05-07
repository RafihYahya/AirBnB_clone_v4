#!/usr/bin/python3
"""Simple Flask app, with additional route"""
from flask import Flask, abort, render_template
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place
from uuid import uuid4

app = Flask(__name__)
app.url_map.strict_slashes = False


# begins rendering
@app.route('/1-hbnb')
def filters():
    """load filters"""
    cache_id = uuid4()
    states = storage.all(State).values()
    amenities = storage.all(Amenity).values()
    places = storage.all(Place).values()
    return render_template('1-hbnb.html', states=states, amenities=amenities, places=places, cache_id=cache_id)


@app.teardown_appcontext
def do_teardown(self):
    """Closes session"""
    storage.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
