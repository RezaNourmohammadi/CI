import torch
import torch.nn as nn
import torch.optim as optim
from torchtext.data import Field, LabelField, TabularDataset, BucketIterator
from sklearn.metrics import accuracy_score
import torch.nn.functional as F
import spacy

# Download Spacy English language model
# Custom tokenizer function
spacy_en = spacy.load("en_core_web_sm")
def custom_tokenizer(text):
    return [tok.text for tok in spacy_en.tokenizer(text)]

# Set the random seed for reproducibility
torch.manual_seed(42)

# Define fields for text and labels with the custom tokenizer
TEXT = Field(tokenize=custom_tokenizer, lower=True, include_lengths=True)
LABEL = LabelField(dtype=torch.long)  # Use torch.long for class labels

# Load the AG News dataset directly from the CSV file
train_data, test_data = TabularDataset.splits(
    path='/home/iman/projects/kara/Projects/CI/shallow_network/data', train='train.csv', test='test.csv',
    format='csv', fields=[('label', LABEL), ('text', TEXT)])

# Perform train-test split

# Build vocabulary
TEXT.build_vocab(train_data, max_size=10000)
LABEL.build_vocab(train_data)

# Create iterators for training and testing sets
train_iterator, test_iterator = BucketIterator.splits(
    (train_data, test_data),
    batch_size=1,
    sort_within_batch=True,  # Sort within each batch by text length
    sort_key=lambda x: len(x.text),
)

class ShallowNN(nn.Module):
    def __init__(self, input_size, embedding_dim, output_size):
        super(ShallowNN, self).__init__()
        self.embedding = nn.Embedding(input_size, embedding_dim)
        self.fc1 = nn.Linear(embedding_dim, output_size)

    def forward(self, x):
        # x.text[0] contains the padded sequence
        # x.text[1] contains the lengths of each sequence in the batch
        embedded = self.embedding(x[0])

        # Sum along the sequence length dimension
        summed_embedded = torch.sum(embedded, dim=1)

        # Apply the first linear layer
        output = self.fc1(summed_embedded)

        return output

# Initialize the model, define loss function, and optimizer
input_size = len(TEXT.vocab)
embedding_dim = 300  # You may adjust this based on your embedding dimensions
output_size = len(LABEL.vocab)  # Use the number of classes
model = ShallowNN(input_size, embedding_dim, output_size)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training the model
num_epochs = 5  # Adjust as needed
for epoch in range(num_epochs):
    for batch in train_iterator:
        text, labels = batch.text, batch.label

        optimizer.zero_grad()

        outputs = model(text)

        # Print shapes for debugging
        print("Model Output Shape:", outputs.shape)
        print("Target Labels Shape:", labels.shape)

        # Calculate the actual batch size
        batch_size = labels.shape[0]

        # Modify the loss calculation to handle variable batch sizes
        loss = criterion(outputs[:batch_size], labels[:batch_size])
        loss.backward()
        optimizer.step()

# Evaluation on the test set
model.eval()
all_predictions = []
all_labels = []
with torch.no_grad():
    for batch in test_iterator:
        text, labels = batch.text, batch.label
        test_outputs = model(text)
        _, predicted = torch.max(test_outputs, 1)
        all_predictions.extend(predicted.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

# Calculate accuracy
accuracy = accuracy_score(all_labels, all_predictions)
print(f'Accuracy on the test set: {accuracy * 100:.2f}%')
