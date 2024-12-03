import os
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from app.main import app

# Get the absolute path of the project root directory
root_dir = str(Path(__file__).parent.parent)

# Add the root directory to Python path
sys.path.append(root_dir) 

@pytest.fixture(scope="session")
def test_app():
    client = TestClient(app)
    return client

@pytest.fixture(scope="session", autouse=True)
def setup_test_env():
    # Setup test environment variables
    os.environ["TEST_MODE"] = "true"
    yield
    # Cleanup
    if "TEST_MODE" in os.environ:
        del os.environ["TEST_MODE"] 