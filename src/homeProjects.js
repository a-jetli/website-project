// Add a new quoted item to description for each paragraph.
// Example: description: ["First paragraph.", "Second paragraph."]
// A single string is also supported.


const homeProjects = [
  {
    projectId: "rotation",
    summary: "A music listening history, trends and analytics viewing tool.",
    description: [
      "Rotation is my most recent project. I constantly listen to music, whether it's while studying, doing chores, playing games, or just for fun. However, I was getting frustrated that the platform I used didn't expose too much of my listening history or trends publicly to get insights from - like what albums or artists I'm most enjoying right now, what genres I'm looping through, or what's that one song that played last night while I was driving and couldn't check my phone?",

      "Not getting these insights from Spotify, I chose to implement them myself. I chose to use Last.fm's API to source streams (or \"scrobbles\"), because it's free and easy to work with, and allows grouping of streams from multiple services under a single account's umbrella. You can demo it yourself if you're signed up for Last.fm by visiting rotation.ajetli.com, or explore the GitHub repository linked above. "
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker Compose", "Amazon EC2"],
  },
  {
    projectId: "rag-pipeline",
    summary: "An LLM research agent that answers your research questions with research paper sources.",
    description: [
      "You can ask this agent any question across AI/ML topics and it will formulate an answer based only on what it knows, sourced from 1000 papers spanning topics in AI/ML. It cites the papers and excerpt chunks it uses to answer your question. If it lacks the information or just cannot answer correctly, it lets you know that as well.",

      "I learned many new technologies for this project, including RAG (Retrieval-Augmented Generation) to work from a known knowledge base and minimize hallucination and false statements, LangGraph to create an agentic loop, breaking queries into subqueries, chunk retrieval and reranking, and a lot more. You can demo it at rag.ajetli.com, or read more about it under the architecture tab or view the source papers under the papers tab."     
    ],
    stack: ["Python", "LangGraph", "FastAPI", "ChromaDB", "OpenAI API", "BM25"],
  },
  {
    projectId: "text-rpg",
    summary: "A playable text based RPG adventure featuring an LLM narrator and a persistent world.",
    description: [
      "What if you could take advantage of what language models do best and have it narrate your way through your own adventure novel? What if you gave the story that it told actual permanence to survive context loss, degradation and compaction while minimizing hallucination or retroactively changing details, as LLMs sometimes like to do?",

      "This was the driving idea behind this unnamed text based role playing game project. The LLM acts as a narrator, crafting a world full of locations, dialogue, characters and more. The Python engine itself retains full control over an actual game state - this is what separates it from a simple chat session. Facts about the world, narrative arcs, characters and situations, they're all stored and smartly retrieved to be sent to the LLM as needed per call - since the model has no real memory between API calls.",

      "I'm frequently iterating on this project and you can read more about it at the linked Github repository."
    ],
  },
]

export default homeProjects

