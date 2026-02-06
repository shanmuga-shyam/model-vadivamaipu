"""Simple Q-learning agent suitable for small discrete environments.

This lightweight implementation avoids extra dependencies so it can be
added to the project with no additional requirements.

Environment interface expected:
 - env.reset() -> state_index (int)
 - env.step(action:int) -> (next_state:int, reward:float, done:bool, info:dict)
 - env.n_states (int)
 - env.n_actions (int)
"""
from typing import Optional, List, Tuple
import random
import math


class QLearningAgent:
    def __init__(
        self,
        n_states: int,
        n_actions: int,
        alpha: float = 0.1,
        gamma: float = 0.99,
        epsilon: float = 0.2,
        epsilon_min: float = 0.01,
        epsilon_decay: float = 0.995,
    ):
        self.n_states = n_states
        self.n_actions = n_actions
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_min = epsilon_min
        self.epsilon_decay = epsilon_decay

        # Q-table initialized to zeros
        self.q_table: List[List[float]] = [[0.0 for _ in range(n_actions)] for _ in range(n_states)]

    def choose_action(self, state: int) -> int:
        """Epsilon-greedy action selection."""
        if random.random() < self.epsilon:
            return random.randrange(self.n_actions)
        # choose best action (break ties randomly)
        qvals = self.q_table[state]
        max_q = max(qvals)
        best = [i for i, q in enumerate(qvals) if q == max_q]
        return random.choice(best)

    def learn(self, state: int, action: int, reward: float, next_state: int, done: bool) -> None:
        """Perform a single Q-learning update step."""
        q_sa = self.q_table[state][action]
        if done:
            target = reward
        else:
            target = reward + self.gamma * max(self.q_table[next_state])

        # Q-learning update
        self.q_table[state][action] = q_sa + self.alpha * (target - q_sa)

    def decay_epsilon(self) -> None:
        """Decay exploration rate after each episode."""
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

    def save_q_table(self, path: str) -> None:
        """Save Q-table to a simple text file."""
        with open(path, "w", encoding="utf-8") as f:
            for row in self.q_table:
                f.write(",".join(map(str, row)) + "\n")

    def load_q_table(self, path: str) -> None:
        """Load Q-table from a text file saved with save_q_table."""
        with open(path, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip()]
        loaded = [list(map(float, line.split(","))) for line in lines]
        if len(loaded) != self.n_states or any(len(r) != self.n_actions for r in loaded):
            raise ValueError("Loaded Q-table shape does not match agent configuration")
        self.q_table = loaded


def train_on_env(
    env,
    agent: QLearningAgent,
    n_episodes: int = 1000,
    max_steps_per_episode: int = 200,
) -> Tuple[List[float], List[int]]:
    """Train the provided agent on a small discrete env.

    Returns (episode_rewards, episode_lengths).
    """
    episode_rewards: List[float] = []
    episode_lengths: List[int] = []

    for ep in range(n_episodes):
        state = env.reset()
        total_reward = 0.0
        steps = 0

        for _ in range(max_steps_per_episode):
            action = agent.choose_action(state)
            next_state, reward, done, _ = env.step(action)
            agent.learn(state, action, reward, next_state, done)
            state = next_state
            total_reward += reward
            steps += 1
            if done:
                break

        agent.decay_epsilon()
        episode_rewards.append(total_reward)
        episode_lengths.append(steps)

    return episode_rewards, episode_lengths
