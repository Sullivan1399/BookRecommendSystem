import pickle, joblib
from scipy.sparse import load_npz

# collaborative top-k
topk_neighbors = joblib.load("../recommendSystem/item_topk_neighbors.pkl")
indexMap = joblib.load("../recommendSystem/indexMap.pkl")
reverseMap = joblib.load("../recommendSystem/reverseIndexMap.pkl")

# KNN
nn_model = joblib.load("../recommendSystem/nn_model.joblib")
item_user_df = pickle.load(open("../recommendSystem/item_user_df.pkl", "rb"))
item_user_csr = load_npz("../recommendSystem/item_user_csr.npz")

# Content
tf = joblib.load("../recommendSystem/tfidf_vectorizer.pkl")
tfidf = load_npz("../recommendSystem/tfidf_matrix.npz")
popular_meta = joblib.load("../recommendSystem/popular_book_meta.pkl")
