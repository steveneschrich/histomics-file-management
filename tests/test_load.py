import pytest

from girder.plugin import loadedPlugins


@pytest.mark.plugin('associated_file_management')
def test_import(server):
    assert 'associated_file_management' in loadedPlugins()
