from fastapi import FastAPI
from app.routers import wmm_report
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wmm_report.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}
