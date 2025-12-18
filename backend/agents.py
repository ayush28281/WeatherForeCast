import os
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from tools import weather_tool


class WeatherAgent:
    def __init__(self):
        openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

        if not openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")

        self.llm = ChatOpenAI(
            model="mistralai/mistral-7b-instruct",
            openai_api_key=openrouter_api_key,
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=0.7,
        )

        self.tools = [weather_tool]

        prompt_template = """You are a helpful weather assistant. Your job is to help users get weather information for cities.

You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Important guidelines:
- If the user asks about weather in a city, use the get_weather tool
- Extract the city name from the user's question
- Provide a natural, conversational response based on the weather data
- If the user's question is not about weather, politely inform them that you're a weather assistant

Begin!

Question: {input}
Thought: {agent_scratchpad}"""

        self.prompt = PromptTemplate(
            input_variables=["input", "tools", "tool_names", "agent_scratchpad"],
            template=prompt_template
        )

        # ✅ Correct: assign to self.agent
        self.agent = create_react_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )

        # ✅ FIXED: use self.agent and self.tools
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=True,
            max_iterations=5,
            max_execution_time=30,
            handle_parsing_errors=True
        )

    async def process_query(self, query: str) -> str:
        try:
            result = await self.agent_executor.ainvoke({"input": query})
            return result["output"]

        except Exception as e:
            return (
                "I apologize, but I encountered an error while processing "
                f"your request: {str(e)}"
            )
