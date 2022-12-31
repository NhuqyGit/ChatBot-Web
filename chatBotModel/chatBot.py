import nltk
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()
import pickle
import numpy as np

from os.path import dirname, abspath

from keras.models import load_model
import json
import random

d = dirname(abspath(__file__))
model = load_model(d + '\\chatbot_model.h5')
intents = json.loads(open(d + '\\intents.json').read())
words = pickle.load(open(d + '\\words.pkl','rb'))
classes = pickle.load(open(d + '\\classes.pkl','rb'))


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for w in sentence_words:
        for i,word in enumerate(words):
            if word == w: 
                bag[i] = 1
    return(np.array(bag))

def predict_class(sentence):
    p = bow(sentence)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i,r] for i,r in enumerate(res) if r>ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def getResponse(ints, intents_json):
    tag = ints[0]['intent']
    result=""
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if(i['tag']== tag):
            result = random.choice(i['responses'])
            break
    return result

def chatbot_response(msg):
    ints = predict_class(msg)
    res = getResponse(ints, intents)
    return res