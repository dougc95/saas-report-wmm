from fastapi import FastAPI
from app.routers import wmm_report
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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

# Leave for development
# @app.middleware("http")
# async def log_requests(request, call_next):
#     print(f"Request: {request.method} {request.url}")
#     print(f"Headers: {request.headers}")
#     response = await call_next(request)
#     return response


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}
