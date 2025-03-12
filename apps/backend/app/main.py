from fastapi import FastAPI
from app.routers import wmm_report

app = FastAPI()

app.include_router(wmm_report.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}
