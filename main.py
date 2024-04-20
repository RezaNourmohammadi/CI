import re
import pickle
import random

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
from NLGNet import WordLSTM
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# create sequences of length 5 tokens
def create_seq(text, seq_len = 3):
    
    sequences = []

    # if the number of tokens in 'text' is greater than 5
    if len(text.split()) > seq_len:
      for i in range(seq_len, len(text.split())):
        # select sequence of tokens
        seq = text.split()[i-seq_len:i+1]
        # add to the list
        sequences.append(" ".join(seq))

      return sequences

    # if the number of tokens in 'text' is less than or equal to 5
    else:
      
      return [text]


def get_integer_seq(seq):
  return [token2int[w] for w in seq.split()]


def get_batches(arr_x, arr_y, batch_size):
         
    # iterate through the arrays
    prv = 0
    for n in range(batch_size, arr_x.shape[0], batch_size):
      x = arr_x[prv:n,:]
      y = arr_y[prv:n,:]
      prv = n
      yield x, y


def train(net, epochs=1, batch_size=32, lr=0.001, clip=1, print_every=32):
    
    # optimizer
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    
    # loss
    criterion = nn.CrossEntropyLoss()
    
    # # push model to GPU
    # net.cuda()
    
    counter = 0

    # net.train()

    for e in range(epochs):

        # initialize hidden state
        h = net.init_hidden(batch_size)
        
        for x, y in get_batches(x_int, y_int, batch_size):
            counter+= 1
            
            # convert numpy arrays to PyTorch arrays
            inputs, targets = torch.from_numpy(x), torch.from_numpy(y)
            
            # push tensors to GPU
            # inputs, targets = inputs.cuda(), targets.cuda()

            # detach hidden states
            h = tuple([each.data for each in h])

            # zero accumulated gradients
            net.zero_grad()
            
            # get the output from the model
            output, h = net(inputs, h)
            
            # calculate the loss and perform backprop
            loss = criterion(output, targets.view(-1))

            # back-propagate error
            loss.backward()

            # `clip_grad_norm` helps prevent the exploding gradient problem in RNNs / LSTMs.
            nn.utils.clip_grad_norm_(net.parameters(), clip)

            # update weigths
            opt.step()            
            
            if counter % print_every == 0:
            
              print("Epoch: {}/{}...".format(e+1, epochs),
                    "Step: {}...".format(counter))
              
              

def predict(net, tkn, h=None):
         
  # tensor inputs
  x = np.array([[token2int[tkn]]])
  inputs = torch.from_numpy(x)
  
  # push to GPU
  # inputs = inputs.cuda()

  # detach hidden state from history
  h = tuple([each.data for each in h])

  # get the output of the model
  out, h = net(inputs, h)

  # get the token probabilities
  p = F.softmax(out, dim=1).data

  p = p.cpu()

  p = p.numpy()
  p = p.reshape(p.shape[1],)

  # get indices of top 3 values
  top_n_idx = p.argsort()[-3:][::-1]

  # randomly select one of the three indices
  sampled_token_index = top_n_idx[random.sample([0,1,2],1)[0]]

  # return the encoded value of the predicted char and the hidden state
  return int2token[sampled_token_index], h

def sample(net, size, prime='it is'):
        
    # push to GPU
    # net.cuda()
    
    net.eval()

    # batch size is 1
    h = net.init_hidden(1)

    toks = prime.split()

    # predict next token
    for t in prime.split():
      token, h = predict(net, t, h)
    
    toks.append(token)

    # predict subsequent tokens
    for i in range(size-1):
        token, h = predict(net, toks[-1], h)
        toks.append(token)

    return ' '.join(toks)

data = "/home/iman/projects/kara/Projects/CI/NLG/plots_text.pickle"
pickle_in = open(data,"rb")
movie_plots = pickle.load(pickle_in)

# count of movie plot summaries
len(movie_plots)

random.sample(movie_plots, 5)

movie_plots = [re.sub("[^a-z' ]", "", i) for i in movie_plots]

seqs = [create_seq(i) for i in movie_plots]

# merge list-of-lists into a single list
seqs = sum(seqs, [])

# count of sequences
len(seqs)

x = []
y = []

for s in seqs:
  x.append(" ".join(s.split()[:-1]))
  y.append(" ".join(s.split()[1:]))


int2token = {}
cnt = 0

for w in set(" ".join(movie_plots).split()):
  int2token[cnt] = w
  cnt+= 1

# create token-to-integer mapping
token2int = {t: i for i, t in int2token.items()}

token2int["the"], int2token[14271]

vocabulary_size = len(int2token)

x_int = [get_integer_seq(i) for i in x]
y_int = [get_integer_seq(i) for i in y]

# convert lists to numpy arrays
x_int = np.array(x_int)
y_int = np.array(y_int)

net = WordLSTM(vocab_size=vocabulary_size)

print(net)

## train(net, batch_size = 32, epochs=20, print_every=256)


###### new part

x_train, x_test, y_train, y_test = train_test_split(x_int, y_int, test_size=0.2, random_state=42)

# Convert lists to numpy arrays
x_train = np.array(x_train)
y_train = np.array(y_train)
x_test = np.array(x_test)
y_test = np.array(y_test)

# Train the model
train(net, batch_size=8, epochs=1, print_every=256)

# Evaluate the model on the test set
net.eval()

# Initialize hidden state for the test set
batch_size_test = x_test.shape[0]
h_test = net.init_hidden(batch_size_test)

# Convert numpy arrays to PyTorch tensors
inputs_test, targets_test = torch.from_numpy(x_test), torch.from_numpy(y_test)

# Forward pass on the test set
outputs_test, _ = net(inputs_test, h_test)

# Reshape the outputs and targets for calculating accuracy
outputs_test = outputs_test.view(-1, len(int2token))
targets_test = targets_test.view(-1)

# Get predicted labels
predicted_labels = torch.argmax(outputs_test, dim=1)

# Calculate accuracy
accuracy = accuracy_score(targets_test.numpy(), predicted_labels.numpy())

print(f"Accuracy on the test set: {accuracy * 100:.2f}%")

print("yes")

sample(net, 15, prime = "one of the")
