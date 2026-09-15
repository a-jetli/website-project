const homeProjects = [
  {
    projectId: "rotation",
    description: "My most recent project is a listening history and analytics tool for music streaming platforms. I felt Spotify's history feature didn't give all the information I wanted, like specific tables of songs I've played or listening trends, so I implemented them myself. I chose to use Last.fm's API to source scrobbles (streams) because it's easier to work with and can group streams from multiple services under one account's umbrella. You can demo it yourself if you've signed up for Last.fm by visiting rotation.ajetli.com, and read more about it at the linked GitHub repo.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker Compose", "Amazon EC2"],
  },
  {
    projectId: "rag-pipeline",
    description: "Prior to that, I worked on building a research agent via a RAG pipeline over 1000 research papers spanning topics in AI. I have personally used it as a learning tool. I chose RAG rather than LLM calls not only to learn the technology, but because it helps avoid hallucination and reliance on training data. The knowledge base can be quickly and cheaply expanded in the future without requiring any retraining, as well. You can ask it any question on AI/ML related topics, and it will formulate an answer based only on its source papers, which it can cite and source for you. It works on a LangGraph agent that breaks queries into subqueries, fetches relevant chunks, ranks and reranks them, and checks if a sufficient answer can be formed. If not, it tries again. You can demo it at rag.ajetli.com, or read more about it under the architecture tab. You can also view all the source papers under the papers tab.",
    stack: ["Python", "LangGraph", "FastAPI", "ChromaDB", "OpenAI API", "BM25"],
  },
  {
    projectId: "text-rpg",
    description: "An ongoing project of mine is a presently unnamed text based RPG game where an LLM acts as a world builder and narrator for a text based adventure. The idea was to be able to play through your own book, where narratively you were the main character but you did not dictate the state of the world beyond yourself. You are free to make your own actions, and the world should respond in kind. However, to make this work as a full scale project I had to figure out logging and retrieval strategies. My solution uses a deterministic Python engine that owns the game state and an LLM that returns game state alterations in an enforced structured output format, allowing the engine to receive and resolve all changes and reduce risk of hallucination. I'm constantly iterating on this project and you can read more about it or look through the code at the GitHub repo linked above.",
  },
]

export default homeProjects
