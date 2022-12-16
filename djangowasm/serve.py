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
    # response = app.send_static_file('postgrestest.html')
    # return app.send_static_file('asynctest.html')
    # response = app.send_static_file('workertest.html')
    response = app.send_static_file('servedjango.html')
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

@app.route('/test/micropip/<package>')
def packageloadtest(package):
    html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js"></script>
    <script>
        async function main() {
            try {
                let pyodide = await loadPyodide()
                await pyodide.loadPackage('micropip')
                const micropip = pyodide.pyimport('micropip')
                await micropip.install('PACKAGE_NAME')
                document.getElementById('result').innerHTML = "Success."
            } catch (e) {
                console.log(`Error: ${e}`)
                document.getElementById('result').innerHTML = `Failure.`
            }
        }
        main().then()
    </script>
</head>
<body>
    <div id="result" data-cy="result">Loading...</div>
</body>
    """
    return app.make_response(html.replace("PACKAGE_NAME", package))
