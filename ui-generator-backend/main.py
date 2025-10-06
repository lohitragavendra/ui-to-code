import os
import uuid
import shutil
from pathlib import Path
from datetime import datetime
# --- CHANGE HERE ---
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from services.vision_service import generate_code_from_image
from services.parser_service import parse_generated_code

load_dotenv()
app = FastAPI(title="UI to Code Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "UI to Code Generator API is running!"}

# --- CHANGE HERE: Note the response_class is removed for better error handling ---
@app.post("/generate-code", tags=["Code Generation"])
# --- CHANGE HERE: Add background_tasks parameter ---
async def generate_code_endpoint(image: UploadFile = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    if not os.getenv("GOOGLE_API_KEY"):
        raise HTTPException(status_code=500, detail="Google API key is not configured.")

    image_bytes = await image.read()
    raw_generated_text = await generate_code_from_image(image_bytes)
    if "Error:" in raw_generated_text: 
        raise HTTPException(status_code=500, detail=raw_generated_text)
        
    structured_code = parse_generated_code(raw_generated_text)
    if not structured_code: 
        raise HTTPException(status_code=500, detail={"message": "Failed to parse generated code."})

    temp_dir = Path(f"temp_output/{uuid.uuid4().hex}")
    
    # Write files to a temporary directory
    for file_path, code_content in structured_code.items():
        full_path = temp_dir / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(code_content, encoding='utf-8')
    
    # Create a zip archive of the temporary directory
    zip_path_base = f"generated_project_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    zip_path_str = shutil.make_archive(zip_path_base, 'zip', temp_dir)
    zip_path = Path(zip_path_str)

    # --- CHANGE HERE: The entire try...finally block is replaced with this ---
    # Add cleanup tasks to run AFTER the response is sent
    background_tasks.add_task(os.remove, zip_path)
    background_tasks.add_task(shutil.rmtree, temp_dir)
    
    # Return the zip file for download
    return FileResponse(
        path=zip_path,
        media_type='application/zip',
        filename=f"generated-ui-{datetime.now().strftime('%Y%m%d')}.zip"
    )