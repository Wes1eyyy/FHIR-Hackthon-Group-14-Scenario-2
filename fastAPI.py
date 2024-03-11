from fastapi import FastAPI
from fastapi.responses import FileResponse
import subprocess

app = FastAPI()

@app.get("/")
def read_root():
    return {"Placeholder": "For root page"}

@app.get("/boxplot")
def get_plot():
    # Directly run the script to generate the boxplot image
    subprocess.run(['python', 'Boxplot_src.py'])
    
    # Serve the generated image file
    return FileResponse('boxplot.png')