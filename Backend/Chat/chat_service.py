from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

class ChatService:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
        self.vectorstore = None

    def load_vectorstore(self, path):
        self.vectorstore = FAISS.load_local(path, OpenAIEmbeddings())

    def chat(self, query):
        if not self.vectorstore:
            return "Vectorstore not loaded. Please load a vectorstore first."
        
        qa_chain = ConversationalRetrievalChain.from_llm(self.llm, self.vectorstore.as_retriever())
        result = qa_chain({"question": query, "chat_history": []})
        return result["answer"]