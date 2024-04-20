import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
import random
import tensorflow as tf
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
import  keras.utils as ku
import matplotlib.pyplot as plt

def plot_neural_network_architecture(model, file_path):
    plt.figure(figsize=(12, 8))
    plt.title("Neural Network Architecture")

    # Plotting the layers
    for i in range(1, len(model.layers)):
        plt.arrow(0.1, i, 0.2, 0, color='black', linewidth=0.5, head_width=0.05, head_length=0.1)
        plt.text(0.25, i, f"{model.layers[i].get_config()['units']}", va='center', ha='center', backgroundcolor='w')

    plt.xlim(0, 1)
    plt.ylim(0, len(model.layers))
    plt.axis('off')
    plt.savefig(file_path, bbox_inches='tight', pad_inches=0.1)

# nltk.download('punkt')


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

print("Training data created")

print()
print("building the neural network")

# Create model - 3 layers. First layer 128 neurons, second layer 64 neurons and 3rd output layer contains number of neurons
# equal to number of intents to predict output intent with softmax
model = Sequential()
model.add(Dense(256, input_shape=(len(X_train[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(y_train[0]), activation='softmax'))

# Compile model. Stochastic gradient descent with Nesterov accelerated gradient gives good results for this model
print("compiling the neural network")
sgd = SGD(learning_rate=0.001, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])
ku.plot_model(model, to_file='model_architecture.png', show_shapes=True, show_layer_names=True)

# fitting and saving the mode
hist = model.fit(np.array(X_train), np.array(y_train), epochs=20, batch_size=5, verbose=1)
# model_path = "/home/iman/projects/kara/Projects/CI/codes/model.h5"
# model.save(model_path, hist)


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
print(f"Accuracy on the test data: {accuracy * 100:.2f}%")


#### testing with actual data

words = []
classes = []
documents = []
ignore_words = ['?', '!']
data = "/home/iman/projects/kara/Projects/CI/codes/test_data.json"
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
test_x = list(bags_of_words)
test_y = list(output_rows)

predictions_test = model.predict(np.array(test_x))

# Convert predictions to labels
predicted_labels_test = np.argmax(predictions_test, axis=1)
true_labels = np.argmax(test_y, axis=1)

# Calculate accuracy
accuracy = accuracy_score(true_labels, predicted_labels_test)
print(f"Accuracy on the actual test data: {accuracy * 100:.2f}%")
