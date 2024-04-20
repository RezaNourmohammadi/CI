import pickle
from keras.models import load_model

import nltk
from nltk.stem import WordNetLemmatizer
import json
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
import random
import tensorflow as tf
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split



lemmatizer = WordNetLemmatizer()
words = []
classes = []
documents = []
ignore_words = ['?', '!']
data = "/home/iman/projects/kara/Projects/CI/codes/data.json"
data_file = open(data).read()
intents = json.loads(data_file)

for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))

        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

path_texts = "/home/iman/projects/kara/Projects/CI/codes/texts.pkl"
path_labels = "/home/iman/projects/kara/Projects/CI/codes/labels.pkl"
pickle.dump(words, open(path_texts, 'wb'))
pickle.dump(classes, open(path_labels, 'wb'))

# create our training data
training = []
bags_of_words = []
output_rows = []

# create an empty array for our output
output_empty = [0] * len(classes)

# training set, bag of words for each sentence
for doc in documents:
    # initialize our bag of words
    bag = []
    # list of tokenized words for the pattern
    pattern_words = doc[0]
    # lemmatize each word - create base word, in an attempt to represent related words
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]
    # create our bag of words array with 1 if word match found in the current pattern
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)

    # output is a '0' for each tag and '1' for the current tag (for each pattern)
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1

    bags_of_words.append(bag)
    output_rows.append(output_row)

# shuffle our features and turn into np.array
training = list(zip(bags_of_words, output_rows))
random.shuffle(training)

# separate bags_of_words and output_rows
bags_of_words, output_rows = zip(*training)

# convert to np.array
bags_of_words = np.array(bags_of_words)
output_rows = np.array(output_rows)

# create train and test lists. X - patterns, Y - intents
train_x = list(bags_of_words)
train_y = list(output_rows)

X_train, X_test, y_train, y_test = train_test_split(train_x,
                                                    train_y,
                                                    test_size=0.3,
                                                    random_state=7)



model_path = "/home/iman/projects/kara/Projects/CI/codes/model.h5"
model = load_model(model_path)

predictions_test = model.predict(np.array(X_test))

# Convert predictions to labels
predicted_labels_test = np.argmax(predictions_test, axis=1)
true_labels = np.argmax(y_test, axis=1)

# Calculate accuracy
accuracy = accuracy_score(true_labels, predicted_labels_test)
print(f"Accuracy on the test data: {accuracy * 100:.2f}%")


predictions_train = model.predict(np.array(X_train))

# Convert predictions to labels
predicted_labels_train = np.argmax(predictions_train, axis=1)
true_labels = np.argmax(y_train, axis=1)

# Calculate accuracy
accuracy = accuracy_score(true_labels, predicted_labels_train)
print(f"Accuracy on the train data: {accuracy * 100:.2f}%")
