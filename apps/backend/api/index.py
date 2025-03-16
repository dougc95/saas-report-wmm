from fastapi import FastAPI

import sys
import os

# Add parent directories to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)


from app.routers import wmm_report

app = FastAPI()

app.include_router(wmm_report.router)

# Leave for development
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Request: {request.method} {request.url}")
    print(f"Headers: {request.headers}")
    response = await call_next(request)
    return response


@app.get("/api/health")
def read_root():
    return {"message": "Hello all OK!"}
