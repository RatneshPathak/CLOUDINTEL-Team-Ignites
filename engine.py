"""
ML2 Web-a-thon: Neural Research Engine v2.2 (Team Ignites)
High-Precision Ingestion: PDF Ingestion -> Clean Chunking -> Local FAISS Store
"""
import os
import sys

# Standard imports with version-safe protection
try:
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_community.vectorstores import FAISS
    print("✅ System: AI Libraries Verified.")
except ImportError as e:
    print(f"❌ Module Missing: {e}")
    print("💡 Try: pip install langchain-text-splitters langchain-huggingface langchain-community faiss-cpu pypdf")
    sys.exit(1)

def start_ingestion():
    # --- CONFIGURATION ---
    pdf_path = "cloud_computing_book.pdf"
    index_name = "faiss_index"
    model_name = "all-MiniLM-L6-v2" # 384-dimensional vector space
    
    # 1. High-Performance PDF Loading
    if not os.path.exists(pdf_path):
        print(f"❌ File Not Found: Please place '{pdf_path}' in the root directory.")
        return

    print(f"📖 Reading '{pdf_path}' (389 Pages)...")
    try:
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        print(f"📑 Successfully imported {len(pages)} pages.")
    except Exception as e:
        print(f"❌ Failed to load PDF: {e}")
        return

    # 2. Advanced Recursive Chunking
    # We use a 800/120 split to maintain semantic context
    print("✂️ Performing Semantic Chunking...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=120,
        separators=["\n\n", "\n", ". ", " ", ""],
        add_start_index=True 
    )
    docs = splitter.split_documents(pages)
    print(f"🧩 Created {len(docs)} smart text segments.")

    # 3. Neural Embedding Generation
    # Forced to CPU for maximum compatibility during the hackathon
    print(f"🧠 Initializing Neural Transformer ({model_name})...")
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={'device': 'cpu'} 
    )
    
    # 4. Vector Store Creation & Local Persistence
    print("💾 Indexing Knowledge Base into FAISS (Vector DB)...")
    try:
        # Building the index
        vector_db = FAISS.from_documents(docs, embeddings)
        
        # Saving the "Brain" locally
        vector_db.save_local(index_name)
        
        print("\n" + "="*40)
        print("🚀 DEPLOYMENT READY: Team Ignites Index Built")
        print(f"📍 Location: ./{index_name}/")
        print("🛠️ Next Step: Run 'python app.py'")
        print("="*40 + "\n")
        
    except Exception as e:
        print(f"❌ Error during vector indexing: {e}")

if __name__ == "__main__":
    # Ensure terminal remains clean
    os.system('cls' if os.name == 'nt' else 'clear')
    print("------------------------------------------")
    print("  CLOUDINTEL INGESTION ENGINE v2.2")
    print("------------------------------------------")
    start_ingestion()