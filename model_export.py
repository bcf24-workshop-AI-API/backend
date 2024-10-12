from ultralytics import YOLO

# Load the YOLO model
model = YOLO("yolo11n.pt")

# Export the model to TF.js format
model.export(format="tfjs") # https://docs.ultralytics.com/integrations/tfjs/#usage