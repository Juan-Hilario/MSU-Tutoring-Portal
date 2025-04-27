from flask import Flask, request, jsonify
from deepface import DeepFace
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.route('/analyze', methods=['POST'])
def analyze():
    print("Request content type:", request.content_type)
    print("Request headers:", dict(request.headers))
    print("Request form:", request.form)
    print("Request files keys:", list(request.files.keys()))
    print("Request files length:", len(request.files))

    if 'photo' not in request.files or 'registered' not in request.files:
        print("Missing required files. Available files:", list(request.files.keys()))
        return jsonify({'error': 'Both photos must be uploaded'}), 400
    
    photo = request.files['photo']
    registered = request.files['registered']

    uploads_folder = "../uploads"
    temp_photo_path = os.path.join(uploads_folder,'temp_photo.jpg')
    temp_registered_path = os.path.join(uploads_folder,'temp_registered.jpg')

    photo.save(temp_photo_path)
    registered.save(temp_registered_path)
    
    try:
        result = DeepFace.verify(img1_path=temp_photo_path, img2_path=temp_registered_path)
        return jsonify(result)
    
    except Exception as e:
        error_message = str(e)
        if "Exception while processing" in error_message:
            return jsonify({"message": "No face detected in image."}), 200

        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_photo_path):
            os.remove(temp_photo_path)
        if os.path.exists(temp_registered_path):
            os.remove(temp_registered_path)

if __name__ == '__main__':
    app.run(port=5000)
