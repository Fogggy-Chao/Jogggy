from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import api
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Get environment variables with defaults
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
PORT = int(os.getenv('PORT', 8000))
HOST = os.getenv('HOST', '0.0.0.0')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")