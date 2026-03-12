import os
import json
import time
from dotenv import load_dotenv
from web3 import Web3
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.live import Live
from rich.layout import Layout

# Load environment variables
load_dotenv()

# Initialize Rich console
console = Console()

# Blockchain configuration
RPC_URL = os.getenv("RPC_URL", "https://api.avax-test.network/ext/bc/C/rpc")
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Contract addresses
AGENT_REGISTRY_ADDRESS = os.getenv("AGENT_REGISTRY_ADDRESS", "0x0000000000000000000000000000000000000000")
MISSION_MANAGER_ADDRESS = os.getenv("MISSION_MANAGER_ADDRESS", "0x0000000000000000000000000000000000000000")
REPUTATION_ENGINE_ADDRESS = os.getenv("REPUTATION_ENGINE_ADDRESS", "0x0000000000000000000000000000000000000000")

# ABIs (minimal)
AGENT_REGISTRY_ABI = json.loads("""[
    {"inputs":[{"name":"_agentId","type":"uint256"}],"name":"getAgent","outputs":[{"components":[{"name":"name","type":"string"},{"name":"metadataURI","type":"string"},{"name":"owner","type":"address"},{"name":"isActive","type":"bool"},{"name":"registeredAt","type":"uint256"}],"name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"nextAgentId","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"name":"_name","type":"string"},{"name":"_metadataURI","type":"string"}],"name":"registerAgent","outputs":[],"stateMutability":"nonpayable","type":"function"}
]""")

MISSION_MANAGER_ABI = json.loads("""[
    {"inputs":[{"name":"_missionId","type":"uint256"}],"name":"getMission","outputs":[{"components":[{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"creator","type":"address"},{"name":"reward","type":"uint256"},{"name":"assignedAgentId","type":"uint256"},{"name":"status","type":"uint8"},{"name":"createdAt","type":"uint256"},{"name":"completedAt","type":"uint256"}],"name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"nextMissionId","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]""")

REPUTATION_ABI = json.loads("""[
    {"inputs":[{"name":"_agentId","type":"uint256"}],"name":"getReputation","outputs":[{"components":[{"name":"totalMissions","type":"uint256"},{"name":"completedMissions","type":"uint256"},{"name":"failedMissions","type":"uint256"},{"name":"score","type":"uint256"},{"name":"lastUpdated","type":"uint256"}],"name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"name":"_agentId","type":"uint256"}],"name":"getScore","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]""")

ZERO_ADDR = "0x0000000000000000000000000000000000000000"
MISSION_STATUS = {0: "OPEN", 1: "ASSIGNED", 2: "COMPLETED", 3: "FAILED", 4: "CANCELLED"}


def check_connection():
    """Verify connection to Avalanche Fuji."""
    if w3.is_connected():
        chain_id = w3.eth.chain_id
        block_number = w3.eth.block_number
        console.print(Panel(
            f"[bold green]Connected to Avalanche Fuji[/bold green]\n"
            f"Chain ID: {chain_id}\n"
            f"Block:    {block_number}\n"
            f"RPC:      {RPC_URL}",
            title="[bold]Network Status[/bold]",
            border_style="green",
        ))
        return True
    else:
        console.print("[bold red]Failed to connect to blockchain.[/bold red]")
        return False


def get_contract(address, abi):
    """Get contract instance, return None if address is zero."""
    if address == ZERO_ADDR:
        return None
    return w3.eth.contract(address=Web3.to_checksum_address(address), abi=abi)


def display_agents():
    """Fetch and display all registered agents."""
    registry = get_contract(AGENT_REGISTRY_ADDRESS, AGENT_REGISTRY_ABI)
    if not registry:
        console.print("[yellow]AgentRegistry not deployed yet.[/yellow]")
        return

    count = registry.functions.nextAgentId().call()
    table = Table(title=f"Registered Agents ({count} total)", border_style="blue")
    table.add_column("ID", justify="right", style="cyan", no_wrap=True)
    table.add_column("Name", style="bold")
    table.add_column("Owner", style="dim")
    table.add_column("Status", style="magenta")
    table.add_column("Registered", justify="right", style="green")

    for i in range(count):
        agent = registry.functions.getAgent(i).call()
        status = "[green]ACTIVE[/green]" if agent[3] else "[red]INACTIVE[/red]"
        owner = f"{agent[2][:6]}...{agent[2][-4:]}"
        registered = time.strftime("%Y-%m-%d", time.gmtime(agent[4]))
        table.add_row(str(i), agent[0], owner, status, registered)

    console.print(table)


def display_missions():
    """Fetch and display all missions."""
    manager = get_contract(MISSION_MANAGER_ADDRESS, MISSION_MANAGER_ABI)
    if not manager:
        console.print("[yellow]MissionManager not deployed yet.[/yellow]")
        return

    count = manager.functions.nextMissionId().call()
    table = Table(title=f"Missions ({count} total)", border_style="magenta")
    table.add_column("ID", justify="right", style="cyan", no_wrap=True)
    table.add_column("Title", style="bold")
    table.add_column("Reward (AVRA)", justify="right", style="green")
    table.add_column("Status", style="magenta")
    table.add_column("Agent", justify="right")

    for i in range(count):
        mission = manager.functions.getMission(i).call()
        reward = str(w3.from_wei(mission[3], "ether"))
        status = MISSION_STATUS.get(mission[5], "UNKNOWN")
        agent_id = str(mission[4]) if mission[5] >= 1 else "-"
        table.add_row(str(i), mission[0], reward, status, agent_id)

    console.print(table)


def display_reputation(agent_id):
    """Display reputation for a specific agent."""
    engine = get_contract(REPUTATION_ENGINE_ADDRESS, REPUTATION_ABI)
    if not engine:
        console.print("[yellow]ReputationEngine not deployed yet.[/yellow]")
        return

    rep = engine.functions.getReputation(agent_id).call()
    score_pct = f"{rep[3] / 100:.2f}%" if rep[0] > 0 else "N/A"

    table = Table(title=f"Agent #{agent_id} Reputation", border_style="yellow")
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right")

    table.add_row("Total Missions", str(rep[0]))
    table.add_row("Completed", f"[green]{rep[1]}[/green]")
    table.add_row("Failed", f"[red]{rep[2]}[/red]")
    table.add_row("Score", f"[bold yellow]{score_pct}[/bold yellow]")

    console.print(table)


def display_dashboard():
    """Show full protocol dashboard."""
    console.print()
    console.rule("[bold blue]Avaira Protocol Dashboard[/bold blue]")
    console.print()

    display_agents()
    console.print()
    display_missions()
    console.print()


if __name__ == "__main__":
    console.print(Panel(
        "[bold]AVAIRA PROTOCOL[/bold]\n"
        "[dim]Autonomous AI Agent Simulator[/dim]",
        border_style="blue",
        expand=False,
    ))
    console.print()

    if check_connection():
        display_dashboard()
    else:
        console.print("[red]Cannot display dashboard without blockchain connection.[/red]")
