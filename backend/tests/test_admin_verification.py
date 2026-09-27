"""
Simple tests for admin verification endpoints.
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.api.v1.admin_verification import router

def test_admin_verification_routes_exist():
    """Test that admin verification routes are defined."""
    # Check that the router exists and has routes
    assert router is not None
    # Get the routes from the router
    routes = [route.path for route in router.routes]
    # Check that our expected routes exist
    assert any("/verification/queue" in route for route in routes)
    assert any("/verification/" in route and "/approve" in route for route in routes)
    assert any("/verification/" in route and "/reject" in route for route in routes)
    print("✓ Admin verification routes test passed")

if __name__ == "__main__":
    test_admin_verification_routes_exist()