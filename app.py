from flask import Flask, render_template, url_for
import jyserver.Flask as jsf

import sys
from os.path import dirname, abspath
d = dirname(abspath(__file__)) + "\\chatBotModel"
sys.path.append(d)

from chatBot import chatbot_response
import requests, json





app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/alo/<string:mess>', methods=['POST'])
def alo(mess):

    return chatbot_response(mess)
    #return chatbot_response(mess)

if __name__ == "__main__":
    app.run(debug=True)