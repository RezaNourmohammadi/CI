import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
import random
from sklearn.metrics import accuracy_score

# nltk.download('punkt')

def create_dataset(json_file, words=None):
    lemmatizer = WordNetLemmatizer()
    classes = []
    documents = []
    ignore_words = ['?', '!']

    with open(json_file) as file:
        intents = json.load(file)

    bags_of_words = []
    output_rows = []

    for intent in intents['intents']:
        for pattern in intent['patterns']:
            w = nltk.word_tokenize(pattern)
            documents.append((w, intent['tag']))

            if intent['tag'] not in classes:
                classes.append(intent['tag'])
    
            if words is not None:
                # Update the vocabulary with unique words from the current pattern
                words.update(set([lemmatizer.lemmatize(word.lower()) for word in w]))

    if words is None:
        words = set()
        for doc in documents:
            words.update(set([lemmatizer.lemmatize(word.lower()) for word in doc[0]]))

    words = sorted(list(words))
    classes = sorted(list(set(classes)))

    for doc in documents:
        bag = []
        pattern_words = doc[0]
        pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]

        for w in words:
            bag.append(1) if w in pattern_words else bag.append(0)

        output_row = [0] * len(classes)
        output_row[classes.index(doc[1])] = 1

        bags_of_words.append(bag)
        output_rows.append(output_row)

    bags_of_words = np.array(bags_of_words)
    output_rows = np.array(output_rows)

    return bags_of_words, output_rows, words, classes

# Load and preprocess training data
data = "/home/iman/projects/kara/Projects/CI/codes/data.json"
train_bags_of_words, train_output_rows, train_words, train_classes = create_dataset(data)

# Load and preprocess test data
test_data = "/home/iman/projects/kara/Projects/CI/codes/test_data.json"
test_bags_of_words, test_output_rows, _, _ = create_dataset(test_data, words=set(train_words))

# Check and update the number of features to be the same for both training and testing data
max_features = max(len(train_bags_of_words[0]), len(test_bags_of_words[0]))
train_bags_of_words = train_bags_of_words[:, :max_features]
test_bags_of_words = test_bags_of_words[:, :max_features]

# Encode the labels
label_encoder = LabelEncoder()
train_labels_encoded = label_encoder.fit_transform(train_classes)
test_labels_encoded = label_encoder.transform(label_encoder.classes_)

# Split the data into training and testing sets
X_train, _, y_train, _ = train_test_split(train_bags_of_words, train_output_rows, test_size=0.1, random_state=7)
X_test, _, y_test, _ = train_test_split(test_bags_of_words, test_output_rows, test_size=0.1, random_state=7)

# Save the datasets and label encoder
np.save("X_train.npy", X_train)
np.save("y_train.npy", y_train)
np.save("X_test.npy", X_test)
np.save("y_test.npy", y_test)

# Save the label encoder for later use during predictions
with open("label_encoder.pkl", "wb") as le_file:
    pickle.dump(label_encoder, le_file)

print("Training data created")
print()
print("building the neural network")

# Create model
model = Sequential()
model.add(Dense(256, input_shape=(max_features,), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(32, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(y_train[0]), activation='softmax'))

# Compile model
print("compiling the neural network")
sgd = SGD(learning_rate=0.001, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Fitting the model
hist = model.fit(X_train, y_train, epochs=300, batch_size=5, verbose=1)

# Calculate accuracy
predictions_test = model.predict(X_test)

# Convert predictions to labels
predicted_labels_test = np.argmax(predictions_test, axis=1)
true_labels = np.argmax(y_test, axis=1)

# Calculate accuracy
accuracy = accuracy_score(true_labels, predicted_labels_test)

print("accuracy on test data :" , accuracy)
