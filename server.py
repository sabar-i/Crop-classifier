import random
from fastapi import FastAPI,UploadFile,File,Request
import uvicorn
from predict import read_imagefile,preprocess,predict
import os
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
random_number = random.random()
app = FastAPI()

static_folder = os.path.join(os.path.dirname(__file__), "static")

# Jinja2Templates instance to render HTML templates
templates = Jinja2Templates(directory=static_folder)
# Serve static files (CSS, JS) from the "static" directory
app.mount("/static", StaticFiles(directory=static_folder), name="static")


@app.get("/")
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post('/api/predict')
async def classify_image(file: UploadFile = File(...)):
    contents = await file.read()
    image= read_imagefile(contents)
    image=preprocess(image)
    prediction=predict(image)
    prediction = prediction.tolist()
    if prediction[0]>0.5:
        label='Paddy'
        prediction=prediction[0]
    else:
        prediction= 1-prediction[0]
        label='Other crop'    
    return ("{:.3f}%".format(prediction*100),label)


if __name__=="__main__":
    uvicorn.run(app,port=8080,host="0.0.0.0")