import pickle


data = "/home/iman/projects/kara/Projects/CI/NLG/plots_text.pickle"
pickle_in = open(data,"rb")
movie_plots = pickle.load(pickle_in)

print("Example Plot Summaries:")
for i in range(5):  # Print the first 5 examples
    print(f"{i+1}. {movie_plots[i]}")