from setuptools import setup, find_packages

setup(
    name="your_project",
    version="1.0",
    packages=find_packages(include=['db', 'apps', 'core', 'logs', 'config']),
    include_package_data=True,
)

