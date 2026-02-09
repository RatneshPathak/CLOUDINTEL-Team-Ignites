<<<<<<< HEAD
# CLOUDINTEL-Team-Ignites
A Neural Research Engine utilizing RAG (Retrieval-Augmented Generation) for high-precision extraction and page-level traceability from cloud computing documentation.
=======
# ⚛️ CLOUDINTEL: Neural Research Engine
**Developed by Team Ignites**

CloudIntel is a high-precision **Retrieval-Augmented Generation (RAG)** system designed to extract verified information from technical textbooks. It solves the "AI Hallucination" problem by enforcing a strict knowledge constraint: answers are derived *only* from the provided 389-page Cloud Computing dataset with mandatory page citations.

## 🚀 Key Features
* **Neural Retrieval:** Powered by `all-MiniLM-L6-v2` transformers for 384-dimensional vector semantic search.
* **MMR Innovation:** Implements **Maximal Marginal Relevance (MMR)** to ensure retrieved context is both highly relevant and diverse.
* **Traceability:** Real-time **Evidence Log** displaying query latency, semantic relevance scores, and source page numbers.
* **Research UX:** Features semantic highlighting, a persistent session history, and research note exportation.

## 🛠️ Technical Stack
* **Frontend:** HTML5, CSS3 (Glassmorphism), JavaScript (Asynchronous ES6+)
* **Backend:** Flask (Python)
* **Vector Database:** FAISS (Facebook AI Similarity Search)
* **AI Orchestration:** LangChain
* **Embeddings:** HuggingFace Transformers

## 🏗️ System Architecture


1.  **Ingestion:** The `engine.py` processes the PDF using `RecursiveCharacterTextSplitter` (800/120 overlap).
2.  **Indexing:** Segments are converted to vectors and stored in a local FAISS index.
3.  **Retrieval:** The `app.py` performs an MMR search and calculates real-time similarity scores.
4.  **UI:** A decoupled frontend renders results with a typewriter effect and semantic highlighting.

## 💻 Installation
1. Clone the repo:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/CLOUDINTEL-Team-Ignites.git](https://github.com/YOUR_USERNAME/CLOUDINTEL-Team-Ignites.git)
>>>>>>> 1c4faf0 (Initial commit: Neural Research Engine v3.0 by Team Ignites)
