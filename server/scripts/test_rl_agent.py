"""Small script to demonstrate training the QLearningAgent on a tiny env.

Run with: `python server/scripts/test_rl_agent.py`
"""
from server.ml_engine.rl_agent import QLearningAgent, train_on_env


class SimpleLineEnv:
    """A tiny deterministic 1D environment.

    States are integers 0..(n_states-1). Start at 0. Goal is n_states-1.
    Actions: 0 = move left, 1 = move right.
    Reward: +1 at reaching goal, 0 otherwise. Episode ends at goal or after max steps.
    """
    def __init__(self, n_states: int = 6, max_steps: int = 20):
        self.n_states = n_states
        self.max_steps = max_steps
        self.n_actions = 2
        self.state = 0
        self.steps = 0

    def reset(self):
        self.state = 0
        self.steps = 0
        return self.state

    def step(self, action: int):
        self.steps += 1
        if action == 0:
            nxt = max(0, self.state - 1)
        else:
            nxt = min(self.n_states - 1, self.state + 1)

        self.state = nxt
        reward = 1.0 if self.state == self.n_states - 1 else 0.0
        done = self.state == self.n_states - 1 or self.steps >= self.max_steps
        return self.state, reward, done, {}


def main():
    env = SimpleLineEnv(n_states=8, max_steps=30)
    agent = QLearningAgent(n_states=env.n_states, n_actions=env.n_actions, epsilon=0.5)

    print("Training agent on SimpleLineEnv...")
    rewards, lengths = train_on_env(env, agent, n_episodes=800, max_steps_per_episode=30)

    avg_last_50 = sum(rewards[-50:]) / 50 if len(rewards) >= 50 else sum(rewards) / max(1, len(rewards))
    print(f"Average reward (last 50 episodes): {avg_last_50:.3f}")
    print(f"Epsilon after training: {agent.epsilon:.4f}")

    # Show learned policy
    policy = [max(range(agent.n_actions), key=lambda a: agent.q_table[s][a]) for s in range(agent.n_states)]
    print("Learned policy (0=left,1=right):", policy)

    # Save q-table for inspection
    try:
        agent.save_q_table("server/scripts/q_table.txt")
        print("Saved Q-table to server/scripts/q_table.txt")
    except Exception as e:
        print("Failed to save Q-table:", e)


if __name__ == "__main__":
    main()
