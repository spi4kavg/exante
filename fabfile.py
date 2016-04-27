from fabric.api import *


def deploy():
    local("sudo rm -rf venv")
    local("sudo apt-get install " + " ".join([
        "rabbitmq-server",
        "virtualenv",
        'libxml2-dev',
        'libxslt1-dev',
        'python-dev'
    ]))
    local('virtualenv venv')

    pip = "venv/bin/pip"
    local('{} install -r requirements.txt'.format(pip))
    python = "venv/bin/python"
    local("{} exante/manage.py migrate".format(python))
    local("{} exante/manage.py loaddata dump.json".format(python))
    locla("{} exante/manage.py test".format(python))
