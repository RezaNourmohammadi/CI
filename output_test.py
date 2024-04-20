import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import numpy as np
from keras.models import load_model

# nltk.download('punkt')

def preprocess_input(text, lemmatizer, words):
    w = nltk.word_tokenize(text)
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in w]

    bag = [1 if word in pattern_words else 0 for word in words]

    return np.array(bag)

def predict_intent(model, input_text, lemmatizer, words, classes):
    input_bag = preprocess_input(input_text, lemmatizer, words)
    input_bag = np.reshape(input_bag, (1, input_bag.shape[0]))

    # Make prediction
    prediction = model.predict(input_bag)

    # Convert prediction to label
    predicted_label = classes[np.argmax(prediction)]

    return predicted_label

# Load the trained model
model = load_model("/home/iman/projects/kara/Projects/CI/codes/model.h5")

# Load the label encoder
with open("/home/iman/projects/kara/Projects/CI/codes/label_encoder.pkl", "rb") as le_file:
    label_encoder = pickle.load(le_file)

# Load the vocabulary and classes
train_words = pickle.load(open('/home/iman/projects/kara/Projects/CI/codes/texts.pkl', 'rb'))
train_classes = pickle.load(open('/home/iman/projects/kara/Projects/CI/codes/labels.pkl', 'rb'))

# Example: Test a new query
# new_query = "Thank you"
# new_query =  "I need a book suggestion"
new_query = "What's a must-watch film"
lemmatizer = WordNetLemmatizer()

# Predict intent
predicted_intent = predict_intent(model, new_query, lemmatizer, train_words, train_classes)

print(f"Predicted Intent: {predicted_intent}")
