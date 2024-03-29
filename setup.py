from setuptools import setup, find_packages

with open('README.rst') as readme_file:
    readme = readme_file.read()

requirements = [
    'girder>=3.0.0a1'
]

setup(
    author='Girder Developer',
    author_email='girder.developer@example.com',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'License :: OSI Approved :: Apache Software License',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8'
    ],
    description='An example Girder plugin.',
    install_requires=requirements,
    license='Apache Software License 2.0',
    long_description=readme,
    long_description_content_type='text/x-rst',
    include_package_data=True,
    keywords='girder-plugin, associated_file_management',
    name='associated_file_management',
    packages=find_packages(exclude=['test', 'test.*']),
    url='https://github.com/girder/associated_file_management',
    version='0.1.0',
    zip_safe=False,
    entry_points={
        'girder.plugin': [
            'associated_file_management = associated_file_management:GirderPlugin'
        ]
    }
)
