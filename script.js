// Array of enemies with stats
const enemies = [
  { name: 'Gerburt', vitality: 5, melee: 6, defense: 3, intellect: 2, wisdom: 1 },
];

// Player stats
let player = { hp: 100, mp: 50, isDefending: false, vitality: 0, melee: 0, defense: 0, intellect: 0, wisdom: 0 };
let enemy = getRandomEnemy();
let pointsLeft = 35;

// Function to select a random enemy
function getRandomEnemy() {
  const randomIndex = Math.floor(Math.random() * enemies.length);
  const selectedEnemy = enemies[randomIndex];
  selectedEnemy.hp = 50 + selectedEnemy.vitality * 5;
  selectedEnemy.mp = 30 + selectedEnemy.intellect * 2;
  return selectedEnemy;
}

// Update stats display
function updateStats() {
  // Player stats
  document.getElementById('player-hp').textContent = player.hp;
  document.getElementById('player-mp').textContent = player.mp;
  document.getElementById('stat-vitality').textContent = player.vitality;
  document.getElementById('stat-melee').textContent = player.melee;
  document.getElementById('stat-defense').textContent = player.defense;
  document.getElementById('stat-intellect').textContent = player.intellect;
  document.getElementById('stat-wisdom').textContent = player.wisdom;

  // Enemy stats
  document.getElementById('enemy-name').textContent = enemy.name;
  document.getElementById('enemy-hp').textContent = enemy.hp;
  document.getElementById('enemy-mp').textContent = enemy.mp;
  document.getElementById('enemy-vitality').textContent = enemy.vitality;
  document.getElementById('enemy-melee').textContent = enemy.melee;
  document.getElementById('enemy-defense').textContent = enemy.defense;
  document.getElementById('enemy-intellect').textContent = enemy.intellect;
  document.getElementById('enemy-wisdom').textContent = enemy.wisdom;
}

// Validate and update points
function validatePoints() {
  const vitality = parseInt(document.getElementById('vitality').value);
  const melee = parseInt(document.getElementById('melee').value);
  const defense = parseInt(document.getElementById('defense').value);
  const intellect = parseInt(document.getElementById('intellect').value);
  const wisdom = parseInt(document.getElementById('wisdom').value);

  const total = vitality + melee + defense + intellect + wisdom;
  pointsLeft = 35 - total;

  document.getElementById('points-left').textContent = pointsLeft;

  if (pointsLeft >= 0 && vitality <= 10 && melee <= 10 && defense <= 10 && intellect <= 10 && wisdom <= 10) {
    document.getElementById('start-battle-btn').disabled = false;
  } else {
    document.getElementById('start-battle-btn').disabled = true;
  }
}

// Event listeners for stat inputs
const statInputs = document.querySelectorAll('.stat-input');
statInputs.forEach(input => input.addEventListener('input', validatePoints));

// Start battle
document.getElementById('start-battle-btn').addEventListener('click', function() {
  player.vitality = parseInt(document.getElementById('vitality').value);
  player.melee = parseInt(document.getElementById('melee').value);
  player.defense = parseInt(document.getElementById('defense').value);
  player.intellect = parseInt(document.getElementById('intellect').value);
  player.wisdom = parseInt(document.getElementById('wisdom').value);

  // Adjust player stats based on selected attributes
  player.hp = 50 + player.vitality * 5;
  player.mp = 30 + player.wisdom * 2;

  // Hide stat allocation and show battle section
  document.getElementById('stat-allocation').style.display = 'none';
  document.getElementById('battle-section').style.display = 'block';

  updateStats();
});

// Add a message to the battle log
function logMessage(message) {
  const log = document.getElementById('battle-log');
  log.innerHTML += `<p>${message}</p>`;
  log.scrollTop = log.scrollHeight;
}

// Player's turn actions
document.getElementById('attack-btn').addEventListener('click', function() {
  const damage = Math.floor(Math.random() * 10) + 1 + player.melee;
  enemy.hp -= damage;
  logMessage(`You attacked the ${enemy.name} for ${damage} damage.`);
  endTurn();
});

document.getElementById('defend-btn').addEventListener('click', function() {
  player.isDefending = true;
  logMessage('You defend yourself, reducing incoming damage.');
  endTurn();
});

document.getElementById('blast-btn').addEventListener('click', function() {
  if (player.mp >= 10) {
    const damage = Math.floor(Math.random() * 15) + 1 + player.intellect;
    enemy.hp -= damage;
    player.mp -= 10;
    logMessage(`You used Energy Blast for ${damage} damage on the ${enemy.name}.`);
    endTurn();
  } else {
    logMessage('Not enough MP!');
  }
});

document.getElementById('heal-btn').addEventListener('click', function() {
  if (player.mp >= 10) {
    const heal = Math.floor(Math.random() * 10) + 1 + player.wisdom;
    player.hp = Math.min(player.hp + heal, 100);
    player.mp -= 10;
    logMessage(`You healed yourself for ${heal} HP.`);
    endTurn();
  } else {
    logMessage('Not enough MP!');
  }
});

document.getElementById('wait-btn').addEventListener('click', function() {
  logMessage('You wait for the enemy to act.');
  endTurn();
});

document.getElementById('flee-btn').addEventListener('click', function() {
  logMessage('You fled from battle!');
  disableButtons();
});

// Function to change the NPC image temporarily
function changeNpcImage(action) {
  const npcImage = document.getElementById('npc-image');
  let originalSrc = npcImage.src;

  // Map action to corresponding image
  let actionImageMap = {
      'attack': '../assets/1stB13.png',
      'wait': '../assets/1stB9.png',
      'energyBlast': '../assets/1stB13.png'
  };

  // Change the NPC image based on action
  npcImage.src = actionImageMap[action];

  // After 3 seconds, revert back to the original image
  setTimeout(() => {
      npcImage.src = originalSrc;
  }, 2000);
}

// Enemy's turn
function enemyTurn() {
  const action = Math.floor(Math.random() * 3);
  let damage;

  if (action === 0) { // Attack
      changeNpcImage('attack');
      damage = Math.floor(Math.random() * 10) + 1 + enemy.melee;
      if (player.isDefending) {
          damage = Math.floor(damage / 2);
      }
      player.hp -= damage;
      logMessage(`The ${enemy.name} attacked you for ${damage} damage.`);
  } else if (action === 1 && enemy.mp >= 10) { // Energy Blast
      changeNpcImage('energyBlast');
      damage = Math.floor(Math.random() * 15) + 1 + enemy.intellect;
      player.hp -= damage;
      enemy.mp -= 10;
      logMessage(`The ${enemy.name} used Energy Blast for ${damage} damage.`);
  } else { // Wait
      changeNpcImage('wait');
      logMessage(`The ${enemy.name} waits.`);
  }

  updateStats();
  checkGameOver();
  player.isDefending = false;
}


// End the player's turn
function endTurn() {
  updateStats();
  checkGameOver();
  setTimeout(enemyTurn, 1000);
}

// Check if the game is over
function checkGameOver() {
  if (player.hp <= 0) {
    logMessage('You have been defeated!');
    disableButtons();
  } else if (enemy.hp <= 0) {
    logMessage(`You defeated the ${enemy.name}!`);
    disableButtons();
  }
}

// Disable all action buttons
function disableButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);
}

// Initialize the game with the selected enemy
updateStats();
