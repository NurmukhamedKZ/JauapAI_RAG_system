import uvicorn
from Backend.app.main import app

if __name__ == "__main__":
    uvicorn.run("Backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
