#!/usr/bin/env node

const { spawn } = require("child_process");
const http = require("http");
const readline = require("readline");

const FRONTEND_URL = "http://localhost:5173";
const API_URL = "http://localhost:8000";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function run(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(`${command} ${args.join(" ")} failed with code ${code}`),
        );
    });
  });
}

function waitForUrl(url) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      http
        .get(url, () => {
          clearInterval(interval);
          resolve();
        })
        .on("error", () => {});
    }, 1500);
  });
}

function openBrowser(url) {
  const platform = process.platform;

  if (platform === "darwin") {
    spawn("open", [url], { shell: true, detached: true });
  } else if (platform === "win32") {
    spawn("start", [url], { shell: true, detached: true });
  } else {
    spawn("xdg-open", [url], { shell: true, detached: true });
  }
}

function showControlHelp() {
  console.log(`
${colors.bold}Orbit Control Shell${colors.reset}

Type one of these commands:

  stop_orbit       Stop frontend, backend, and database containers
  logs             Show live logs
  logs backend     Show backend logs
  logs frontend    Show frontend logs
  logs postgres    Show database logs
  status           Show running containers
  open             Open frontend in browser
  restart          Restart all services
  migrate          Run Prisma migrate dev
  deploy_migrate   Apply existing Prisma migrations
  studio           Open Prisma Studio
  db               Open Postgres CLI
  help             Show this help
  exit             Exit shell only, containers keep running
`);
}

function controlShell() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "orbit> ",
  });

  showControlHelp();
  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    const [cmd, target] = input.split(" ");

    try {
      switch (cmd) {
        case "stop_orbit":
        case "stop":
          log("Stopping Yantrix Orbit...", colors.yellow);
          await run("docker", ["compose down"]);
          rl.close();
          process.exit(0);
          break;

        case "logs":
          if (target) {
            await run("docker", [`compose logs -f ${target}`]);
          } else {
            await run("docker", ["compose logs -f"]);
          }
          break;

        case "status":
        case "ps":
          await run("docker", ["compose ps"]);
          break;

        case "open":
          openBrowser(FRONTEND_URL);
          break;

        case "restart":
          log("Restarting Yantrix Orbit...", colors.yellow);
          await run("docker", ["compose restart"]);
          break;

        case "migrate":
          await run("docker", ["compose exec backend npx prisma migrate dev"]);
          break;

        case "deploy_migrate":
          await run("docker", [
            "compose exec backend npx prisma migrate deploy",
          ]);
          break;

        case "studio":
          await run("docker", ["compose exec backend npx prisma studio"]);
          break;

        case "db":
          await run("docker", [
            "compose exec postgres psql -U postgres -d space_platform",
          ]);
          break;

        case "help":
          showControlHelp();
          break;

        case "exit":
          log("Exiting Orbit shell. Containers are still running.", colors.cyan);
          rl.close();
          process.exit(0);
          break;

        case "":
          break;

        default:
          log("Unknown command. Type 'help' to see available commands.", colors.red);
          break;
      }
    } catch (error) {
      log(error.message, colors.red);
    }

    rl.prompt();
  });
}

async function main() {
  const [command, target, extra] = process.argv.slice(2);

  switch (command) {
    case "start":
      log("Starting Yantrix Orbit...", colors.cyan);
      await run("docker", ["compose up -d --build"]);

      log("Waiting for frontend...", colors.yellow);
      await waitForUrl(FRONTEND_URL);

      log(`Opening ${FRONTEND_URL}`, colors.green);
      openBrowser(FRONTEND_URL);

      log("Yantrix Orbit is running.", colors.green);
      controlShell();
      break;

    case "stop":
      log("Stopping Yantrix Orbit...", colors.yellow);
      await run("docker", ["compose down"]);
      break;

    case "restart":
      log("Restarting Yantrix Orbit...", colors.yellow);
      await run("docker", ["compose restart"]);
      break;

    case "rebuild":
      log("Rebuilding Yantrix Orbit without cache...", colors.yellow);
      await run("docker", ["compose build --no-cache"]);
      await run("docker", ["compose up -d"]);
      break;

    case "logs":
      if (target) {
        await run("docker", [`compose logs -f ${target}`]);
      } else {
        await run("docker", ["compose logs -f"]);
      }
      break;

    case "status":
    case "ps":
      await run("docker", ["compose ps"]);
      break;

    case "reset":
      log("Resetting containers and database volume...", colors.red);
      await run("docker", ["compose down -v"]);
      await run("docker", ["compose up -d --build"]);
      await run("docker", ["compose exec backend npx prisma migrate deploy"]);
      break;

    case "migrate":
      if (target) {
        await run("docker", [
          `compose exec backend npx prisma migrate dev --name ${target}`,
        ]);
      } else {
        await run("docker", ["compose exec backend npx prisma migrate dev"]);
      }
      break;

    case "migrate:deploy":
      await run("docker", ["compose exec backend npx prisma migrate deploy"]);
      break;

    case "migrate:status":
      await run("docker", ["compose exec backend npx prisma migrate status"]);
      break;

    case "generate":
      await run("docker", ["compose exec backend npx prisma generate"]);
      break;

    case "studio":
      await run("docker", ["compose exec backend npx prisma studio"]);
      break;

    case "shell":
      if (target === "backend") {
        await run("docker", ["compose exec backend sh"]);
      } else if (target === "frontend") {
        await run("docker", ["compose exec frontend sh"]);
      } else if (target === "db") {
        await run("docker", ["compose exec postgres sh"]);
      } else {
        log("Usage: npx orbit shell backend|frontend|db", colors.red);
      }
      break;

    case "db":
      await run("docker", [
        "compose exec postgres psql -U postgres -d space_platform",
      ]);
      break;

    case "env":
      if (target === "backend") {
        await run("docker", ["compose exec backend printenv"]);
      } else if (target === "frontend") {
        await run("docker", ["compose exec frontend printenv"]);
      } else {
        log("Usage: npx orbit env backend|frontend", colors.red);
      }
      break;

    case "test":
      if (target === "backend") {
        await run("docker", ["compose exec backend npm test"]);
      } else if (target === "frontend") {
        await run("docker", ["compose exec frontend npm test"]);
      } else {
        log("Usage: npx orbit test backend|frontend", colors.red);
      }
      break;

    case "install":
      if (target === "backend" && extra) {
        await run("docker", [`compose exec backend npm install ${extra}`]);
      } else if (target === "frontend" && extra) {
        await run("docker", [`compose exec frontend npm install ${extra}`]);
      } else {
        log(
          "Usage: npx orbit install backend|frontend package-name",
          colors.red,
        );
      }
      break;

    case "open":
      openBrowser(FRONTEND_URL);
      break;

    case "health":
      log(`Frontend: ${FRONTEND_URL}`, colors.cyan);
      log(`Backend: ${API_URL}`, colors.cyan);
      await run("docker", ["compose ps"]);
      break;

    case "help":
    default:
      console.log(`
${colors.bold}Orbit CLI for Yantrix${colors.reset}

${colors.bold}Core Commands${colors.reset}
  npx orbit start                 Start full stack, open frontend, enter Orbit shell
  npx orbit stop                  Stop full stack
  npx orbit restart               Restart all services
  npx orbit rebuild               Rebuild without cache and start
  npx orbit status                Show running containers
  npx orbit open                  Open frontend in browser
  npx orbit health                Show URLs and container status

${colors.bold}Interactive Start Shell${colors.reset}
  After running "npx orbit start", type:
  stop_orbit                      Stop frontend, backend, and database containers
  logs                            Show live logs
  status                          Show running containers
  open                            Open frontend
  restart                         Restart services
  exit                            Exit shell only

${colors.bold}Logs${colors.reset}
  npx orbit logs                  Show all logs
  npx orbit logs backend          Show backend logs
  npx orbit logs frontend         Show frontend logs
  npx orbit logs postgres         Show database logs

${colors.bold}Database / Prisma${colors.reset}
  npx orbit migrate               Run prisma migrate dev
  npx orbit migrate init          Run prisma migrate dev --name init
  npx orbit migrate:deploy        Apply existing migrations
  npx orbit migrate:status        Check migration status
  npx orbit generate              Generate Prisma client
  npx orbit studio                Open Prisma Studio
  npx orbit db                    Open Postgres CLI
  npx orbit reset                 Reset DB volume and rebuild

${colors.bold}Shells${colors.reset}
  npx orbit shell backend         Open backend shell
  npx orbit shell frontend        Open frontend shell
  npx orbit shell db              Open database shell

${colors.bold}Environment${colors.reset}
  npx orbit env backend           Print backend env
  npx orbit env frontend          Print frontend env

${colors.bold}Tests${colors.reset}
  npx orbit test backend          Run backend tests
  npx orbit test frontend         Run frontend tests

${colors.bold}Install Packages${colors.reset}
  npx orbit install backend axios
  npx orbit install frontend axios
`);
      break;
  }
}

main().catch((error) => {
  log(error.message, colors.red);
  process.exit(1);
});