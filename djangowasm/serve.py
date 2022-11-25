import flask

app = flask.Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # return app.send_static_file('index.html')
    return app.send_static_file('postgrestest.html')
