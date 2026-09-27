"""
Simple tests for storage service.
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.services.storage_service import StorageService

def test_storage_service_import():
    """Test that storage service can be imported."""
    service = StorageService()
    assert service is not None
    assert hasattr(service, 'upload_verification_document')
    assert hasattr(service, 'get_verification_document_url')
    assert hasattr(service, 'delete_verification_document')
    print("✓ Storage service import test passed")

if __name__ == "__main__":
    test_storage_service_import()