# import json
# import random
# import lorem

# def generate_intent(tag_prefix, num_patterns=3, num_responses=3):
#     tag = f"{tag_prefix}_{random.randint(1, 1000)}"
#     patterns = [lorem.text() for _ in range(num_patterns)]
#     responses = [lorem.sentence() for _ in range(num_responses)]

#     return {
#         "tag": tag,
#         "patterns": patterns,
#         "responses": responses,
#         "context_set": ""
#     }

# def generate_dataset(num_intents=1000):
#     intents = []

#     for i in range(num_intents):
#         tag_prefix = "custom"
#         if random.random() < 0.2:  # 20% chance of using a different tag prefix
#             tag_prefix = f"category{random.randint(1, 10)}"

#         intent = generate_intent(tag_prefix)
#         intents.append(intent)

#     return {"intents": intents}

# if __name__ == "__main__":
#     dataset = generate_dataset(num_intents=1000)

#     with open("generated_dataset.json", "w") as file:
#         json.dump(dataset, file, indent=2)

#     print("Dataset generated and saved to 'generated_dataset.json'.")


import json
import random

def generate_intent(tag_prefix, patterns, responses):
    tag = f"{tag_prefix}_{random.randint(1, 1000)}"
    return {
        "tag": tag,
        "patterns": patterns,
        "responses": responses,
        "context_set": ""
    }

def generate_dataset(num_intents=1000):
    intents = []

    for i in range(num_intents):
        tag_prefix = "custom"
        if random.random() < 0.2:  # 20% chance of using a different tag prefix
            tag_prefix = f"category{random.randint(1, 10)}"

        patterns = [
            "How can I",
            "Tell me about",
            "What is",
            "Explain",
            "Help me with"
        ]

        responses = [
            "I can assist you with that.",
            "Sure, here's some information.",
            "Let me provide you with the details.",
            "Certainly, I can help with that.",
            "Here's what you need to know."
        ]

        intent = generate_intent(tag_prefix, patterns, responses)
        intents.append(intent)

    return {"intents": intents}

if __name__ == "__main__":
    outputPath = "/home/iman/projects/kara/Projects/CI/codes/"
    dataset = generate_dataset(num_intents=1000)
    
    outputFile = outputPath + 'generated_dataset.json'

    with open(outputFile, "w") as file:
        json.dump(dataset, file, indent=2)

    print("Dataset generated and saved to 'generated_dataset.json'.")