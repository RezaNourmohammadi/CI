import pickle

# Specify the path to your .pkl file
file_path = "/home/iman/projects/kara/Projects/CI/codes/texts.pkl"

# Load the data from the .pkl file
with open(file_path, 'rb') as file:
    pickle.load(file)

# Now, 'loaded_data' contains the data stored in the .pkl file
print(loaded_data)