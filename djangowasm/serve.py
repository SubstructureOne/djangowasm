import flask

app = flask.Flask(__name__)


@app.route('/static/<path>')
def static_data(path):
    response = flask.send_from_directory('static', path)
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # return app.send_static_file('index.html')
    # return app.send_static_file('postgrestest.html')
    # return app.send_static_file('asynctest.html')
    response = app.send_static_file('workertest.html')
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    # response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    return response
    # return flask.render_template(
    #     "servedjango.html",
    #     package_url='/static/djangosample.zip',
    #     settings_package='djangosample.settings',
    #     requirements=[
    #         'django',
    #         'django_postgresql_ws',
    #         'pgwasm==0.2.1',
    #     ],
    # )
