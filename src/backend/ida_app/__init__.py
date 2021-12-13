import os
from flask import Flask
from flask_mail import Mail



mail = Mail()

def create_app():
    app=Flask(__name__)
    mail.init_app(app)
    return app



